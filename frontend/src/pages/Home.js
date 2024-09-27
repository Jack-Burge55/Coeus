import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import * as constants from "../constants";
import { VideoTile } from "../components";

const Home = () => {
  const navigate = useNavigate();
  const { coeusUser, setCoeusUser } = useContext(UserContext);
  const [recentVideos, setRecentVideos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [videoPage, setVideoPage] = useState(1);

  useEffect(() => {
    try {
      const url = new URL(
        `${constants.usedUrl}/api/v1/videos/all?limit=4&page=${videoPage}`
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
          setRecentVideos(data.videos);
        });
    } catch (error) {}
  }, [videoPage]);

  const findUsers = () => {
    navigate(`/find-users`);
  };

  const signOut = () => {
    setCoeusUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const goToProfile = () => {
    navigate(`/profile/${coeusUser.userId}`);
  };

  if (!coeusUser) return <h2>Loading</h2>;

  return (
    <div>
      <h1>Home</h1>
      {errorMsg && <h2>{errorMsg}</h2>}
      <button onClick={() => findUsers()}>Find Users</button>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={() => goToProfile()}>Go To Your Profile</button>
      {recentVideos.length > 0 && coeusUser && (
        <div>
          <h2>Recent videos you might like</h2>
          {recentVideos.map(vid => {
            return <VideoTile key={vid._id} url={vid.url} videoId={vid._id} majorTopics={vid.majorTopics} minorTopics={vid.minorTopics} usersOwn={vid.uploadedBy === localStorage.userId} />
          })}
          {videoPage > 1 && (
            <button onClick={() => setVideoPage(videoPage - 1)}>
              Previous Videos (Page {videoPage - 1})
            </button>
          )}
          {
            <button onClick={() => setVideoPage(videoPage + 1)}>
              More Videos (Page {videoPage + 1})
            </button>
          }
        </div>
      )}
    </div>
  );
};

export default Home;
