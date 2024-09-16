import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import toggleFollowUser from "../userApi/toggleFollowUser";

import "../pagesStyles/ProfileStyle.css";

import { Video } from "../components";
import topics from "../assets/topics";

const Profile = ({ setCoeusUser }) => {
  const coeusUser = useContext(UserContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadErrorMsg, setUploadErrorMsg] = useState("");
  const [videos, setVideos] = useState([]);
  const [textInput, setTextInput] = useState("")
  const [uploadInput, setUploadInput] = useState("");
  const [uploadMajorTopics, setUploadMajorTopics] = useState([]);
  const [uploadMinorTopics, setUploadMinorTopics] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null);
  const [uploadRefresh, setUploadRefresh] = useState(0)
  const thisProfile = window.location.href.split("profile/")[1];

  const MAJOR_TOPIC_LIMIT = 2;
  const MINOR_TOPIC_LIMIT = 3;  

  useEffect(() => {
    try {
      const url = new URL(`http://localhost:1234/api/v1/users/${thisProfile}`);
      fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.userToken}`,
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            setErrorMsg("User profile does not exist");
            throw new Error("no user found");
          }
          return response.json();
        })
        .then((data) => {
          setProfileInfo(data);
          const videoUrl = new URL(
            `http://localhost:1234/api/v1/videos/${thisProfile}`
          );

          fetch(videoUrl, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorisation: `Bearer ${localStorage.userToken}`,
            },
          })
            .then((response) => {
              if (response.status === 400) {
                setErrorMsg("Videos don't exist");
              }
              if (response.status === 200) {
                setErrorMsg("");
              }
              return response.json();
            })
            .then((data) => {
              setVideos(data.videos);
            });
        })
        .catch((err) => err);
    } catch (error) {
      console.log(error);
    }
  }, [thisProfile, uploadRefresh]);

  const deleteProfile = async () => {
    try {
      const url = new URL(
        `http://localhost:1234/api/v1/auth/delete/${coeusUser.userId}`
      );
      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.username) {
            setCoeusUser({});
            localStorage.removeItem("userToken");
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMajorTopic = (topic) => {
    if (uploadMajorTopics.includes(topic)) {
      let newMinors = uploadMinorTopics;
      topics[topic].forEach((minor) => {
        if (newMinors.includes(minor)) {
          newMinors = newMinors.filter((element) => element !== minor);
        }
      });
      setUploadMinorTopics(newMinors);
      setUploadMajorTopics(
        uploadMajorTopics.filter((element) => element !== topic)
      );
    } else {
      setUploadMajorTopics([...uploadMajorTopics, topic]);
    }
  };

  const toggleMinorTopic = (topic) => {
    if (uploadMinorTopics.includes(topic)) {
      setUploadMinorTopics(
        uploadMinorTopics.filter((element) => element !== topic)
      );
    } else {
      setUploadMinorTopics([...uploadMinorTopics, topic]);
    }
  };

  const upload = async () => {
    try {
      const url = new URL("http://localhost:1234/api/v1/videos/");
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          url: uploadInput,
          majorTopics: uploadMajorTopics,
          minorTopics: uploadMinorTopics
        }),
      })
        .then((response) => response.json())
        .then(() => {
          setUploadRefresh(uploadRefresh + 1)
          setUploadInput("")
          setUploadMajorTopics([])
          setUploadMinorTopics([])
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      const url = new URL("http://localhost:1234/api/v1/videos/");
      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          videoId
        }),
      })
        .then((response) => response.json())
        .then(() => {
          setUploadRefresh(uploadRefresh + 1)
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }

  const usersProfile = thisProfile === coeusUser?.userId;

  if (errorMsg) return <h2>{errorMsg}</h2>;

  return coeusUser && profileInfo ? (
    <>
      <div>
        <h1>{profileInfo.username}'s profile</h1>
        {!usersProfile &&
          (coeusUser.follows.includes(profileInfo.userId) ? (
            <button
              onClick={async () => {
                const result = await toggleFollowUser(
                  coeusUser,
                  profileInfo.userId,
                  "unfollow"
                );
                if (!(result instanceof Error)) {
                  console.log(result);
                  setCoeusUser(result);
                } else {
                  setErrorMsg("Can't find User!");
                }
              }}
            >
              Unfollow User
            </button>
          ) : (
            <button
              onClick={async () => {
                const result = await toggleFollowUser(
                  coeusUser,
                  profileInfo.userId,
                  "follow"
                );
                if (!(result instanceof Error)) {
                  console.log(result);
                  setCoeusUser(result);
                } else {
                  setErrorMsg("Can't find User!");
                }
              }}
            >
              Follow User
            </button>
          ))}
        <br />
        {usersProfile && (
          <>
            <h3>Upload your videos below</h3>
            <p>
              Enter the youtube embed code below e.g.
              qYSc5LuNwPg?si=wZkSVn_oyGP2HXb9
            </p>
            <input
              id="embedInput"
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
              }}
            />
            {textInput && <button onClick={() => {
              setUploadInput(textInput)
              setTextInput("")
              setUploadMajorTopics([])
              setUploadMinorTopics([])
            }}>Find Video</button>}
            <br />
            {uploadInput && (
              <>
                <Video url={uploadInput} majorTopics={[]} minorTopics={[]}></Video>
                <br />
                <button
                  onClick={() => {
                    setUploadInput("");
                    setUploadMajorTopics([]);
                    setUploadMinorTopics([]);
                  }}
                >
                  Not the right video?
                </button>
                <p>Pick up to {MAJOR_TOPIC_LIMIT} major topics (min. 1)</p>
                <br />
                {Object.keys(topics).map((major) => {
                  const selectedTopic = uploadMajorTopics.includes(major);
                  return (
                    <button
                      onClick={() => toggleMajorTopic(major)}
                      key={major}
                      disabled={
                        uploadMajorTopics.length === MAJOR_TOPIC_LIMIT &&
                        !selectedTopic
                      }
                      className={selectedTopic ? "selectedTopic" : ""}
                    >
                      {major}
                    </button>
                  );
                })}
                <br />
                {uploadMajorTopics.length > 0 && (
                  <p>Pick up to {MINOR_TOPIC_LIMIT} minor topics (min. 1)</p>
                )}
                {uploadMajorTopics.map((major) => {
                  return (
                    <div key={major}>
                      <h2>{major}</h2>
                      {topics[major].map((minor) => {
                        const selectedTopic = uploadMinorTopics.includes(minor);
                        return (
                          <button
                            key={minor}
                            disabled={
                              uploadMinorTopics.length === MINOR_TOPIC_LIMIT &&
                              !selectedTopic
                            }
                            onClick={() => toggleMinorTopic(minor)}
                            className={selectedTopic ? "selectedTopic" : ""}
                          >
                            {minor}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
                <br />
                {uploadErrorMsg && <h3>{uploadErrorMsg}</h3>}
                <button
                  onClick={() => {
                    if (uploadMajorTopics.length === 0) {
                      setUploadErrorMsg(
                        "At least one major topic must be selected before upload"
                      );
                    } else {
                      if (uploadMinorTopics.length === 0) {
                        setUploadErrorMsg(
                          "At least one minor topic must be selected before upload"
                        );
                      } else {
                        upload();
                      }
                    }
                  }}
                >
                  Upload your video
                </button>
              </>
            )}
            <br />
            <br />
            <button onClick={() => deleteProfile()}>Delete your profile</button>
          </>
        )}
        {videos.length > 0 && (
          <>
            {usersProfile ? (
              <h2>Your Videos</h2>
            ) : (
              <h2>{profileInfo.username}'s videos</h2>
            )}
            {videos.map((video, id) => {
              return (
                <div key={id}>
                  <Video url={video.url} majorTopics={video.majorTopics} minorTopics={video.minorTopics}></Video>
                  {usersProfile && <button onClick={() => deleteVideo(video._id)}>Delete Video</button>}
                </div>
              );
            })}
          </>
        )}
        <button onClick={() => navigate("/")}>Back to home</button>
      </div>
    </>
  ) : (
    <h2>Loading...</h2>
  );
};

export default Profile;
