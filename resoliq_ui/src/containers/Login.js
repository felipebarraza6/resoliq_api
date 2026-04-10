import React, { useContext, useState } from "react";
import { Row, Col, Input, Button, Form, Typography, Modal, Checkbox, Divider, message } from "antd";
import logo from "../assets/img/logo.jpg";
import { UserOutlined, SecurityScanFilled } from "@ant-design/icons";
import { AppContext } from "../App";
import api from "../api/endpoints";
const { Title } = Typography;
const Login = () => {
  const [form] = Form.useForm();
  const { dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  async function postLogin(data) {
    const payload = {
      email: (data.email || "").trim(),
      password: data.password,
    };
    try {
      setLoading(true);
      const x = await api.authenticated.login(payload);
      dispatch({
        type: "LOGIN",
        payload: {
          token: x.data.access_token,
          user: x.data.user,
        },
      });
      if (!remember) {
        sessionStorage.setItem("token", x.data.access_token);
        sessionStorage.setItem("user", JSON.stringify(x.data.user));
      }
    } catch (e) {
      const detail = e?.response?.data?.detail || "Credenciales inválidas";
      message.error(detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <Row justify={"center"} align={"middle"} style={{ minHeight: '100vh', padding: '24px 16px' }}>
        <Col span={24} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <img src={logo} alt="logo" style={{ maxWidth: '220px' }} />
          </div>
        </Col>
        
        <Col xs={24} sm={18} md={12} lg={8} xl={6}>
          <div style={{ background: 'white', padding: '28px 24px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <Title level={2} style={{ textAlign: 'center', color: '#030852', marginBottom: '20px' }}>
              Iniciar Sesión
            </Title>
            
            <Form form={form} onFinish={postLogin} layout="vertical" size="large">
              <Form.Item
                name={`email`}
                rules={[
                  { type: "email", required: true, message: "Ingresa tu email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Correo Electrónico"
                  onPressEnter={() => form.submit()}
                  allowClear
                  inputMode="email"
                />
              </Form.Item>
              <Form.Item
                name={`password`}
                rules={[{ required: true, message: "Ingresa tu contraseña!" }]}
              >
                <Input.Password
                  prefix={<SecurityScanFilled style={{ color: '#1890ff' }} />}
                  placeholder="Contraseña"
                  onPressEnter={() => form.submit()}
                />
              </Form.Item>
              <Row justify="start" style={{ marginBottom: 12 }}>
                <Col>
                  <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)}>
                    Recordarme
                  </Checkbox>
                </Col>
              </Row>
              <Form.Item style={{ marginTop: 12, marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" block style={{ height: '45px', fontSize: '16px' }} loading={loading} disabled={loading}>
                  Ingresar
                </Button>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                  <Button type="link" onClick={() => form.resetFields()}>
                    Limpiar formulario
                  </Button>
                </div>
              </Form.Item>
            </Form>
            <Divider />
            <div style={{ textAlign: 'center', fontSize: 12, color: '#8c8c8c' }}>
              Resoliq | Gestión Ambiental • Creador:{" "}
              <a href="https://github.com/felipebarraza6" target="_blank" rel="noreferrer">
                felipebarraza6
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#030852",
    background: "linear-gradient(135deg, #030852 0%, #1a2a8f 100%)",
  },
};

export default Login;
