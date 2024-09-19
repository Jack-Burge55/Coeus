import * as constants from "../constants"
import getUser from "./getUser";

const unlikeVideo = async (videoId, setCoeusUser) => {
  let result;
  const url = new URL(
    `${constants.usedUrl}/api/v1/users/unlike/${videoId}`
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
        throw new Error("No video found");
      }
      getUser(setCoeusUser)
    })
    .catch((err) => {
      result = err
    });
        
  return result;
};

export default unlikeVideo;
