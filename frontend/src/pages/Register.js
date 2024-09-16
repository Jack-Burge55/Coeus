import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const validateForm = async () => {
    const form = document.getElementById("registerForm");
    const formFieldArray = Array.from(form.getElementsByTagName("input"));

    let noErrors = true;
    formFieldArray.forEach((field) => {
      
      let fieldError = "";
      if (field.minLength > 0) {
        if (field.value < field.minLength) {
          fieldError = `${field.name} must be at least ${field.minLength} characters long`;
        }
      }
      if (field.hasAttribute("data-mustmatch")) {
        const matchingField = document.getElementById(field.getAttribute("data-mustmatch"))
        
        if (matchingField.value !== field.value) {
          fieldError = `${field.name} does not match ${matchingField.name}`
        }
      }
      if (field.required && field.value === "") {
        fieldError = `${field.name} is a required field`;
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
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (noErrors) {
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
              localStorage.setItem("userId", data.user.userId);
              localStorage.setItem("userToken", data.token)
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
      <form id="registerForm">
        <label htmlFor="username">Username</label>
        <br />
        <input type="text" id="username" name="Username" required />
        <p id="usernameError"></p>
        <label htmlFor="email">Email</label>
        <br />
        <input type="text" id="email" name="Email Address" required />
        <p id="emailError"></p>
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="text"
          id="password"
          name="Password"
          required
          minLength="6"
        />
        <p id="passwordError"></p>
        <label htmlFor="passwordConfirmation">Password Confirmation</label>
        <br />
        <input
          type="text"
          id="passwordConfirmation"
          name="Password Confirmation"
          required
          data-mustmatch="password"
        />
        <p id="passwordConfirmationError"></p>
      </form>
      <button onClick={() => validateForm()}>Register to Coeus</button>
      <button onClick={() => navigate("/login")}>
        Already registered? Log in instead
      </button>
      {errorMsg && <h3>{errorMsg}</h3>}
    </>
  );
};

export default Register;
