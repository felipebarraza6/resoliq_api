import React, { useState, useEffect, createContext, useReducer } from "react";
import { Col, Form, Row, Tag } from "antd";

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
      <Row style={{ marginBottom: "10px" }}>
        <Col span={24} style={{ textAlign: "left" }}>
          <Tag>
            <b>/ USUARIOS</b>
          </Tag>
        </Col>
      </Row>
      <Row align={"middle"} justify={"space-around"}>
        <Col span={15}>
          <List />
        </Col>
        <Col span={8}>
          <CreateUpdate />
        </Col>
      </Row>
    </UsersContext.Provider>
  );
};

export default Users;
