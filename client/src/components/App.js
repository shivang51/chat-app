import React, { useState } from "react";
import "./styles/App.css";
import Header from "./Header";
import { Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home.jsx";
import SignUp from "./SignUp.jsx";
import Cookie from "js-cookie";

function App() {
  const [isLogedIn, setisLogedIn] = useState(false);
  const [userId, setuserId] = useState("");

  React.useEffect(() => {
    let user = Cookie.get("user");
    if (user) {
      user = JSON.parse(user.toString());
      if (user.id) {
        setisLogedIn(true);
        setuserId(user.id);
      }
    }
  }, []);

  return (
    <div className="App">
      <Header
        isLogedIn={isLogedIn}
        setisLogedIn={setisLogedIn}
        userId={userId}
        setuserId={setuserId}
      />

      <Route
        path="/login"
        exact
        component={() => (
          <Login
            setisLogedIn={setisLogedIn}
            isLogedIn={isLogedIn}
            setuserId={setuserId}
          />
        )}
      />
      <Route
        path="/home"
        exact
        component={() => <Home userId={userId} isLogedIn={isLogedIn} />}
      />
      <Route path="/signup" exact component={() => <SignUp />} />
    </div>
  );
}

export default App;
