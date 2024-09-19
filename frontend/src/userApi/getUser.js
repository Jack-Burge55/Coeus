import * as constants from "../constants";

const getUser = (setCoeusUser) => {
  try {
    if (localStorage.userId && localStorage.userToken) {
      // get user information
      const url = new URL(
        `${constants.usedUrl}/api/v1/users/${localStorage.userId}`
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
            console.log(response);
          }
          return response.json();
        })
        .then((data) => {              
          if (data) {
            setCoeusUser(data)
          }
        })
        .catch((err) => console.log(err));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getUser;
