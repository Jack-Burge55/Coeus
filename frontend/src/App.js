import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Home, Register, Login, Profile, FindUsers } from "./components";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [coeusUser, setCoeusUser] = useState(null);
  
  useEffect(() => {
    try {
      // if no user set in local storage and page not login or register, redirect to login      
      if (
        !localStorage.userId &&
        location.pathname !== "/login" &&
        location.pathname !== "/register"
      ) {
        navigate("/login");
      } 
      if (localStorage.userId && localStorage.userToken) {
        const url = new URL(
          `http://localhost:1234/api/v1/users/${localStorage.userId}`
        );
        fetch(url, {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorisation: `Bearer ${localStorage.userToken}`,
          },
        })
          .then((response) => {
            if (response.status === 400) {
              console.log(response);
              
            }
            return response.json();
          })
          .then((data) => {
            if (data) {
              setCoeusUser(data);
            }
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(error);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/"
          element={<Home setCoeusUser={setCoeusUser} coeusUser={coeusUser} />}
        />
        <Route
          exact
          path="/find-users"
          element={
            <FindUsers setCoeusUser={setCoeusUser} coeusUser={coeusUser} />
          }
        />
        <Route
          exact
          path="/profile/:id"
          element={
            <Profile setCoeusUser={setCoeusUser} coeusUser={coeusUser} />
          }
        />
        <Route path="/login" element={<Login/>} />
        <Route
          path="/register"
          element={<Register/>}
        />
        <Route path="*" element={<h1>404 not found</h1>}></Route>
      </Routes>
    </div>
  );
}

export default App;
