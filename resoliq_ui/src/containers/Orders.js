import React, { createContext, useReducer } from "react";
import { Col, Row, Card, Button, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ordersReducer } from "../reducers/ordersReducer";
import List from "../components/orders/List";
import CreateUpdate from "../components/orders/CreateUpdate";

export const OrdersContext = createContext();

const Orders = () => {
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

  const [state, dispatch] = useReducer(ordersReducer, initialState);

  return (
    <OrdersContext.Provider value={{ state, dispatch }}>
      <Row style={{ marginBottom: "20px" }} justify="space-between" align="middle">
        <Col>
          <h2 style={{ margin: 0, color: '#030852' }}>Gestión de Órdenes</h2>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              dispatch({ type: "select_to_edit", payload: { order: null } });
              dispatch({ type: "set_drawer_visible", payload: true });
            }}
            size="large"
            style={{ borderRadius: '6px' }}
          >
            Nueva Orden
          </Button>
        </Col>
      </Row>
      <Row align={`top`} justify={`space-around`} gutter={[16, 16]}>
        <Col span={24}>
          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <List />
          </Card>
        </Col>
      </Row>

      <Drawer
        title={state.select_to_edit ? "Editar Orden" : "Crear Orden"}
        width={500}
        onClose={() => dispatch({ type: "set_drawer_visible", payload: false })}
        open={state.is_drawer_visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateUpdate />
      </Drawer>
    </OrdersContext.Provider>
  );
};

export default Orders;
