import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Avatar } from "antd";
import api from "../api/endpoints";
import {
  UserOutlined,
  TeamOutlined,
  CarOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    clients: 0,
    drivers: 0,
    residues: 0,
    orders: 0,
    ordersThisMonth: 0,
    ordersLastMonth: 0,
    reposThisMonth: 0,
    lastOrders: [],
  });

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const [
        usersRes,
        clientsRes,
        driversRes,
        residuesRes,
        ordersRes,
      ] = await Promise.all([
        api.users.list(1),
        api.clients.list(1),
        api.drivers.list(),
        api.residues.list(1),
        api.orders.list(1),
      ]);

      const usersCount = usersRes?.count ?? (Array.isArray(usersRes) ? usersRes.length : 0);
      const clientsCount = clientsRes?.count ?? (Array.isArray(clientsRes) ? clientsRes.length : 0);
      const driversCount = driversRes?.count ?? (Array.isArray(driversRes) ? driversRes.length : 0);
      const residuesCount = residuesRes?.count ?? (Array.isArray(residuesRes) ? residuesRes.length : 0);
      const ordersCount = ordersRes?.count ?? (Array.isArray(ordersRes) ? ordersRes.length : 0);

      const lastOrders = ordersRes?.results ?? ordersRes ?? [];
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const prev = new Date(year, month - 2, 1);
      const prevMonth = prev.getMonth() + 1;
      const prevYear = prev.getFullYear();

      const ordersThisMonthList = lastOrders.filter((o) => {
        const d = new Date(o.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });
      const ordersThisMonth = ordersThisMonthList.length;
      const ordersLastMonth = lastOrders.filter((o) => {
        const d = new Date(o.date);
        return d.getFullYear() === prevYear && d.getMonth() + 1 === prevMonth;
      }).length;
      const reposThisMonth = ordersThisMonthList.filter((o) => o.is_reposition).length;

      setStats({
        users: usersCount,
        clients: clientsCount,
        drivers: driversCount,
        residues: residuesCount,
        orders: ordersCount,
        ordersThisMonth,
        ordersLastMonth,
        reposThisMonth,
        lastOrders: lastOrders.slice(0, 5),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const IndicatorCard = ({ title, value, icon, bg }) => (
    <Card
      loading={loading}
      style={{
        background: bg,
        color: "#fff",
        border: "none",
        borderRadius: 12,
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Row align="middle" justify="space-between">
        <Col>
          <div style={{ fontSize: 13, opacity: 0.9 }}>{title}</div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{value}</div>
        </Col>
        <Col>
          <Avatar
            icon={icon}
            size={40}
            style={{ background: "rgba(255,255,255,0.2)" }}
          />
        </Col>
      </Row>
    </Card>
  );

  return (
    <>
      <Row style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0, color: '#030852' }}>Resumen</h2>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={12} lg={6}>
          <IndicatorCard title="Usuarios" value={stats.users} icon={<UserOutlined />} bg="linear-gradient(135deg, #030852 0%, #13217d 100%)" />
        </Col>
        <Col xs={12} lg={6}>
          <IndicatorCard title="Clientes" value={stats.clients} icon={<TeamOutlined />} bg="linear-gradient(135deg, #13c2c2 0%, #08979c 100%)" />
        </Col>
        <Col xs={12} lg={6}>
          <IndicatorCard title="Conductores" value={stats.drivers} icon={<CarOutlined />} bg="linear-gradient(135deg, #9254de 0%, #531dab 100%)" />
        </Col>
        <Col xs={12} lg={6}>
          <IndicatorCard title="Residuos" value={stats.residues} icon={<DeleteOutlined />} bg="linear-gradient(135deg, #36cfc9 0%, #13c2c2 100%)" />
        </Col>
        <Col xs={12} lg={6}>
          <IndicatorCard title="Órdenes totales" value={stats.orders} icon={<FileTextOutlined />} bg="linear-gradient(135deg, #1890ff 0%, #0050b3 100%)" />
        </Col>
        <Col xs={12} lg={6}>
          <IndicatorCard title="Órdenes (este mes)" value={stats.ordersThisMonth} icon={<CalendarOutlined />} bg="linear-gradient(135deg, #52c41a 0%, #237804 100%)" />
        </Col>
        <Col xs={12} lg={6}>
          <IndicatorCard title="Órdenes (mes anterior)" value={stats.ordersLastMonth} icon={<FieldTimeOutlined />} bg="linear-gradient(135deg, #faad14 0%, #d48806 100%)" />
        </Col>
        <Col xs={12} lg={6}>
          <IndicatorCard title="Reposiciones (mes)" value={stats.reposThisMonth} icon={<ThunderboltOutlined />} bg="linear-gradient(135deg, #ff4d4f 0%, #a8071a 100%)" />
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Últimas Órdenes" loading={loading}>
            {/*
              Tabla responsiva: agrega scroll horizontal y oculta columnas menos críticas en pantallas pequeñas
            */}
            {(() => {
              const columns = [
                { title: "ID", dataIndex: "id", width: 90, render: (id) => <Tag color="blue">{id}</Tag> },
                { title: "Fecha", dataIndex: "date", width: 130 },
                { title: "Cliente", dataIndex: ["client", "name"], ellipsis: true },
                { title: "Conductor", dataIndex: ["driver", "name"], ellipsis: true, responsive: ['md'] },
                { title: "Tipo", dataIndex: "is_reposition", width: 140, render: (v) => <Tag color={v ? "geekblue" : "green"}>{v ? "Reposición" : "Normal"}</Tag>, responsive: ['sm'] },
              ];
              return (
            <Table
              rowKey={(x) => x.id}
              size="small"
              pagination={false}
                tableLayout="fixed"
                scroll={{ x: 700 }}
                dataSource={stats.lastOrders}
                columns={columns}
            />
              );
            })()}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
