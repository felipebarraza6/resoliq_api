import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Modal,
  notification,
  Tag,
  Select,
} from "antd";
import { ClientsContext } from "../../containers/Clients";
import {
  PlusCircleFilled,
  ClearOutlined,
  RetweetOutlined,
  MinusCircleFilled,
} from "@ant-design/icons";
import api from "../../api/endpoints";
import regions from "./regions.json";

const CreateUpdate = () => {
  const { state, dispatch } = useContext(ClientsContext);
  const [communes, setCommunes] = useState([]);
  const [form] = Form.useForm();

  function createOrClear() {
    if (state.select_to_edit) {
      dispatch({
        type: "select_to_edit",
        payload: { client: null },
      });
      form.resetFields();
    } else {
      form.resetFields();
    }
  }

  async function createClient(values) {
    await api.clients
      .create(values)
      .then(() => {
        dispatch({
          type: "update_list",
        });
        form.resetFields();
      })
      .catch((e) => {
        const errors = e.response.data;
        const errorList = Object.keys(errors).map((key) => errors[key]);
        Modal.error({
          title:
            "Errores al crear el nuevo cliente, revisa tus datos ingresados.",
          content: (
            <ul>
              {errorList.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ),
        });
      });
  }

  async function updateClient(values) {
    await api.clients
      .update(state.select_to_edit.id, values)
      .then(() => {
        dispatch({
          type: "update_list",
        });
        dispatch({ type: "select_to_edit", payload: { client: null } });
        form.resetFields();
        notification.success({ message: "Cliente actualizado correctamente." });
      })
      .catch((e) => {
        const errors = e.response.data;
        const errorList = Object.keys(errors).map((key) => errors[key]);
        Modal.error({
          title: "Errores al actualizar el cliente.",
          content: (
            <ul>
              {errorList.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ),
        });
      });
  }

  function createOrUpdateClient(values) {
    if (state.select_to_edit) {
      updateClient(values);
    } else {
      createClient(values);
    }
  }

  useEffect(() => {
    if (state.select_to_edit) {
      form.setFieldsValue(state.select_to_edit);
    }
  }, [state.select_to_edit]);

  return (
    <Card
      hoverable
      title={
        state.select_to_edit ? <>Actualizar cliente</> : "Crear nuevo cliente"
      }
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 7 }}
        labelWrap={true}
        onFinish={createOrUpdateClient}
      >
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "Ingresa el nombre" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Rut" name="dni">
          <Input />
        </Form.Item>

        <Form.Item label="Telefono" name="phone_number">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label={"Región"} name={"region"}>
          <Select
            placeholder={"Selecciona una región"}
            onSelect={(key) => {
              const region = regions.find((region) => region.name === key);
              setCommunes(region.communes);
            }}
          >
            {regions.map((region) => (
              <Select.Option key={region.name} value={region.name}>
                {region.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Comuna" name="commune">
          <Select placeholder={"Seleciona una comuna"}>
            {communes.map((commune) => (
              <Select.Option key={commune}>{commune}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Direccion" name="address">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Nombre contacto" name="contact_name">
          <Input />
        </Form.Item>
        <Form.Item label="Ejecutivo" name="executive">
          <Input />
        </Form.Item>

        <Form.Item style={{ float: "right" }}>
          <Button
            htmlType="submit"
            type="primary"
            style={{
              marginRight: "10px",
            }}
            icon={
              state.select_to_edit ? <RetweetOutlined /> : <PlusCircleFilled />
            }
          >
            {state.select_to_edit ? `Actualizar` : "Crear"}
          </Button>
          <Button
            onClick={createOrClear}
            icon={
              state.select_to_edit ? <PlusCircleFilled /> : <ClearOutlined />
            }
          >
            {state.select_to_edit ? "Crear nuevo" : "Limpiar"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateUpdate;
