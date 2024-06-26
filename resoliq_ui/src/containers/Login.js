import React, { useContext } from "react";
import { Row, Col, Input, Button, Form, Typography, Modal } from "antd";
import logo from "../assets/img/logo.jpg";
import logoserco from "../assets/img/sercologo.jpeg";
import { UserOutlined, SecurityScanFilled } from "@ant-design/icons";
import { AppContext } from "../App";
import api from "../api/endpoints";
const { Title } = Typography;
const Login = () => {
  const [form] = Form.useForm();
  const { dispatch } = useContext(AppContext);

  async function postLogin(data) {
    const response = await api.authenticated
      .login(data)
      .then((x) => {
        console.log(x.data);
        dispatch({
          type: "LOGIN",
          payload: {
            token: x.data.access_token,
            user: x.data.user,
          },
        });
      })
      .catch((e) => {
        Modal.error({ content: "Credenciales invalidas!" });
      });
  }

  return (
    <Row justify={"center"} style={styles.container} align={"middle"}>
      <Col span={24}>
        <img src={logo} alt="logo" width={"30%"} />
      </Col>
      <Col style={styles.colLogin}>
        <Form form={form} onFinish={postLogin}>
          <Title style={styles.title}>Iniciar Sesión</Title>
          <Form.Item
            name={`email`}
            rules={[
              { type: "email", required: true, message: "Ingresa tu email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario" />
          </Form.Item>
          <Form.Item
            name={`password`}
            rules={[{ required: true, message: "Ingresa tu contraseña!" }]}
          >
            <Input
              type="password"
              prefix={<SecurityScanFilled />}
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ingresar
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: `10px` }}
              onClick={() => form.resetFields()}
            >
              Limpiar
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col>
        <img src={logoserco} width={"20%"} />
      </Col>
    </Row>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#030852",
  },
  colLogin: {},
  title: {
    color: "white",
  },
};

export default Login;
