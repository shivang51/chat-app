import React from "react";
import "./styles/css/Header.css";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";

function Header(props) {
  const [userInfo, setuserInfo] = React.useState({ uid: "", uname: "" });

  function handleLogout() {
    props.setisLogedIn(false);
    props.setuserId("");
    Cookie.remove("user");
  }

  React.useEffect(() => {
    if (props.userId)
      axios
        .post("http://localhost:8080/userdata", { uid: props.userId })
        .then((res) => {
          setuserInfo({ uname: res.data.uname, uid: props.userId });
        });
  }, [props]);

  return (
    <header>
      <h1 id="main-title">We-Chat</h1>

      <div className="controls">
        {props.isLogedIn ? (
          <>
            <Redirect to="/home" />
            <h4 className="uname">{userInfo.uname}</h4>
            <h4>{userInfo.uid}</h4>
            <Link to="/login" onClick={handleLogout}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link id="login-button" to="/login">
              Login
            </Link>
            <Link id="signup-button" to="/signup">
              Sign-Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
