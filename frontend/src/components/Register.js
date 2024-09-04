import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setCoeusUser }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const registerClick = async () => {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    if (username && password) {
      const request = {
        username,
        email,
        password,
      };
      try {
        const url = new URL("http://localhost:1234/api/v1/auth/register");
        await fetch(url, {
          method: "POST",
          body: JSON.stringify(request),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => {
            if (response.status === 400) {
              setErrorMsg("User already exists, please try again");
            }
            return response.json();
          })
          .then((data) => {
            if (data.user) {
              setCoeusUser(data.user.userID);
              localStorage.setItem("coeusUser", data.user.userID);
              navigate("/");
            }
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <h2>Register page</h2>
      <form>
        <label htmlFor="username">Username</label>
        <br />
        <input type="text" id="username" name="username" />
        <br />
        <label htmlFor="email">Email</label>
        <br />
        <input type="text" id="email" name="email" />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input type="text" id="password" name="password" />
      </form>
      <button onClick={() => registerClick()}>Register to Coeus</button>
      <button onClick={() => navigate("/login")}>
        Already registered? Log in instead
      </button>
      {errorMsg && <h3>{errorMsg}</h3>}
    </>
  );
};

export default Register;
