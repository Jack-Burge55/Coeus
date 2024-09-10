import { useEffect, useState } from "react";

const FindUsers = ({ setCoeusUser, coeusUser }) => {
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState([]);
  const [follows, setFollows] = useState([])

  const followUser = (userId) => {
    try {
      const url = new URL(`http://localhost:1234/api/v1/users/follow/${userId}`);
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorisation": `Bearer ${localStorage.userToken}`
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
            setFollows(data.user.follows)
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }

  const unfollowUser = (userId) => {
    try {
      const url = new URL(`http://localhost:1234/api/v1/users/unfollow/${userId}`);
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorisation": `Bearer ${localStorage.userToken}`
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
            setFollows(data.user.follows)
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // get all users to show (except own user)
    try {
      const url = new URL("http://localhost:1234/api/v1/users");
      fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorisation": `Bearer ${localStorage.userToken}`
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
              (user) => user._id !== coeusUser
            );
            setUserSuggestions(suggestions);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }

    // access users follows list
    try {
      const url = new URL(`http://localhost:1234/api/v1/users/${coeusUser}`);
      fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorisation": `Bearer ${localStorage.userToken}`
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
            setFollows(data.follows)
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [coeusUser]);

  return (
    <>
      <h1>Find Users</h1>
      {userSuggestions.map((sugg) => {
        return (
          <div key={sugg._id}>
            <h5>{sugg.username}</h5>
            {follows.includes(sugg._id) ? <button onClick={() => unfollowUser(sugg._id)}>Unfollow User</button> : <button onClick={() => followUser(sugg._id)}>Follow User</button>}
          </div>
        );
      })}
      {errorMsg && <h2>{errorMsg}</h2>}
    </>
  );
};

export default FindUsers;
