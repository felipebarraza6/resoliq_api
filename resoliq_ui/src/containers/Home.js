import React, { useState, useContext, useEffect } from "react";
import { Menu, Layout, Button, Row, Col, Affix, Typography, Space, Avatar, Dropdown, Drawer } from "antd";
import logo from "../assets/img/logo.jpg";
import { 
  LogoutOutlined, 
  UserOutlined, 
  AppstoreOutlined, 
  TeamOutlined, 
  CarOutlined, 
  FileTextOutlined,
  DeleteOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Users from "./Users";
import Waste from "./Waste";
import Clients from "./Clients";
import DriversTrucks from "./DriversTrucks";
import Orders from "./Orders";
import Dashboard from "./Dashboard";
import { AppContext } from "../App";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const { dispatch, state } = useContext(AppContext);
  const [option, setOption] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: 0, icon: <AppstoreOutlined />, label: 'Resumen' },
    { key: 1, icon: <UserOutlined />, label: 'Usuarios' },
    { key: 2, icon: <DeleteOutlined />, label: 'Residuos' },
    { key: 3, icon: <TeamOutlined />, label: 'Clientes' },
    { key: 4, icon: <CarOutlined />, label: 'Conductores' },
    { key: 5, icon: <FileTextOutlined />, label: 'Órdenes' },
  ];

  const optionToPath = {
    0: '/dashboard',
    1: '/users',
    2: '/residues',
    3: '/clients',
    4: '/drivers',
    5: '/orders'
  };

  const pathToOption = (pathname) => {
    if (pathname.startsWith('/users')) return 1;
    if (pathname.startsWith('/residues') || pathname.startsWith('/waste')) return 2;
    if (pathname.startsWith('/clients')) return 3;
    if (pathname.startsWith('/drivers')) return 4;
    if (pathname.startsWith('/orders')) return 5;
    return 0;
  };

  useEffect(() => {
    setOption(pathToOption(location.pathname));
  }, [location.pathname]);

  const userMenu = (
    <Menu>
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined />} 
        onClick={() => dispatch({ type: "LOGOUT" })}
        danger
      >
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  const sidebarContent = (
    <>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '10px' }}>
          <img src={logo} width={"100%"} alt="logo" style={{ display: 'block' }} />
        </div>
      </div>
      <Menu 
        theme="dark"
        mode="inline" 
        selectedKeys={[option.toString()]} 
        onClick={({ key }) => {
          setOption(parseInt(key));
          navigate(optionToPath[parseInt(key)]);
          setMobileMenuOpen(false);
        }}
        items={menuItems}
        style={{ borderRight: 0, background: '#030852' }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
        theme="dark" 
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{ 
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 10,
          background: '#030852'
        }}
        className="hide-on-mobile"
      >
        {sidebarContent}
      </Sider>

      <Drawer
        title="Menú"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        bodyStyle={{ padding: 0, background: '#030852' }}
        headerStyle={{ background: '#030852', color: 'white', borderBottom: '1px solid #13217d' }}
        closeIcon={<span style={{ color: 'white' }}>X</span>}
      >
        {sidebarContent}
      </Drawer>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 16px', 
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 9
        }}>
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            onClick={() => setMobileMenuOpen(true)} 
            className="show-on-mobile"
            style={{ fontSize: '18px' }}
          />
          <div style={{ flex: 1 }}></div>
          <Dropdown overlay={userMenu} placement="bottomRight" arrow>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <Text strong className="hide-on-mobile-small">{state.user?.email}</Text>
              <Text type="secondary" className="hide-on-mobile-small">({state.user?.dni})</Text>
            </Space>
          </Dropdown>
        </Header>
        
        <Content style={{ 
          margin: '16px', 
          padding: '16px', 
          background: '#fff', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'auto'
        }}>
          {option === 0 && <Dashboard />}
          {option === 1 && <Users />}
          {option === 2 && <Waste />}
          {option === 3 && <Clients />}
          {option === 4 && <DriversTrucks />}
          {option === 5 && <Orders />}
        </Content>
      </Layout>
    </Layout>
  );
};

const styles = {
  container: {
    padding: "10px",
  },
};

export default Home;
