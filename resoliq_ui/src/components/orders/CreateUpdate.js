import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Modal,
  notification,
  Tag,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Select,
} from "antd";
import { OrdersContext } from "../../containers/Orders";
import {
  PlusCircleFilled,
  ClearOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import api, { list_orders } from "../../api/endpoints";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

const CreateUpdate = () => {
  dayjs.locale("es");
  dayjs.extend(weekday);
  dayjs.extend(localeData);

  const { state, dispatch } = useContext(OrdersContext);
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [residues, setResidues] = useState([]);
  const [users, setUsers] = useState([]);
  const [detailResiduals, setDetailResiduals] = useState([]);
  const [listPreSelect, setListPreSelect] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  function createOrClear() {
    if (state.select_to_edit) {
      dispatch({
        type: "select_to_edit",
        payload: { driver: null },
      });
      setListPreSelect({});
      setDetailResiduals([]);
      form.resetFields();
    } else {
      form.resetFields();
    }
  }

  async function createOrder(values) {
    setIsLoading(true);
    try {
      const clonedDetailResiduals = detailResiduals.reduce((acc, cur) => {
        const existingResidual = acc.find(
          (residual) => residual.residue === cur.residue.id
        );
        if (existingResidual) {
          existingResidual.quantity += cur.quantity;
        } else {
          acc.push({
            residue: cur.residue.id,
            quantity: cur.quantity,
          });
        }
        return acc;
      }, []);

      const movement = values.movement || "IN";
      if (movement === "OUT") {
        const insufficient = clonedDetailResiduals
          .map((d) => {
            const residue = residues.find((r) => r.id === d.residue);
            const stock = residue ? Number(residue.quantity) : 0;
            return stock < Number(d.quantity) ? residue?.name || "(sin nombre)" : null;
          })
          .filter(Boolean);
        if (insufficient.length) {
          Modal.error({
            title: "Stock insuficiente",
            content: `No hay stock suficiente para: ${insufficient.join(", ")}`,
          });
          return;
        }
      }

      values = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        items: clonedDetailResiduals,
      };
      
      await api.orders.create(values);
      
      dispatch({
        type: "update_list",
      });
      form.resetFields();
      
      setListPreSelect({});
      setDetailResiduals([]);
      notification.success({ message: "Orden creada exitosamente" });
    } catch (e) {
      console.log(e);
      const errors = e.response?.data || { general: "Error desconocido" };
      const errorList = Object.keys(errors).map((key) => errors[key]);
      Modal.error({
        title: "Errores al crear la nueva orden, revisa tus datos ingresados.",
        content: (
          <ul>
            {errorList.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOrder(values) {
    setIsLoading(true);
    try {
      values = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };
      
      await api.orders.update(state.select_to_edit.id, values);
      
      dispatch({
        type: "update_list",
      });
      dispatch({ type: "select_to_edit", payload: { order: null } });
      form.resetFields();
      setListPreSelect({});
      setDetailResiduals([]);
      notification.success({
        message: "Orden actualizado correctamente.",
      });
    } catch (e) {
      const errors = e.response?.data || { general: "Error desconocido" };
      const errorList = Object.keys(errors).map((key) => errors[key]);
      Modal.error({
        title: "Errores al actualizar la Orden.",
        content: (
          <ul>
            {errorList.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  function createOrUpdateOrder(values) {
    if (state.select_to_edit) {
      updateOrder(values);
    } else {
      createOrder(values);
    }
  }

  const getClient = async () => {
    let currentPage = 1;
    let allData = [];
    let response = await api.clients.list(currentPage);
    allData = [...response.results];
    while (response.next) {
      currentPage++;
      response = await api.clients.list(currentPage);
      allData = [...allData, ...response.results];
    }
    setClients(allData);
  };

  const getDrivers = async () => {
    let currentPage = 1;
    let allData = [];
    let response = await api.drivers.list(currentPage);
    allData = [...response.results];
    while (response.next) {
      currentPage++;
      response = await api.drivers.list(currentPage);
      allData = [...allData, ...response.results];
    }
    setDrivers(allData);
  };

  const getResidues = async () => {
    let currentPage = 1;
    let allData = [];
    let response = await api.residues.list(currentPage);
    allData = [...response.results];
    while (response.next) {
      currentPage++;
      response = await api.residues.list(currentPage);
      allData = [...allData, ...response.results];
    }
    setResidues(allData);
  };

  const getUsers = async () => {
    let currentPage = 1;
    let allData = [];
    let response = await api.users.list(currentPage);
    allData = [...response.results];
    while (response.next) {
      currentPage++;
      response = await api.users.list(currentPage);
      allData = [...allData, ...response.results];
    }
    setUsers(allData);
  };

  useEffect(() => {
    getClient();
    getDrivers();
    getResidues();
    getUsers();
    if (state.select_to_edit) {
      form.setFieldsValue(state.select_to_edit);
      form.setFieldValue("date", dayjs(state.select_to_edit.date));
      form.setFieldValue("client", state.select_to_edit.client?.id);
      form.setFieldValue("driver", state.select_to_edit.driver?.id);
      form.setFieldValue("is_reposition", state.select_to_edit.is_reposition);
      form.setFieldValue("movement", state.select_to_edit.movement || "IN");
      form.setFieldValue("performed_by", state.select_to_edit.performed_by?.id || state.select_to_edit.performed_by);
      setDetailResiduals(state.select_to_edit.registers);
    } else {
      form.setFieldValue("is_reposition", false);
      form.setFieldValue("movement", "IN");
    }
  }, [state.select_to_edit]);

  return (
    <div style={{ padding: '10px' }}>
      {state.select_to_edit && (
        <div style={{ marginBottom: '20px' }}>
          <Tag color="blue-inverse">Editando: {state.select_to_edit.id}</Tag>
        </div>
      )}
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        labelWrap={true}
        onFinish={createOrUpdateOrder}
      >
        <Form.Item
          label="Fecha"
          name="date"
          rules={[{ required: true, message: "Ingresa la fecha" }]}
        >
          <DatePicker
            placeholder="Selecciona una fecha"
            style={{ width: `100%` }}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const movement = form.getFieldValue("movement") || "IN";
            const isReposition = form.getFieldValue("is_reposition") === true;
            const requireClientDriver = movement === "IN" && !isReposition;
            return (
              <>
                <Form.Item
                  label="Cliente"
                  name="client"
                  rules={[{ required: requireClientDriver, message: "Selecciona un cliente" }]}
                >
                  <Select
                    placeholder={`Selecciona un cliente`}
                    style={{ width: `100%` }}
                    allowClear
                    disabled={!requireClientDriver}
                  >
                    {clients.map((client) => (
                      <Select.Option key={client.id} value={client.id}>
                        {client.name}({client.dni})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Conductor"
                  name="driver"
                  rules={[{ required: requireClientDriver, message: "Selecciona un conductor" }]}
                >
                  <Select
                    placeholder={`Selecciona un conductor`}
                    style={{ width: `100%` }}
                    allowClear
                    disabled={!requireClientDriver}
                  >
                    {drivers.map((driver) => (
                      <Select.Option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.vehicle_plate}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            );
          }}
        </Form.Item>

        <Form.Item
          label="Movimiento"
          name="movement"
          rules={[{ required: true, message: "Selecciona un movimiento" }]}
        >
          <Select
            placeholder={`Selecciona un movimiento`}
            style={{ width: `100%` }}
            onChange={(v) => {
              if (v === "OUT") {
                form.setFieldValue("is_reposition", false);
                form.setFieldValue("client", null);
                form.setFieldValue("driver", null);
              }
            }}
          >
            <Select.Option key={`IN`} value={"IN"}>
              Agregar (Ingreso)
            </Select.Option>
            <Select.Option key={`OUT`} value={"OUT"}>
              Retirar
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {() => {
            const movement = form.getFieldValue("movement") || "IN";
            const isReposition = form.getFieldValue("is_reposition") === true;
            const needsUser = movement === "OUT" || isReposition;
            if (!needsUser) return null;
            return (
              <Form.Item
                label="Usuario"
                name="performed_by"
                rules={[{ required: true, message: "Selecciona un usuario" }]}
              >
                <Select placeholder={`Selecciona un usuario`} style={{ width: `100%` }}>
                  {users.map((u) => (
                    <Select.Option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name} ({u.email})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
        <hr />

        <div>
          <Row justify={`space-around`}>
            <Select
              size="small"
              placeholder={`Selecciona un residuo`}
              style={{ width: `185px` }}
              defaultValue={
                listPreSelect.residue ? listPreSelect.residue.id : null
              }
              onChange={(e) => {
                const residue = residues.find((residue) => residue.id === e);
                setListPreSelect({
                  ...listPreSelect,
                  residue: residue,
                });
              }}
              value={
                listPreSelect.residue ? listPreSelect.residue.id : undefined
              }
            >
              {residues.map((residue) => (
                <Select.Option key={residue.id} value={residue.id}>
                  {residue.name} ({residue.quantity} {residue.type_medition})
                </Select.Option>
              ))}
            </Select>
            <Input
              type={`number`}
              placeholder="0"
              size="small"
              style={{ width: `70px`, height: `26px` }}
              defaultValue={listPreSelect.quantity ? listPreSelect.quantity : 0}
              value={listPreSelect.quantity ? listPreSelect.quantity : 0}
              onChange={(e) => {
                setListPreSelect({
                  ...listPreSelect,
                  quantity: parseInt(e.target.value),
                });
              }}
            />
            <Button
              icon={<PlusCircleOutlined />}
              type={`primary`}
              disabled={state.select_to_edit ? true : false}
              onClick={() => {
                if (
                  !listPreSelect.residue ||
                  listPreSelect.quantity === 0 ||
                  !listPreSelect.quantity
                ) {
                  notification.error({
                    message: "Error al agregar residuo",
                    description: "Selecciona un residuo y una cantidad",
                  });
                } else {
                  setDetailResiduals([...detailResiduals, listPreSelect]);
                  setListPreSelect({});
                }
              }}
              size={`small`}
              style={{
                float: `right`,
                marginTop: `5px`,
                marginBottom: `10px`,
              }}
            ></Button>
            <Col span={24}>
              <Row>
                {detailResiduals.map((residual, index) => {
                  return (
                    <>
                      <Col
                        span={13}
                        style={{ textAlign: `left`, textIndent: `10px` }}
                      >
                        {index + 1}){residual.residue.name}
                      </Col>
                      <Col span={6}>{residual.quantity}</Col>
                      {!state.select_to_edit && (
                        <Col span={5}>
                          <Button
                            type="danger"
                            size="small"
                            disabled={state.select_to_edit ? true : false}
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              const updatedResiduals = detailResiduals.filter(
                                (item, i) => i !== index
                              );
                              setDetailResiduals(updatedResiduals);
                            }}
                          />
                        </Col>
                      )}
                    </>
                  );
                })}
                <Col span={24}>
                  <hr />
                </Col>
                <Col span={13}>CANTIDAD TOTAL </Col>

                <Col span={6}>
                  <b>
                    {detailResiduals.reduce(
                      (acc, cur) => acc + parseInt(cur.quantity),
                      0
                    )}
                  </b>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <hr />
        <Form.Item
          label="Reposicion"
          name="is_reposition"
          rules={[{ required: true, message: "Selecciona una opcion" }]}
        >
          <Select
            placeholder={`Selecciona una opcion`}
            style={{ width: `100%` }}
            onChange={(v) => {
              if (v === true) {
                form.setFieldValue("movement", "IN");
                form.setFieldValue("client", null);
                form.setFieldValue("driver", null);
              }
            }}
          >
            <Select.Option key={`1`} value={true}>
              SI
            </Select.Option>
            <Select.Option key={`2`} value={false}>
              NO
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Observaciones" name="observation">
          <Input.TextArea placeholder="Describe..." />
        </Form.Item>

        <Form.Item style={{ marginTop: '20px', textAlign: 'right' }}>
          <Button
            onClick={createOrClear}
            icon={
              state.select_to_edit ? <PlusCircleFilled /> : <ClearOutlined />
            }
            style={{ marginRight: "10px" }}
          >
            {state.select_to_edit ? "Crear nuevo" : "Limpiar"}
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            icon={
              state.select_to_edit ? <RetweetOutlined /> : <PlusCircleFilled />
            }
            loading={isLoading}
          >
            {state.select_to_edit ? `Actualizar` : "Crear"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUpdate;
