import React, { useState, useEffect, createContext, useReducer } from "react";
import { Col, Form, Row, Card, Button, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import List from "../components/users/List";
import CreateUpdate from "../components/users/CreateUpdate";
import { usersReducer } from "../reducers/usersReducer";

export const UsersContext = createContext();

const Users = () => {
  const initialState = {
    list: {
      results: [],
      count: 0,
      page: 1,
      countUpdate: 0,
    },
    select_to_edit: null,
    is_drawer_visible: false,
  };

  const [state, dispatch] = useReducer(usersReducer, initialState);

  const [selected, setSelected] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selected) {
      form.setFieldValue("name", selected.first_name);
      form.setFieldValue("lastname", selected.last_name);
      form.setFieldValue("type", selected.type_user);
    }
  }, [selected]);

  return (
    <UsersContext.Provider value={{ state, dispatch }}>
      <Row style={{ marginBottom: "20px" }} justify="space-between" align="middle">
        <Col>
          <h2 style={{ margin: 0, color: '#030852' }}>Gestión de Usuarios</h2>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              dispatch({ type: "select_to_edit", payload: { user: null } });
              dispatch({ type: "set_drawer_visible", payload: true });
            }}
            size="large"
            style={{ borderRadius: '6px' }}
          >
            Nuevo Usuario
          </Button>
        </Col>
      </Row>
      <Row align={"top"} justify={"space-around"} gutter={[16, 16]}>
        <Col span={24}>
          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <List />
          </Card>
        </Col>
      </Row>

      <Drawer
        title={state.select_to_edit ? "Editar Usuario" : "Crear Usuario"}
        width={400}
        onClose={() => dispatch({ type: "set_drawer_visible", payload: false })}
        open={state.is_drawer_visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateUpdate />
      </Drawer>
    </UsersContext.Provider>
  );
};

export default Users;
