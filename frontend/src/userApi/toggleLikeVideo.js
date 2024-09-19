import * as constants from "../constants"
import getUser from "./getUser";

// action is either 'like' or 'unlike'

const toggleLikeVideo = async (videoId, setCoeusUser, action) => {
  let result;
  const url = new URL(
    `${constants.usedUrl}/api/v1/users/${action}/${videoId}`
  );
  console.log(action);
  
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
      console.log("getUser called");
      
      getUser(setCoeusUser)
    })
    .catch((err) => {
      result = err
    });
        
  return result;
};

export default toggleLikeVideo;
