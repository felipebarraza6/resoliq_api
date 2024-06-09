import React, { useContext, useEffect } from "react";
import { Table, Button, Row, Col, Popconfirm, notification } from "antd";
import api from "../../api/endpoints";
import { UsersContext } from "../../containers/Users";
import { DeleteFilled, RightCircleFilled } from "@ant-design/icons";
import { type } from "@testing-library/user-event/dist/type";

const List = () => {
  const { state, dispatch } = useContext(UsersContext);

  async function getUsers() {
    await api.users.list(state.list.page).then((x) => {
      dispatch({
        type: "add_users",
        payload: x,
      });
    });
  }

  const selectUser = (user) => {
    dispatch({
      type: "select_to_edit",
      payload: { user },
    });
  };

  const deleteUser = async (user) => {
    const response = await api.users.delete(user.username).then(() => {
      dispatch({
        type: "update_list",
      });
      dispatch({
        type: "change_page",
        page: 1,
      });
      notification.success({ message: "Usuario eliminado" });
    });
  };

  const columns = [
    {
      title: "Nombre",
      render: (x) => (
        <Row>
          <Col span={24}>{x.first_name}</Col>
          <Col span={24}> {x.last_name}</Col>
        </Row>
      ),
    },
    {
      title: "Datos",
      render: (x) => {
        return (
          <Row>
            <Col span={24}>{x.email}</Col>
            <Col span={24}> {x.dni}</Col>
          </Row>
        );
      },
    },

    {
      title: "Tipo usuario",
      dataIndex: "type_user",
      render: (type) => (type === "ADM" ? "Administrador" : "Bodega"),
    },
    {
      width: "28%",
      render: (x) => (
        <Row justify={"space-between"}>
          <Col span={12}>
            <Popconfirm
              title={"Estas seguro de eliminar el usuario?"}
              onConfirm={() => deleteUser(x)}
            >
              <Button
                style={{ marginRight: "10px" }}
                type="primary"
                danger
                icon={<DeleteFilled />}
                size="small"
              >
                Eliminar
              </Button>{" "}
            </Popconfirm>
          </Col>
          <Col span={12}>
            <Button
              size="small"
              type="primary"
              onClick={() => selectUser(x)}
              icon={<RightCircleFilled />}
            >
              Editar
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, [state.list.countUpdate, state.list.page]);

  return (
    <Table
      dataSource={state.list.results}
      size="small"
      title={() => <b>Usuarios registrados: {state.list.count}</b>}
      bordered
      rowKey={(x) => x.id}
      pagination={{
        total: state.list.count,
        onChange: (page) => dispatch({ type: "change_page", page: page }),
      }}
      columns={columns}
    />
  );
};

const styles = {};

export default List;
