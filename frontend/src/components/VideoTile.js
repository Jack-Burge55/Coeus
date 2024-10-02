import { useContext } from "react";

import { UserContext } from "../UserContext";
import Video from "./Video";

import toggleLikeVideo from "../userApi/toggleLikeVideo";
import getUser from "../userApi/getUser";
import * as constants from "../constants";

const VideoTile = ({ url, videoId, majorTopics, minorTopics, likeCount, usersOwn, uploadedByName }) => {
  const { coeusUser, setCoeusUser } = useContext(UserContext);
  const action = !coeusUser.likedVideos.includes(videoId);

  // call delete video API
  const deleteVideo = async (videoId) => {
    try {
      const url = new URL(`${constants.usedUrl}/api/v1/videos/`);
      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          videoId,
        }),
      })
        .then(getUser(setCoeusUser))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    {uploadedByName && <p>{uploadedByName}</p>}
      <Video
        url={url}
        majorTopics={majorTopics}
        minorTopics={minorTopics}
      ></Video>
      {!usersOwn && (
        <div>
          <button
            onClick={() =>
              toggleLikeVideo(videoId, setCoeusUser, action ? "like" : "unlike")
            }
          >
            {action ? "Like Video" : "Unlike Video"}
          </button>
        </div>
      )}
      {usersOwn && (
        <div>
          <button onClick={() => deleteVideo(videoId)}>Delete Video</button>
        </div>
      )}
      <p>Like Count: {likeCount}</p>
    </>
  );
};

export default VideoTile;
