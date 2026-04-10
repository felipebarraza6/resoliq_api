import React, { useContext, useEffect } from "react";
import { Table, Button, Row, Col, Popconfirm, notification, Tag, Space, Typography, Avatar } from "antd";
import api from "../../api/endpoints";
import { UsersContext } from "../../containers/Users";
import { DeleteOutlined, EditOutlined, UserOutlined, IdcardOutlined } from "@ant-design/icons";

const { Text } = Typography;

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
    dispatch({ type: "set_drawer_visible", payload: true });
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
      width: 280,
      ellipsis: true,
      title: "Usuario",
      render: (x) => (
        <Space align="center">
          <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold', color: '#030852' }}>{x.first_name} {x.last_name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{x.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      width: 160,
      responsive: ['sm'],
      title: "DNI / RUT",
      dataIndex: "dni",
      render: (dni) => (
        <Space>
          <IdcardOutlined style={{ color: '#8c8c8c' }} />
          <Text>{dni}</Text>
        </Space>
      )
    },
    {
      width: 160,
      title: "Rol",
      dataIndex: "type_user",
      render: (type) => (
        <Tag color={type === "ADM" ? "gold" : "cyan"} style={{ borderRadius: '12px', padding: '0 10px' }}>
          {type === "ADM" ? "Administrador" : "Bodega"}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      align: "center",
      width: 220,
      render: (x) => (
        <Space wrap>
          <Button
            type="primary"
            shape="round"
            onClick={() => selectUser(x)}
            icon={<EditOutlined />}
            size="middle"
          >
            Editar
          </Button>
          <Popconfirm
            title={"¿Estás seguro de eliminar el usuario?"}
            onConfirm={() => deleteUser(x)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
          >
            <Button
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
              size="middle"
            />
          </Popconfirm>
        </Space>
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
      scroll={{ x: 720 }}
      tableLayout="fixed"
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
