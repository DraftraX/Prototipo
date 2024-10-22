import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Avatar,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { API_URL } from "../utils/ApiRuta";

const { Title, Paragraph } = Typography;

const Perfil = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let username;
  if (token) {
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const decodedPayload = atob(encodedPayload);
    const parsedPayload = JSON.parse(decodedPayload);

    username = parsedPayload.sub;
  } else {
    console.log("No se encontró ningún token en el almacenamiento local.");
  }

  const [userData, setUserData] = useState({
    id: "",
    name: "",
    lastname: "",
    address: "",
    phone: "",
    fotoPerfil: "",
    cargoid: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          API_URL + `/usuario/verusuarioporusername/${username}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Error al obtener los datos del usuario");
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username, token]);

  return (
    <div style={{ backgroundColor: "#f0f2f5", padding: "40px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            }}
          >
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src="https://static.eldiario.es/clip/ab74aa95-3656-424c-8ca1-dce590aabb97_16-9-discover-aspect-ratio_default_0.jpg"
              style={{ marginBottom: "16px" }}
            />
            <Title level={4}>{userData.name}</Title>
            <Paragraph type="secondary">{userData.cargoid}</Paragraph>
            <Divider />
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                block
                onClick={() => navigate("/createresolucion")}
              >
                Agregar Resoluciones
              </Button>
              <Button
                type="default"
                icon={<IdcardOutlined />}
                block
                onClick={() => navigate("/creategrado")}
              >
                Agregar Grados y Titulos
              </Button>
              <Button
                type="default"
                icon={<IdcardOutlined />}
                block
                onClick={() => navigate("/createposgrado")}
              >
                Agregar Maestria y Doctorado
              </Button>
              <Button
                type="dashed"
                icon={<SettingOutlined />}
                block
                onClick={() => navigate("/create")}
              >
                Crear usuario
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card
            style={{
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            }}
          >
            <Descriptions title="Información del Usuario" bordered>
              <Descriptions.Item label="Nombre" span={3}>
                <Space>
                  <UserOutlined />
                  <Paragraph>{userData.name}</Paragraph>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Apellido" span={3}>
                <Space>
                  <UserOutlined />
                  <Paragraph>{userData.lastname}</Paragraph>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono" span={3}>
                <Space>
                  <PhoneOutlined />
                  <Paragraph>{userData.phone}</Paragraph>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Dirección" span={3}>
                <Space>
                  <HomeOutlined />
                  <Paragraph>{userData.address}</Paragraph>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Perfil;
