import React, { useContext, useEffect } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Popconfirm,
  notification,
  Collapse,
  Tag,
  Modal,
  Descriptions,
  Divider,
  Typography,
} from "antd";
import api from "../../api/endpoints";
import { OrdersContext } from "../../containers/Orders";
import logo_png from "../../assets/img/logo.png";
import {
  DeleteFilled,
  EyeFilled,
  EditFilled,
  FilePdfFilled,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";

const List = () => {
  const { state, dispatch } = useContext(OrdersContext);

  async function getOrders() {
    await api.orders.list(state.list.page).then((x) => {
      dispatch({
        type: "add_orders",
        payload: x,
      });
    });
  }

  const selectOrder = (order) => {
    dispatch({
      type: "select_to_edit",
      payload: { order },
    });
    dispatch({ type: "set_drawer_visible", payload: true });
  };

  const deleteOrder = async (order) => {
    const response = await api.orders.delete(order.id).then(() => {
      dispatch({
        type: "update_list",
      });
      dispatch({
        type: "change_page",
        page: 1,
      });
      notification.success({ message: "Orden eliminada" });
    });
  };

  const renderOrderPreview = (order) => {
    const data = order.registers.map((r, i) => ({
      key: i,
      residueName: r.residue.name,
      quantity: r.quantity,
      measure: r.residue.type_medition,
    }));
    const total = order.registers.reduce((acc, r) => acc + r.quantity, 0);
    return (
      <div style={{ paddingTop: 8 }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col>
            <img src={logo_png} alt="logo" style={{ height: 48 }} />
          </Col>
          <Col>
            <div style={{ textAlign: "right", lineHeight: 1.2 }}>
              <div style={{ fontWeight: 600 }}>RESOLIQ LTDA</div>
              <div>RUT: 76.365.199-1</div>
              <div>LOS CANELOS 571 EL BOSQUE, CHILLAN</div>
            </div>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0" }} />
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Descriptions size="small" column={1} title="Cliente" bordered>
              <Descriptions.Item label="Nombre">
                {order.client.name}
              </Descriptions.Item>
              <Descriptions.Item label="RUT">
                {order.client.dni}
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono">
                {order.client.phone_number}
              </Descriptions.Item>
              <Descriptions.Item label="Dirección">
                {order.client.address}
              </Descriptions.Item>
              <Descriptions.Item label="Tipo">
                {order.is_reposition ? "Reposición" : "Normal"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} md={12}>
            <Descriptions size="small" column={1} title="Conductor" bordered>
              <Descriptions.Item label="Nombre">
                {order.driver.name}
              </Descriptions.Item>
              <Descriptions.Item label="RUT">
                {order.driver.dni}
              </Descriptions.Item>
              <Descriptions.Item label="Patente">
                {order.driver.vehicle_plate}
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono">
                {order.driver.phone_number}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0" }} />
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Col>
            <Tag color="blue">Orden #{order.id}</Tag>
          </Col>
          <Col>
            <Tag color="green">{order.date}</Tag>
          </Col>
        </Row>
        <Table
          size="small"
          bordered
          pagination={false}
          dataSource={data}
          columns={[
            { title: "Residuo", dataIndex: "residueName" },
            { title: "Cantidad", dataIndex: "quantity", align: "right", width: 120 },
            { title: "Medida", dataIndex: "measure", width: 140 },
          ]}
          footer={() => (
            <Row justify="end">
              <b style={{ marginRight: 8 }}>Total:</b> {total}
            </Row>
          )}
        />
        {order.observation ? (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <div>
              <b>Observación</b>
              <div style={{ marginTop: 6 }}>{order.observation}</div>
            </div>
          </>
        ) : null}
      </div>
    );
  };

  const columns = [
    {
      width: 320,
      title: "Ordenes",
      render: (x) => (
        <Row align={`middle`} gutter={[8, 8]}>
          <Col span={24} style={{ marginBottom: `3px` }}>
            <Tag color={`blue-inverse`}>{x.id}</Tag>
          </Col>
          <Col>
            Fecha:
            <br />
            <Tag color={`green-inverse`}>{x.date}</Tag>
          </Col>
          <Col>
            Cliente:
            <Button
              size={`small`}
              type={`primary`}
              onClick={() => {
                Modal.info({
                  style: { top: 0 },
                  content: (
                    <Row justify={`center`} style={{ padding: `30px` }}>
                      <Col span={24}>
                        Nombre: <b>{x.client.name}</b>
                      </Col>
                      <Col span={24}>
                        Rut: <b>{x.client.dni}</b>
                      </Col>
                      <Col span={24}>
                        Dirección: <b>{x.client.address}</b>
                      </Col>
                      <Col span={24}>
                        Telefono: <b>{x.client.phone}</b>
                      </Col>
                    </Row>
                  ),
                });
              }}
            >
              {x.client.name}
            </Button>
          </Col>

          {x.observation && (
            <Col>
              Observaciones:
              <br />
              <Button
                size={`small`}
                type={`primary`}
                icon={<EyeFilled />}
                onClick={() => {
                  Modal.info({ style: { top: 0 }, content: <>{x.observation}</> });
                }}
              >
                Ver observaciones
              </Button>
            </Col>
          )}
          <Col span={24}>
            {x.is_reposition && (
              <Tag color={`geekblue-inverse`} style={{ marginTop: `10px` }}>
                Reposición
              </Tag>
            )}
          </Col>
        </Row>
      ),
    },
    {
      width: 480,
      render: (x) => (
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Collapse size="small">
              <Collapse.Panel
                header={
                  <>
                    Residuos(<b>{x.registers.length}</b>)
                  </>
                }
                key="1"
              >
                <Row
                  align={`middle`}
                  style={{ marginTop: `0px` }}
                  justify={`center`}
                >
                  <Col
                    span={12}
                    style={{
                      backgroundColor: `black`,
                      color: `white`,
                      textIndent: `5px`,
                      borderRadius: `5px 0px 0px 5px`,
                    }}
                  >
                    <b>Residuo</b>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      backgroundColor: `black`,
                      color: `white`,
                      borderRadius: `0px 5px 5px 0px`,
                      textAlign: `end`,
                      paddingRight: `5px`,
                    }}
                  >
                    <b>Total </b>
                  </Col>
                  <Col span={24}>
                    {x.registers.map((register) => {
                      return (
                        <Row>
                          <Col span={12} style={{ textIndent: `10px` }}>
                            {register.residue.name}
                          </Col>
                          <Col
                            span={12}
                            style={{
                              textIndent: `0px`,
                              textAlign: `end`,
                              paddingRight: `10px`,
                            }}
                          >
                            {register.quantity}
                          </Col>
                        </Row>
                      );
                    })}
                  </Col>
                  <Col
                    span={12}
                    style={{
                      paddingLeft: `10px`,
                    }}
                  >
                    <hr />
                    TOTAL:
                  </Col>
                  <Col
                    span={12}
                    style={{
                      paddingRight: `10px`,
                      textAlign: `end`,
                    }}
                  >
                    <hr />
                    <b>
                      {x.registers.reduce(
                        (total, register) => total + register.quantity,
                        0
                      )}
                    </b>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      paddingLeft: `10px`,
                    }}
                  >
                    <hr />
                    Promedio:
                  </Col>
                  <Col
                    span={12}
                    style={{
                      paddingRight: `10px`,
                      textAlign: `end`,
                    }}
                  >
                    <hr />
                    <b>
                      {x.registers.reduce(
                        (total, register) => total + register.quantity,
                        0
                      ) / x.registers.length}
                    </b>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
          </Col>
          <Col style={{ marginBottom: `3px` }}>
            Conductor:
            <br />
            <Tag color={`purple-inverse`}>{x.driver.name}</Tag>
          </Col>
          <Col style={{ marginBottom: `3px` }}>
            Patente:
            <br />{" "}
            <Tag color={`yellow-inverse`} style={{ color: `black` }}>
              {x.driver.vehicle_plate}
            </Tag>
          </Col>
          <Col>
            <Button
              shape="square"
              type="primary"
              danger
              size="small"
              icon={<FilePdfFilled />}
              style={{ marginTop: `22px` }}
              onClick={() => generatePDF(x)}
            >
              Descargar PDF
            </Button>
          </Col>
        </Row>
      ),
    },
    {
      width: 220,
      render: (x) => (
        <Row justify={"space-between"}>
          <Col span={24} style={{ marginBottom: `5px` }}>
            <Popconfirm
              title={"Estas seguro de eliminar la orden?"}
              onConfirm={() => deleteOrder(x)}
            >
              <Button
                shape="default"
                type="primary"
                danger
                block
                size="small"
                icon={<DeleteFilled />}
              >
                Eliminar
              </Button>
            </Popconfirm>
          </Col>

          <Col span={24} style={{ marginBottom: `5px` }}>
            <Button
              shape="square"
              type="primary"
              size="small"
              block
              onClick={() => selectOrder(x)}
              icon={<EditFilled />}
            >
              Editar
            </Button>
          </Col>
          <Col span={24} style={{ marginBottom: `5px` }}>
            <Button
              shape="square"
              type="default"
              size="small"
              block
              icon={<EyeFilled />}
              onClick={() => {
                Modal.info({
                  title: `Vista previa`,
                  width: 900,
                  style: { top: 0 },
                  content: renderOrderPreview(x),
                  onOk() {},
                });
              }}
            >
              Vista Previa
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  const generatePDF = (order) => {
    const doc = new jsPDF();

    // Add logo
    const logo = new Image();
    logo.src = logo_png;
    doc.addImage(logo, "png", 3, 5, 50, 20);
    doc.setFontSize(9);
    doc.text(`LOS CANELOS 571 EL BOSQUE, CHILLAN 98903124`, 5, 28);
    doc.text(`FECHA: ${order.date}`, 5, 33);
    // Add text box
    doc.setFontSize(12);
    doc.text(`Cotización`, 200, 10, { align: "right" });
    doc.setFontSize(10);
    doc.text(`${order.id}`, 200, 15, { align: "right" });
    doc.text(`76.365.199-1`, 200, 20, { align: "right" });
    doc.text(`RESOLIQ LTDA`, 200, 25, { align: "right" });

    // Add table
    const tableData = order.registers.map((x) => [
      x.residue.name,
      x.quantity,
      x.residue.type_medition,
    ]);

    const totalQuantity = order.registers.reduce(
      (total, register) => total + register.quantity,
      0
    );

    tableData.push(["Total", totalQuantity, ""]);

    const tableClient1 = [order.client].map((x) => [
      x.name,
      x.dni,
      x.phone_number,
      x.address,
      order.is_reposition ? "Reposición" : "Normal",
    ]);

    const tableDriver = [order.driver].map((x) => [
      x.name,
      x.dni,
      x.vehicle_plate,
      x.phone_number,
    ]);

    doc.setFontSize(14);
    doc.text(`Cliente`, 15, 50);
    doc.autoTable({
      title: "Cliente",
      head: [["Nombre", "Rut", "Telefono", "Email", "Tipo"]],
      body: tableClient1,
      startY: 55,
    });

    doc.setFontSize(12);
    doc.text(`Observación`, 15, 80);
    doc.text(`${order.observation}`, 18, 87);

    doc.setFontSize(14);
    doc.text(`Conductor`, 15, 115);
    doc.autoTable({
      title: "Conductor",
      head: [["Nombre", "Rut", "Patente", "Telefono"]],
      body: tableDriver,
      startY: 120,
    });

    doc.setFontSize(14);
    doc.text(`Listado de residuos`, 15, 150);

    doc.autoTable({
      head: [["Residuo", "Cantidad", "Medida"]],
      body: tableData,
      startY: 155,
      theme: "grid",
      styles: {
        tableWidth: "auto",
        cellWidth: "wrap",
        fontSize: 10,
        halign: "center",
        valign: "middle",
      },
    });

    

    doc.save(`${order.id}.pdf`);
  };

  useEffect(() => {
    getOrders();
  }, [state.list.countUpdate, state.list.page]);

  return (
    <Table
      dataSource={state.list.results}
      size="small"
      bordered
      scroll={{ x: true }}
      tableLayout="fixed"
      rowKey={(x) => x.id}
      pagination={{
        total: state.list.count,
        simple: true,
        onChange: (page) => dispatch({ type: "change_page", page: page }),
      }}
      columns={columns}
    />
  );
};

export default List;
