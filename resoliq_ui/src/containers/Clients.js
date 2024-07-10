import React, { createContext, useReducer } from "react";
import { Col, Row, Tag } from "antd";
import { clientsReducer } from "../reducers/clientsReducer";
import List from "../components/clients/List";
import CreateUpdate from "../components/clients/CreateUpdate";

export const ClientsContext = createContext();

const Clients = () => {
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
  };

  const [state, dispatch] = useReducer(clientsReducer, initialState);

  return (
    <ClientsContext.Provider value={{ state, dispatch }}>
      <Row style={{ marginBottom: "10px" }}>
        <Col span={24} style={{ textAlign: "left" }}>
          <Tag>
            <b>/ CLIENTES</b>
          </Tag>
        </Col>
      </Row>
      <Row align={`top`} justify={`space-around`}>
        <Col span={15}>
          <List />
        </Col>
        <Col span={8}>
          <CreateUpdate />
        </Col>
      </Row>
    </ClientsContext.Provider>
  );
};

export default Clients;
