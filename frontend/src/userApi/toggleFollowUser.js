import * as constants from "../constants"
import getUser from "./getUser";

const toggleFollowUser = async (userId, followString, setCoeusUser) => {
  const url = new URL(
    `${constants.usedUrl}/api/v1/users/${followString}/${userId}`
  );
  await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authorisation: `Bearer ${localStorage.userToken}`,
    },
  })
    .then((response) => {      
      if (response.status !== 200) {
        throw new Error("No users found");
      }
      getUser(setCoeusUser)
    })
    .catch((err) => {
      return err
    });
};

export default toggleFollowUser;
