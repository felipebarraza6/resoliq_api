import React, { useEffect, createContext, useReducer } from "react";
import { Col, Form, Row, Button, Table, Card, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateUpdate from "../components/residues/CreateUpdate";
import List from "../components/residues/List";
import { wasteReducer } from "../reducers/wasteReducer";

export const WasteContext = createContext();

const Waste = () => {
  const initialState = {
    list: {
      results: [],
      count: 0,
      page: 1,
      countUpdate: 0,
    },
    select_to_edit: null,
    add_quantity: false,
    sus_quantity: false,
    is_drawer_visible: false,
  };

  const [state, dispatch] = useReducer(wasteReducer, initialState);

  return (
    <WasteContext.Provider value={{ state, dispatch }}>
      <Row style={{ marginBottom: "20px" }} justify="space-between" align="middle">
        <Col>
          <h2 style={{ margin: 0, color: '#030852' }}>Gestión de Residuos</h2>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              dispatch({ type: "select_to_edit", payload: { waste: null } });
              dispatch({ type: "add_quantity", payload: false });
              dispatch({ type: "sus_quantity", payload: false });
              dispatch({ type: "set_drawer_visible", payload: true });
            }}
            size="large"
            style={{ borderRadius: '6px' }}
          >
            Nuevo Residuo
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
        title={
          state.select_to_edit 
            ? (state.add_quantity || state.sus_quantity ? "Modificar Existencias" : "Editar Residuo") 
            : "Crear Residuo"
        }
        width={400}
        onClose={() => dispatch({ type: "set_drawer_visible", payload: false })}
        open={state.is_drawer_visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateUpdate />
      </Drawer>
    </WasteContext.Provider>
  );
};

export default Waste;
