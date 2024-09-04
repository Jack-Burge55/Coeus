import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ setCoeusUser, coeusUser }) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const thisProfile = window.location.href.split("profile/")[1];

  useEffect(() => {
    try {
      const url = new URL(`http://localhost:1234/api/v1/users/${thisProfile}`);
      fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          if (response.status === 400) {
            setErrorMsg("User profile does not exist");
          }
          if (response.status === 200) {
            setErrorMsg("");
          }
          return response.json();
        })
        .then((data) => {
          if (data.username) {
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [thisProfile]);

  const deleteProfile = async () => {
    console.log("Delete Profile here");
    try {
      const url = new URL(
        `http://localhost:1234/api/v1/auth/delete/${coeusUser}`
      );
      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.username) {
            setCoeusUser("");
            localStorage.setItem("coeusUser", "");
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!errorMsg ? (
        <div>
          <h1>Profile</h1>
          {thisProfile === coeusUser && (
            <button onClick={() => deleteProfile()}>Delete your profile</button>
          )}
          <button onClick={() => navigate("/")}>Back to home</button>
        </div>
      ) : (
        <div>
          <h3>No user exists for what you're looking for :(</h3>
        </div>
      )}
    </>
  );
};

export default Profile;
