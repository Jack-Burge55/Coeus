import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

import toggleFollowUser from "../userApi/toggleFollowUser";
import * as constants from "../constants";

const FindUsers = () => {
  const navigate = useNavigate();
  const { coeusUser, setCoeusUser } = useContext(UserContext);

  const [userSuggestions, setUserSuggestions] = useState(null);
  const [errorMsg, setErrorMsg] = useState([]);

  useEffect(() => {
    // get all users to show (except own user)
    if (!coeusUser) return;
    try {
      const url = new URL(`${constants.usedUrl}/api/v1/users`);
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
      {coeusUser && userSuggestions ? (
        <>
          <h1>Find Users</h1>
          <button onClick={() => navigate("/")}>Back to home</button>
          {userSuggestions.map((sugg) => {
            return (
              <div key={sugg._id}>
                <h5>{sugg.username}</h5>
                {coeusUser.follows.includes(sugg._id) ? (
                  <button
                    onClick={async () => {
                      const result = await toggleFollowUser(
                        sugg._id,
                        "unfollow",
                        setCoeusUser
                      );
                      if ((result instanceof Error)) {
                        setErrorMsg("User doesn't exist!");
                      }
                    }}
                  >
                    Unfollow User
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      const result = await toggleFollowUser(
                        sugg._id,
                        "follow",
                        setCoeusUser
                      );
                      if ((result instanceof Error)) {
                        setErrorMsg("User doesn't exist!");
                      }
                    }}
                  >
                    Follow User
                  </button>
                )}
                <button onClick={() => navigate(`/profile/${sugg._id}`)}>
                  Visit their profile
                </button>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <h1>Loading...</h1>
        </>
      )}
      {errorMsg && <h2>{errorMsg}</h2>}
    </>
  );
};

export default FindUsers;
