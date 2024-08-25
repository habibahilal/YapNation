import "../css/Login.css";
import React from "react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <div>
      <div className="mainContainer">
        <div className="loginContainer">
          <h1> Ready to Yap? </h1>
          <div className="forms">
            <input type="checkbox" id="chk" aria-hidden="true" />
            <Signup />
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
