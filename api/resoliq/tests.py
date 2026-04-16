from django.test import TestCase
from django.utils import timezone
from rest_framework.serializers import ValidationError
from rest_framework.test import APIClient

from api.resoliq.models import Client, Driver, Residue
from api.resoliq.serializers.orders import OrderSerializer
from api.users.models import User


class OrderMovementTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="admin@test.cl",
            username="admin",
            first_name="Admin",
            last_name="Test",
            dni="11111111-1",
            type_user="ADM",
            is_verified=True,
            is_active=True,
        )
        self.user.set_password("Admin1234!")
        self.user.save()

        self.client_obj = Client.objects.create(name="Cliente", dni="1-9")
        self.driver_obj = Driver.objects.create(name="Conductor", dni="2-7")
        self.residue = Residue.objects.create(name="Cartón", type_medition="KG", quantity=10)

        self.req = type("R", (object,), {"user": self.user})()

    def test_create_withdrawal_deducts_inventory_and_sets_observation(self):
        data = {
            "date": str(timezone.localdate()),
            "movement": "OUT",
            "is_reposition": False,
            "items": [{"residue": self.residue.id, "quantity": 4}],
        }
        serializer = OrderSerializer(data=data, context={"request": self.req})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        self.residue.refresh_from_db()
        self.assertEqual(self.residue.quantity, 6)
        self.assertEqual(order.movement, "OUT")
        self.assertEqual(order.registers.count(), 1)
        self.assertTrue(order.registers.first().observation.startswith(f"Retiro Orden #{order.id}."))

    def test_create_withdrawal_insufficient_stock_raises_error(self):
        self.residue.quantity = 1
        self.residue.save(update_fields=["quantity"])
        data = {
            "date": str(timezone.localdate()),
            "movement": "OUT",
            "is_reposition": False,
            "items": [{"residue": self.residue.id, "quantity": 2}],
        }
        serializer = OrderSerializer(data=data, context={"request": self.req})
        serializer.is_valid(raise_exception=True)
        with self.assertRaises(ValidationError):
            serializer.save()

    def test_create_ingreso_reposicion_increases_inventory_and_sets_observation(self):
        data = {
            "date": str(timezone.localdate()),
            "movement": "IN",
            "is_reposition": True,
            "items": [{"residue": self.residue.id, "quantity": 3}],
        }
        serializer = OrderSerializer(data=data, context={"request": self.req})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        self.residue.refresh_from_db()
        self.assertEqual(self.residue.quantity, 13)
        self.assertEqual(order.movement, "IN")
        self.assertTrue(order.registers.first().observation.startswith(f"Reposición Orden #{order.id}."))

    def test_update_disallows_movement_change(self):
        data = {
            "date": str(timezone.localdate()),
            "client": self.client_obj.id,
            "driver": self.driver_obj.id,
            "movement": "IN",
            "is_reposition": False,
            "items": [{"residue": self.residue.id, "quantity": 1}],
        }
        serializer = OrderSerializer(data=data, context={"request": self.req})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        update = OrderSerializer(order, data={"movement": "OUT"}, partial=True, context={"request": self.req})
        update.is_valid(raise_exception=True)
        with self.assertRaises(ValidationError):
            update.save()

    def test_update_disallows_registers_change(self):
        data = {
            "date": str(timezone.localdate()),
            "client": self.client_obj.id,
            "driver": self.driver_obj.id,
            "movement": "IN",
            "is_reposition": False,
            "items": [{"residue": self.residue.id, "quantity": 1}],
        }
        serializer = OrderSerializer(data=data, context={"request": self.req})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        update = OrderSerializer(order, data={"registers": []}, partial=True, context={"request": self.req})
        update.is_valid(raise_exception=True)
        with self.assertRaises(ValidationError):
            update.save()

    def test_create_normal_requires_client_and_driver(self):
        data = {
            "date": str(timezone.localdate()),
            "movement": "IN",
            "is_reposition": False,
            "items": [{"residue": self.residue.id, "quantity": 1}],
        }
        serializer = OrderSerializer(data=data, context={"request": self.req})
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)


class OrderApiSmokeTests(TestCase):
    def setUp(self):
        self.password = "Admin1234!"
        self.user = User.objects.create(
            email="admin@test.cl",
            username="admin",
            first_name="Admin",
            last_name="Test",
            dni="11111111-1",
            type_user="ADM",
            is_verified=True,
            is_active=True,
        )
        self.user.set_password(self.password)
        self.user.save()

        self.client_obj = Client.objects.create(name="Cliente", dni="1-9")
        self.driver_obj = Driver.objects.create(name="Conductor", dni="2-7")
        self.residue = Residue.objects.create(name="Cartón", type_medition="KG", quantity=10)

        self.api = APIClient()

    def _login(self):
        res = self.api.post(
            "/api/auth/users/login/",
            {"email": self.user.email, "password": self.password},
            format="json",
        )
        self.assertIn(res.status_code, (200, 201))
        token = res.data.get("access_token")
        self.assertTrue(token)
        self.api.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        return token

    def test_auth_and_list_endpoints(self):
        self._login()
        for url in [
            "/api/clients/",
            "/api/drivers/",
            "/api/residues/",
            "/api/orders/",
        ]:
            res = self.api.get(url)
            self.assertEqual(res.status_code, 200, msg=f"GET {url} failed")

    def test_create_order_withdrawal_via_api(self):
        self._login()
        data = {
            "date": str(timezone.localdate()),
            "movement": "OUT",
            "is_reposition": False,
            "items": [{"residue": self.residue.id, "quantity": 4}],
        }
        res = self.api.post("/api/orders/", data, format="json")
        self.assertEqual(res.status_code, 201)
        self.residue.refresh_from_db()
        self.assertEqual(self.residue.quantity, 6)

    def test_create_order_withdrawal_insufficient_stock_via_api(self):
        self._login()
        self.residue.quantity = 1
        self.residue.save(update_fields=["quantity"])
        data = {
            "date": str(timezone.localdate()),
            "movement": "OUT",
            "is_reposition": False,
            "items": [{"residue": self.residue.id, "quantity": 4}],
        }
        res = self.api.post("/api/orders/", data, format="json")
        self.assertEqual(res.status_code, 400)
