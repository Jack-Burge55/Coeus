import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Home, Register, Login, Profile } from "./components";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [coeusUser, setCoeusUser] = useState(
    localStorage.getItem("coeusUser") || ""
  );

  // if no user set in local storage and page not login or register, redirect to login
  useEffect(() => {
    if (
      !coeusUser &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      navigate("/login");
    }
  }, [location.pathname, navigate, coeusUser]);

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
          path="/profile/:id"
          element={
            <Profile setCoeusUser={setCoeusUser} coeusUser={coeusUser} />
          }
        />
        <Route path="/login" element={<Login setCoeusUser={setCoeusUser} />} />
        <Route
          path="/register"
          element={<Register setCoeusUser={setCoeusUser} />}
        />
        <Route path="*" element={<h1>404 not found</h1>}></Route>
      </Routes>
    </div>
  );
}

export default App;
