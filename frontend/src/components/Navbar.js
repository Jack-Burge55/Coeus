import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { coeusUser, setCoeusUser } = useContext(UserContext);

  const signOut = () => {
    setCoeusUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div>
      {location.pathname !== "/" && (
        <button onClick={() => navigate("/")}>Back to Home</button>
      )}
      {location.pathname !== `/profile/${coeusUser.userId}` && (
        <button onClick={() => navigate(`/profile/${coeusUser.userId}`)}>
          Go to Profile
        </button>
      )}
      {location.pathname !== "/find-users" && (
        <button onClick={() => navigate("/find-users")}>Find Users</button>
      )}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default Navbar;
