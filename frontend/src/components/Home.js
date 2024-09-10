import { useNavigate } from "react-router-dom";

const Home = ({ setCoeusUser, coeusUser }) => {
  const navigate = useNavigate();

  const findUsers = () => {
    navigate(`/find-users`)
  }

  const signOut = () => {
    setCoeusUser("");
    localStorage.removeItem("coeusUser");
    localStorage.removeItem("userToken")
    navigate("/login");
  };

  const goToProfile = () => {
    navigate(`/profile/${coeusUser}`);
  };

  return (
    <>
      <h1>Home</h1>
      <button onClick={() => findUsers()}>Find Users</button>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={() => goToProfile()}>Go To Your Profile</button>
    </>
  );
};

export default Home;
