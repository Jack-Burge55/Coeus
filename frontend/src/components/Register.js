import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setCoeusUser }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const registerClick = async () => {
    const usernameInput = document.getElementById("usernameInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
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
      <input placeholder="Username" id="usernameInput"></input>
      <input placeholder="Email" id="emailInput"></input>
      <input placeholder="Password" id="passwordInput"></input>
      <button onClick={() => registerClick()}>Register to Coeus</button>
      <button onClick={() => navigate("/login")}>
        Already registered? Log in instead
      </button>
      {errorMsg && <h3>{errorMsg}</h3>}
    </>
  );
};

export default Register;
