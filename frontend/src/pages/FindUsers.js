import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

import toggleFollowUser from "../userApi/toggleFollowUser";
import * as constants from "../constants";
import { Loading } from "../components";

const FindUsers = () => {
  const navigate = useNavigate();
  const { coeusUser, setCoeusUser } = useContext(UserContext);

  const [userSuggestions, setUserSuggestions] = useState(null);
  const [userLimitReached, setUserLimitReached] = useState(false)
  const [errorMsg, setErrorMsg] = useState([]);
  const [userPage, setUserPage] = useState(1);

  useEffect(() => {
    // get all users to show (except own user)
    try {
      // limit is 11, to check another page can be loaded of users (min. 1)
      const url = new URL(
        `${constants.usedUrl}/api/v1/users?limit=10&page=${userPage}`
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
            const isLimitReached = allUsers.length < 11
            setUserSuggestions(isLimitReached ? suggestions : suggestions.slice(0, suggestions.length - 1));
            setUserLimitReached(isLimitReached)
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [coeusUser, userPage]);

  return (
    <>
      {userSuggestions ? (
        <>
          <h1>Find Users</h1>
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
                      if (result instanceof Error) {
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
                      if (result instanceof Error) {
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
          {userPage > 1 && (
            <button onClick={() => setUserPage(userPage - 1)}>
              Previous Users (Page {userPage - 1})
            </button>
          )}
          {
            !userLimitReached && <button onClick={() => setUserPage(userPage + 1)}>
              More Users (Page {userPage + 1})
            </button>
          }
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
      {errorMsg && <h2>{errorMsg}</h2>}
    </>
  );
};

export default FindUsers;
