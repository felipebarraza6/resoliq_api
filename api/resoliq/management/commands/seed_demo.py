from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from rest_framework.authtoken.models import Token

from api.resoliq.models import Client, Driver, Order, RegisterResidue, Residue
from api.users.models import User


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true")

    @transaction.atomic
    def handle(self, *args, **options):
        if options["reset"]:
            Order.objects.all().delete()
            RegisterResidue.objects.all().delete()
            Residue.objects.all().delete()
            Driver.objects.all().delete()
            Client.objects.all().delete()
            User.objects.all().delete()

        admin_user = self._upsert_user(
            email="admin@demo.cl",
            username="admin",
            first_name="Admin",
            last_name="Demo",
            dni="11111111-1",
            phone_number="+56911111111",
            type_user="ADM",
            password="Admin1234!",
            is_staff=True,
            is_superuser=True,
        )
        warehouse_user = self._upsert_user(
            email="bodega@demo.cl",
            username="bodega",
            first_name="Bodega",
            last_name="Demo",
            dni="22222222-2",
            phone_number="+56922222222",
            type_user="BDG",
            password="Bodega1234!",
            is_staff=False,
            is_superuser=False,
        )

        admin_token = Token.objects.get_or_create(user=admin_user)[0].key
        warehouse_token = Token.objects.get_or_create(user=warehouse_user)[0].key

        clients = [
            self._upsert_client(
                name="Constructora Andes SPA",
                dni="76.123.456-7",
                phone_number="+56223456789",
                email="contacto@andes.cl",
                address="Av. Providencia 1234",
                commune="Providencia",
                contact_name="María Pérez",
                executive="Juan Soto",
            ),
            self._upsert_client(
                name="Servicios Mineros Norte Ltda",
                dni="77.987.654-3",
                phone_number="+56512223344",
                email="operaciones@mineronorte.cl",
                address="Camino Industrial 450",
                commune="Antofagasta",
                contact_name="Carlos Rojas",
                executive="Camila Díaz",
            ),
        ]

        drivers = [
            self._upsert_driver(
                name="Pedro González",
                vehicle_plate="ABCD12",
                dni="12.345.678-9",
                phone_number="+56933333333",
            ),
            self._upsert_driver(
                name="Ana Morales",
                vehicle_plate="EFGH34",
                dni="9.876.543-2",
                phone_number="+56944444444",
            ),
        ]

        residues = [
            self._upsert_residue(name="Aceite usado", type_medition="L", quantity=0),
            self._upsert_residue(name="Baterías plomo-ácido", type_medition="UN", quantity=0),
            self._upsert_residue(name="Cartón", type_medition="KG", quantity=0),
            self._upsert_residue(name="Plástico PET", type_medition="KG", quantity=0),
        ]

        register_1 = RegisterResidue.objects.create(
            residue=residues[0],
            quantity=120,
            user=warehouse_user,
            observation="Recepción de aceite usado para disposición.",
        )
        register_2 = RegisterResidue.objects.create(
            residue=residues[2],
            quantity=350,
            user=warehouse_user,
            observation="Cartón compactado.",
        )
        register_3 = RegisterResidue.objects.create(
            residue=residues[3],
            quantity=200,
            user=admin_user,
            observation="PET limpio.",
        )

        today = timezone.localdate()
        order_1 = Order.objects.create(
            date=today,
            client=clients[0],
            driver=drivers[0],
            movement=Order.MOVEMENT_IN,
            performed_by=admin_user,
            is_reposition=False,
            observation="Ruta AM",
        )
        order_1.registers.add(register_1, register_2)

        order_2 = Order.objects.create(
            date=today,
            client=clients[1],
            driver=drivers[1],
            movement=Order.MOVEMENT_IN,
            performed_by=warehouse_user,
            is_reposition=True,
            observation="Ruta PM",
        )
        order_2.registers.add(register_3)

        residues[0].quantity = 120
        residues[2].quantity = 350
        residues[3].quantity = 200
        for r in (residues[0], residues[2], residues[3]):
            r.save(update_fields=["quantity"])

        self.stdout.write(self.style.SUCCESS("Seed demo completado."))
        self.stdout.write(f"admin: {admin_user.email} / Admin1234!  token: {admin_token}")
        self.stdout.write(
            f"bodega: {warehouse_user.email} / Bodega1234!  token: {warehouse_token}"
        )

    def _upsert_user(
        self,
        *,
        email,
        username,
        first_name,
        last_name,
        dni,
        phone_number,
        type_user,
        password,
        is_staff,
        is_superuser,
    ):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
                "dni": dni,
                "phone_number": phone_number,
                "type_user": type_user,
                "is_verified": True,
                "is_active": True,
                "is_staff": is_staff,
                "is_superuser": is_superuser,
            },
        )
        if created:
            user.set_password(password)
            user.save()
        return user

    def _upsert_client(
        self,
        *,
        name,
        dni,
        phone_number,
        email,
        address,
        commune,
        contact_name,
        executive,
    ):
        client, _ = Client.objects.get_or_create(
            name=name,
            defaults={
                "dni": dni,
                "phone_number": phone_number,
                "email": email,
                "address": address,
                "commune": commune,
                "contact_name": contact_name,
                "executive": executive,
            },
        )
        return client

    def _upsert_driver(self, *, name, vehicle_plate, dni, phone_number):
        driver, _ = Driver.objects.get_or_create(
            name=name,
            defaults={
                "vehicle_plate": vehicle_plate,
                "dni": dni,
                "phone_number": phone_number,
            },
        )
        return driver

    def _upsert_residue(self, *, name, type_medition, quantity):
        residue, _ = Residue.objects.get_or_create(
            name=name,
            defaults={"type_medition": type_medition, "quantity": quantity},
        )
        return residue
