import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

import toggleFollowUser from "../userApi/toggleFollowUser";
import getUser from "../userApi/getUser";
import * as constants from "../constants";
import "../pagesStyles/ProfileStyle.css";
import { Video, VideoTile } from "../components";
import topics from "../assets/topics";

const Profile = () => {
  const { coeusUser, setCoeusUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadErrorMsg, setUploadErrorMsg] = useState("");
  const [profileVideos, setProfileVideos] = useState([]);
  const [profileLikedVideos, setProfileLikedVideos] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [uploadInput, setUploadInput] = useState("");
  const [uploadMajorTopics, setUploadMajorTopics] = useState([]);
  const [uploadMinorTopics, setUploadMinorTopics] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null);
  const thisProfile = window.location.href.split("profile/")[1];
  const usersProfile = thisProfile === coeusUser?.userId;

  const MAJOR_TOPIC_LIMIT = 2;
  const MINOR_TOPIC_LIMIT = 3;

  useEffect(() => {
    try {
      const url = new URL(`${constants.usedUrl}/api/v1/users/${thisProfile}`);
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
          const profileVideoUrl = new URL(
            `${constants.usedUrl}/api/v1/videos/${thisProfile}`
          );

          fetch(profileVideoUrl, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorisation: `Bearer ${localStorage.userToken}`,
            },
          })
            .then((response) => {
              if (response.status === 400) {
                setErrorMsg("Profile videos don't exist");
              }
              if (response.status === 200) {
                setErrorMsg("");
              }
              return response.json();
            })
            .then((data) => {
              setProfileVideos(data.videos);
              // if users profile, get their liked videos
              if (usersProfile) {
                const videoLikesUrl = new URL(
                  `${constants.usedUrl}/api/v1/videos/likes`
                );
                fetch(videoLikesUrl, {
                  method: "GET",
                  headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    authorisation: `Bearer ${localStorage.userToken}`,
                  },
                })
                  .then((response) => {
                    if (response.status === 400) {
                      setErrorMsg("Liked Videos don't exist");
                    }
                    if (response.status === 200) {
                      setErrorMsg("");
                    }
                    return response.json();
                  })
                  .then((data) => {
                    setProfileLikedVideos(data.videos);
                  });
              }
            });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [thisProfile, usersProfile, coeusUser]);

  const deleteProfile = async () => {
    try {
      const url = new URL(
        `${constants.usedUrl}/api/v1/auth/delete/${coeusUser.userId}`
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
            localStorage.removeItem("userId");
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
      const url = new URL(`${constants.usedUrl}/api/v1/videos/`);
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          url: uploadInput,
          majorTopics: uploadMajorTopics,
          minorTopics: uploadMinorTopics,
        }),
      })
        .then(() => {
          setUploadInput("");
          setUploadMajorTopics([]);
          setUploadMinorTopics([]);
          getUser(setCoeusUser);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

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
                  profileInfo.userId,
                  "unfollow",
                  setCoeusUser
                );
                if (result instanceof Error) {
                  setErrorMsg("User doesn't exist!");
                }
              }}
            >
              Unfollow User
            </button>
          ) : (
            <button
              onClick={async () => {
                const result = await toggleFollowUser(
                  profileInfo.userId,
                  "follow",
                  setCoeusUser
                );
                if (result instanceof Error) {
                  setErrorMsg("User doesn't exist!");
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
            {textInput && (
              <button
                onClick={() => {
                  setUploadInput(textInput);
                  setTextInput("");
                  setUploadMajorTopics([]);
                  setUploadMinorTopics([]);
                }}
              >
                Find Video
              </button>
            )}
            <br />
            {uploadInput && (
              <>
                <Video
                  url={uploadInput}
                  majorTopics={[]}
                  minorTopics={[]}
                ></Video>
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
        {profileVideos.length > 0 && (
          <>
            {usersProfile ? (
              <h2>Your Videos</h2>
            ) : (
              <h2>{profileInfo.username}'s videos</h2>
            )}

            {profileVideos.map((video, id) => {
              return (
                <div key={id}>
                  <VideoTile
                    url={video.url}
                    videoId={video._id}
                    majorTopics={video.majorTopics}
                    minorTopics={video.minorTopics}
                    usersOwn={usersProfile}
                  ></VideoTile>
                  {usersProfile && (
                    <button onClick={() => deleteVideo(video._id)}>
                      Delete Video
                    </button>
                  )}
                </div>
              );
            })}
          </>
        )}
        {usersProfile && (
          <>
            <h2>
              {profileLikedVideos.length
                ? "Your liked videos"
                : "Your liked videos will appear here"}
            </h2>
            {profileLikedVideos.map((video, id) => {
              return (
                <div key={id}>
                  <VideoTile
                    url={video.url}
                    videoId={video._id}
                    majorTopics={video.majorTopics}
                    minorTopics={video.minorTopics}
                    usersOwn={false}
                  ></VideoTile>
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
