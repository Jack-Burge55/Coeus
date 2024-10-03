import { useEffect, useState } from "react";
import { VideoTile } from "../components";
import * as constants from "../constants";

const Topic = () => {
  const [topicVideos, setTopicVideos] = useState([]);
  const topicString = window.location.href.split("topic/")[1];
  const topic = topicString?.split("-").map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  });

  useEffect(() => {
    try {
      const url = new URL(`${constants.usedUrl}/api/v1/videos/topic/${topic}`);
      fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.userToken}`,
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error("No videos with topic found");
          }
          return response.json();
        })
        .then((data) => {
          setTopicVideos(data.videos);
        });
    } catch (error) {
      console.log(error);
    }
  }, [topic]);

  return (
    <div>
      <h2>{topic}</h2>
      {topicVideos.map((video) => {
        return (
          <div key={video._id}>
            <VideoTile
              url={video.url}
              videoId={video._id}
              majorTopics={video.majorTopics}
              minorTopics={video.minorTopics}
              likeCount={video.likeCount}
              usersOwn={video.uploadedBy === localStorage.userId}
              uploadedByName={video.uploadedByName}
            ></VideoTile>
          </div>
        );
      })}
    </div>
  );
};

export default Topic;
