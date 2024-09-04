import { useNavigate } from "react-router-dom";

const Home = ({ setCoeusUser, coeusUser }) => {
  const navigate = useNavigate();

  const signOut = () => {
    setCoeusUser("");
    localStorage.removeItem("coeusUser");
    navigate("/login");
  };

  const goToProfile = () => {
    navigate(`/profile/${coeusUser}`);
  };

  return (
    <>
      <h1>Home</h1>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={() => goToProfile()}>Go To Your Profile</button>
    </>
  );
};

export default Home;
