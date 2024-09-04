import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setCoeusUser }) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const loginClick = async () => {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username && password) {
      const request = {
        username,
        password,
      };
      try {
        const url = new URL("http://localhost:1234/api/v1/auth/login");
        await fetch(url, {
          method: "POST",
          body: JSON.stringify(request),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => {
            console.log(response);

            if (response.status === 401) {
              setErrorMsg("User cannot be found, please try again");
              throw new Error("No User found");
            }
            return response.json();
          })
          .then((data) => {
            setCoeusUser(data.user?.userId);
            localStorage.setItem("coeusUser", data.user?.userId);
            navigate("/");
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <h2>Login page</h2>
      <form>
        <label htmlFor="username">Username</label>
        <br />
        <input type="text" id="username" name="username" />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input type="text" id="password" name="password" />
      </form>
      <button onClick={() => loginClick()}>Log in to Coeus</button>
      <button id="registerButton" onClick={() => navigate("/register")}>
        No account? Register here
      </button>
      {errorMsg && <h3>{errorMsg}</h3>}
    </>
  );
};

export default Login;
