import React from "react";
import "./styles/css/Login.css";
import loginBackgound from "../assets/images/login-background.jpg";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";

function Login(props) {
  const [clicked, setClicked] = React.useState(false);

  const [info, setInfo] = React.useState({ uid: "", password: "" });

  function handleClick() {
    if (info.uid && info.password)
      axios.post("http://localhost:8080/login", info).then((res) => {
        if (res.data === "good") {
          setClicked(true);
          Cookie.set("user", { isLogedIn: true, id: info.uid });
          props.setisLogedIn(true);
          props.setuserId(info.uid);
        } else if (res.data === "wrong") {
          alert("Wrong Password");
        } else {
          alert("User Not exsist");
        }
      });
    else {
      alert("All fields are mandatory");
    }
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setInfo((preInfo) => {
      return { ...preInfo, [name]: value };
    });
  }

  return (
    <div className="login-container">
      <img src={loginBackgound} alt="back" />
      <div className="login-i-container">
        <h4>Login</h4>
        <input
          type="text"
          placeholder="Id"
          name="uid"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        <div className="controls">
          <button id="login-btn" onClick={handleClick}>
            Login
          </button>
        </div>
      </div>
      {clicked || props.isLogedIn ? <Redirect to="/home" /> : null}
    </div>
  );
}

export default Login;
