import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Home, Register, Login, Profile, FindUsers } from "./pages";
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import getUser from "./userApi/getUser";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [coeusUser, setCoeusUser] = useState(null);

  useEffect(() => {
    // if no user set in local storage and page not login or register, redirect to login
    if (
      !localStorage.userId &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      navigate("/login");
    }
    getUser(setCoeusUser);

    // const fetchUser = async() => {
    //   // You can await here
    //   const res = await getUser();
    //   console.log(res);

    //   return res
    //   // ...
    // }
    // setCoeusUser(fetchUser())
    // console.log(coeusUser);

    // try {
    //   if (localStorage.userId && localStorage.userToken) {
    //     // get user information
    //     const url = new URL(
    //       `${constants.usedUrl}/api/v1/users/${localStorage.userId}`
    //     );
    //     fetch(url, {
    //       method: "GET",
    //       headers: {
    //         "Content-type": "application/json; charset=UTF-8",
    //         authorisation: `Bearer ${localStorage.userToken}`,
    //       },
    //     })
    //       .then((response) => {
    //         if (response.status === 400) {
    //           console.log(response);
    //         }
    //         return response.json();
    //       })
    //       .then((data) => {
    //         console.log(data);

    //         if (data) {
    //           setCoeusUser(data);
    //         }
    //       })
    //       .catch((err) => console.log(err));
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }, [location.pathname, navigate]);

  return (
    <div className="App">
      <UserContext.Provider value={{ coeusUser, setCoeusUser }}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/find-users" element={<FindUsers />} />
          <Route
            exact
            path="/profile/:id"
            element={<Profile setCoeusUser={setCoeusUser} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h1>404 not found</h1>}></Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
