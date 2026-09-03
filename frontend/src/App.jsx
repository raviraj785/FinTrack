import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";


function App() {

  const [page, setPage] = useState("home");


  const [isLoggedIn, setIsLoggedIn] =
    useState(
      localStorage.getItem(
        "fintrack_logged_in"
      ) === "true"
    );


  /* =========================
     LOGIN
  ========================= */

  const handleLogin = () => {

    localStorage.setItem(
      "fintrack_logged_in",
      "true"
    );

    setIsLoggedIn(true);

    setPage("dashboard");

  };


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "fintrack_logged_in"
    );

    setIsLoggedIn(false);

    setPage("home");

  };


  /* =========================
     IF LOGGED IN
  ========================= */

  if (isLoggedIn) {

    return (
      <Dashboard
        onLogout={handleLogout}
      />
    );

  }


  /* =========================
     HOME
  ========================= */

  if (page === "home") {

    return (

      <Home
        onLogin={() =>
          setPage("login")
        }
        onSignup={() =>
          setPage("signup")
        }
      />

    );

  }


  /* =========================
     LOGIN
  ========================= */

  if (page === "login") {

    return (

      <Login
        onLogin={handleLogin}
        onSignup={() =>
          setPage("signup")
        }
      />

    );

  }


  /* =========================
     SIGNUP
  ========================= */

  if (page === "signup") {

    return (

      <Signup
        onSignup={() =>
          setPage("login")
        }
        onLogin={() =>
          setPage("login")
        }
      />

    );

  }


  return null;
}


export default App;