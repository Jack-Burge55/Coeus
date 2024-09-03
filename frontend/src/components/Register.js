import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
// require("dotenv").config()

const Register = ({setCoeusUser}) => {
  const [userCreated, setUserCreated] = useState("")

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
          .then((response) => response.json())
          .then((data) => {
            if (data.userCreated) {
              setCoeusUser(data.user.username)
              localStorage.setItem("coeusUser", data.user.username)
              setUserCreated(true)
            }
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const navigate = useNavigate();
 
  useEffect(() => {
    // Checking if user is not loggedIn
    if (userCreated) {
      navigate("/");
    }
  }, [navigate, userCreated]);


  return (
    <>

      <h2>Register page</h2>
      <input placeholder="Username" id="usernameInput"></input>
      <input placeholder="Email" id="emailInput"></input>
      <input placeholder="Password" id="passwordInput"></input>
      <button onClick={() => registerClick()}>Register to Coeus</button>
      <button onClick={() => navigate("/login")}>Already registered? Log in instead</button>
    </>
  );
};

export default Register;
