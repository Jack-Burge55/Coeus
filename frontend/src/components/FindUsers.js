import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FindUsers = ({ setCoeusUser, coeusUser }) => {
  const navigate = useNavigate();
  
  const [userSuggestions, setUserSuggestions] = useState(null);
  const [errorMsg, setErrorMsg] = useState([]);

  const updateUserFollowers = (followerArray) => {
    const updatedUser = { ...coeusUser };
    updatedUser.follows = followerArray;
    setCoeusUser(updatedUser);
  };

  const followUser = (userId) => {
    try {
      const url = new URL(
        `http://localhost:1234/api/v1/users/follow/${userId}`
      );
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.userToken}`,
        },
      })
        .then((response) => {
          if (response.status === 400) {
            setErrorMsg("No users found");
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            updateUserFollowers(data.user.follows);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = (userId) => {
    try {
      const url = new URL(
        `http://localhost:1234/api/v1/users/unfollow/${userId}`
      );
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.userToken}`,
        },
      })
        .then((response) => {
          if (response.status === 400) {
            setErrorMsg("No users found");
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            updateUserFollowers(data.user.follows);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // get all users to show (except own user)
    try {
      const url = new URL("http://localhost:1234/api/v1/users");
      fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.userToken}`,
        },
      })
        .then((response) => {
          if (response.status === 400) {
            setErrorMsg("No users found");
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            const allUsers = data.cleanedUsers;
            const suggestions = allUsers.filter(
              (user) => user._id !== coeusUser.userId
            );
            setUserSuggestions(suggestions);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [coeusUser]);

  return (
    <>
      {(coeusUser && userSuggestions) ? (
        <>
          <h1>Find Users</h1>
          {userSuggestions.map((sugg) => {
            return (
              <div key={sugg._id}>
                <h5>{sugg.username}</h5>
                {coeusUser.follows.includes(sugg._id) ? (
                  <button onClick={() => unfollowUser(sugg._id)}>
                    Unfollow User
                  </button>
                ) : (
                  <button onClick={() => followUser(sugg._id)}>
                    Follow User
                  </button>
                )}
                <button onClick={() => navigate(`/profile/${sugg._id}`)}>Visit their profile</button>
              </div>
            );
          })}
          {errorMsg && <h2>{errorMsg}</h2>}
        </>
      ) :
      (<>
      <h1>Loading...</h1>
      </>)}
      {errorMsg && <h2>{errorMsg}</h2>}
    </>
  );
};

export default FindUsers;
