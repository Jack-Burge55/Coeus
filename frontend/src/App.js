import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Home, Register, Login, Profile, Topic, FindUsers } from "./pages";
import { Loading, Navbar } from "./components";
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import getUser from "./userApi/getUser";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [coeusUser, setCoeusUser] = useState(null);
  const savedUser = localStorage.userId;
  const pastLogIn =
    location.pathname !== "/login" && location.pathname !== "/register";

  useEffect(() => {
    // if no user set in local storage and page not login or register, redirect to login
    if (!savedUser && pastLogIn) {
      navigate("/login");
    }
    getUser(setCoeusUser);
  }, [savedUser, navigate, pastLogIn]);

  return (
    <div className="App">
      <UserContext.Provider value={{ coeusUser, setCoeusUser }}>
        {savedUser && pastLogIn && coeusUser && <Navbar />}
        {/* condition to check if to show loading while awaiting coeusUser */}
        {savedUser && pastLogIn && !coeusUser ? (
          <Loading />
        ) : (
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/find-users" element={<FindUsers />} />
            <Route exact path="/topic/:topic-name" element={<Topic />} />
            <Route exact path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<h1>404 not found</h1>}></Route>
          </Routes>
        )}
      </UserContext.Provider>
    </div>
  );
}

export default App;
