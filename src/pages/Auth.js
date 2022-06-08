// react
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useQuery } from "react-query";

// API
import { API } from "../config/Api.js";

// css
import "../assets/css/Auth.css";

// images
import ImgDumbMerch from "../assets/images/ic_DumbMerch.png";

// components
import FormLogin from "../components/auth/FormLogin";
import FormRegister from "../components/auth/FormRegister";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  // swtich islogin usestate
  const SwitchLogin = () => {
    setIsLogin(true);
  };

  const SwitchRegister = () => {
    setIsLogin(false);
  };

  // get product
  let { data: products } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data.product;
  });

  return (
    <div className="auth">
      <Container>
        <Row className="vh-100 d-flex align-items-center">
          {/* leftside */}
          <Col md="6">
            <img
              src={ImgDumbMerch}
              className="img-fluid"
              style={{ width: "264px", height: "264px" }}
              alt="brand"
            />
            <div className="text-auth-header mt-4">Easy, Fast and Reliable</div>
            <p className="text-auth-parag mt-3">
              Go shopping for merchandise, just go to dumb merch <br />{" "}
              shopping. the biggest merchandise in <b>Indonesia</b>
            </p>
            <div className="mt-5">
              <button onClick={SwitchLogin} className="btn btn-login px-5">
                Login
              </button>
              <button
                onClick={SwitchRegister}
                className="btn btn-register px-5"
              >
                Register
              </button>
            </div>
          </Col>
          {/* form login / register */}
          <Col>{isLogin ? <FormLogin /> : <FormRegister />}</Col>
        </Row>
      </Container>
    </div>
  );
}
