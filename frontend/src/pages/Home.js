import { useEffect, useState } from "react";
import * as constants from "../constants";
import { VideoTile } from "../components";

const Home = () => {
  const [recentVideos, setRecentVideos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [videoPage, setVideoPage] = useState(1);
  const [videoLimitReached, setVideoLimitReached] = useState(false);

  useEffect(() => {
    try {
      const url = new URL(
        `${constants.usedUrl}/api/v1/videos/all?limit=5&page=${videoPage}`
      );
      fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.userToken}`,
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            setErrorMsg("Videos could not be found");
            throw new Error("no videos found");
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            const videos = data.videos;
            const isLimitReached = videos.length < 5;
            setRecentVideos(
              isLimitReached ? videos : videos.slice(0, videos.length - 1)
            );
            setVideoLimitReached(isLimitReached);
          }
        });
    } catch (error) {}
  }, [videoPage]);

  return (
    <div>
      <h1>Home</h1>
      {errorMsg && <h2>{errorMsg}</h2>}
      {recentVideos.length > 0 && (
        <div>
          <h2>Recent videos you might like</h2>
          {recentVideos.map((video) => {
            return (
              <VideoTile
                key={video._id}
                url={video.url}
                videoId={video._id}
                majorTopics={video.majorTopics}
                minorTopics={video.minorTopics}
                likeCount={video.likeCount}
                usersOwn={video.uploadedBy === localStorage.userId}
                uploadedByName={video.uploadedByName}
              />
            );
          })}
          {videoPage > 1 && (
            <button onClick={() => setVideoPage(videoPage - 1)}>
              Previous Videos (Page {videoPage - 1})
            </button>
          )}
          {!videoLimitReached && (
            <button onClick={() => setVideoPage(videoPage + 1)}>
              More Videos (Page {videoPage + 1})
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
