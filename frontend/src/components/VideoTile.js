import { useContext } from "react";

import { UserContext } from "../UserContext";
import Video from "./Video";

import toggleLikeVideo from "../userApi/toggleLikeVideo";

const VideoTile = ({ url, videoId, majorTopics, minorTopics, usersOwn }) => {
  
  const {coeusUser, setCoeusUser} = useContext(UserContext);
  const action = !coeusUser.likedVideos.includes(videoId)
  console.log(minorTopics, action);
  return (
    <>
      <Video
        url={url}
        majorTopics={majorTopics}
        minorTopics={minorTopics}
      ></Video>
      {!usersOwn && (
        <div>
          <button onClick={() => toggleLikeVideo(videoId, setCoeusUser, action ? "like" : "unlike")}>{action ? "Like Video": "Unlike Video"}</button>
        </div>
      )}
    </>
  );
};

export default VideoTile;
