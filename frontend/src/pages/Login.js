import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const loginClick = async () => {
    const form = document.getElementById("loginForm");
    const formFieldArray = Array.from(form.getElementsByTagName("input"));

    let noErrors = true;
    formFieldArray.forEach((field) => {
      let fieldError = "";
      if (field.required && field.value === "") {
        fieldError = `${field.id} is a required field`;
      }
      fieldError
        ? field.classList.add("has-error")
        : field.classList.remove("has-error");
      if (fieldError) {
        noErrors = false;
      }
      const errorMsg = document.getElementById(`${field.id}Error`);
      errorMsg.innerText = fieldError;
    });
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (noErrors) {
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
            if (response.status === 401) {
              setErrorMsg("User cannot be found, please try again");
              throw new Error("No User found");
            }
            return response.json();
          })
          .then((data) => {
            localStorage.setItem("userId", data.user?.userId);
            localStorage.setItem("userToken", data.token)
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
      <form id="loginForm">
        <label htmlFor="username">Username</label>
        <br />
        <input type="text" id="username" name="Username" required />
        <p id="usernameError"></p>
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="text"
          id="password"
          name="Password"
          required
        />
        <p id="passwordError"></p>
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
