import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { API_URL } from "../../../utils/ApiRuta";

const loginSchema = z.object({
  username: z
    .string()
    .email("Debe ingresar un correo válido")
    .min(1, "Ingrese su Usuario"),
  password: z.string().min(1, "Ingrese su contraseña"),
});

export default function IniciarSesion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChangeUsername = (value) => {
    setUsername(value);
    if (errors.username) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: null,
      }));
    }
  };

  const handleChangePassword = (value) => {
    setPassword(value);
    if (errors.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: null,
      }));
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    console.log("CAPTCHA Token:", token);
  };

  const handleSubmit = async (values) => {
    try {
      loginSchema.parse(values);
      setErrors({});

      if (!captchaToken) {
        message.error("Por favor, complete el CAPTCHA.");
        return;
      }

      const response = await axios.post(API_URL + "/auth/login", {
        username: values.username,
        password: values.password,
        recaptchaResponse: captchaToken,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", values.username);
        window.location.href = "/paginaprincipal";
        message.success("Inicio de sesión exitoso");
      } else {
        message.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      message.error("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-500">
      <Row justify="center" className="w-full">
        <Col xl={8} lg={10} md={12} sm={20} xs={24}>
          <Card className="bg-white shadow-md rounded-lg overflow-hidden lg:flex lg:max-w-4xl">
            <div className="lg:flex-1">
              <img
                className="h-full object-cover w-full lg:h-auto"
                src="https://unsm.edu.pe/wp-content/uploads/2018/05/archivero-unsm-2018.jpg"
                alt="Archivero UNSM"
              />
            </div>
            <div className="p-4 lg:flex-1 lg:p-12">
              <h2 className="text-2xl font-bold text-center text-gray-700">
                ARCHIVERO CENTRAL
              </h2>
              <Form onFinish={handleSubmit} layout="vertical" className="mt-6">
                <Form.Item
                  label="Usuario"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingresa tu correo electrónico",
                    },
                  ]}
                >
                  <Input
                    type="email"
                    placeholder="Ingrese su usuario"
                    onChange={(e) => handleChangeUsername(e.target.value)}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs italic">
                      {errors.username}
                    </p>
                  )}
                </Form.Item>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingresa tu contraseña",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Ingrese su contraseña"
                    onChange={(e) => handleChangePassword(e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs italic">
                      {errors.password}
                    </p>
                  )}
                </Form.Item>

                <Form.Item>
                  <ReCAPTCHA
                    sitekey="6Lcs1U0qAAAAAKrgSA6QXMBD7ziudNsw5jtjCBdF"
                    onChange={handleCaptchaChange}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    Iniciar Sesión
                  </Button>
                </Form.Item>
              </Form>
              <div className="mt-4 text-center">
                <Link to={"/restore"} className="hover:text-green-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
