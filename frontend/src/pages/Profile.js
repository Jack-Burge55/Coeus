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
  const [profileVideos, setProfileVideos] = useState([]);
  const [profileLikedVideos, setProfileLikedVideos] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [uploadInput, setUploadInput] = useState("");
  const [uploadMajorTopics, setUploadMajorTopics] = useState([]);
  const [uploadMinorTopics, setUploadMinorTopics] = useState([]);
  const [minorMoreTopics, setMinorMoreTopics] = useState([]);
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

  // call delete profile API
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
      setUploadMajorTopics(
        uploadMajorTopics.filter((element) => element !== topic)
      );
      // remove all minor topics if major topic removed
      setUploadMinorTopics(
        uploadMinorTopics.filter((element) => element[0] !== topic)
      );
      // close all subs if major topic removed
      setMinorMoreTopics(
        minorMoreTopics.filter((element) => element[0] !== topic)
      );
    } else {
      setUploadMajorTopics([...uploadMajorTopics, topic]);
    }
  };

  // toggle selected minor topics
  const toggleMinorTopic = (topic) => {
    if (arrayListContains(uploadMinorTopics, topic)) {
      setUploadMinorTopics(
        uploadMinorTopics.filter(
          (element) => JSON.stringify(element) !== JSON.stringify(topic)
        )
      );
    } else {
      setUploadMinorTopics([...uploadMinorTopics, topic]);
    }
  };

  // function to toggle state for expanded topics
  const toggleMinorMore = (topic) => {
    if (arrayListContains(minorMoreTopics, topic)) {
      setMinorMoreTopics(
        minorMoreTopics.filter(
          (element) => !element.join("").startsWith(topic.join(""))
        )
      );
      setUploadMinorTopics(
        uploadMinorTopics.filter(
          (element) => !element.join("").startsWith(topic.join(""))
        )
      );
    } else {
      setMinorMoreTopics([...minorMoreTopics, topic]);
    }
  };

  // helper function to see if minorMore array contains a ceratin minorMore (all arrays)
  const arrayListContains = (list, element) => {
    return (
      list.filter((listElement) => {
        return JSON.stringify(element) === JSON.stringify(listElement);
      }).length > 0
    );
  };

  // recursive function to continually expand sub categories
  const recursiveExpansion = (obj, currentMinor) => {
    const { name, subs } = obj;
    const isMinorSelected = arrayListContains(uploadMinorTopics, [
      ...currentMinor,
      name,
    ]);
    const isMinorMoreSelected = arrayListContains(minorMoreTopics, [
      ...currentMinor,
      name,
    ]);

    return (
      <div key={name}>
        <button
          onClick={() => toggleMinorTopic([...currentMinor, name])}
          key={name}
          className={isMinorSelected ? "selectedMinor" : undefined}
          disabled={
            uploadMinorTopics.length === MINOR_TOPIC_LIMIT && !isMinorSelected
          }
        >
          {name}
        </button>
        <button
          onClick={() => toggleMinorMore([...currentMinor, name])}
          key={name + "more"}
          className={isMinorMoreSelected ? "expandedMore" : undefined}
        >
          {name + " more"}
        </button>
        {isMinorMoreSelected &&
          subs.map((sub) => {
            const isSubSelected = arrayListContains(uploadMinorTopics, [
              ...currentMinor,
              name,
              sub,
            ]);
            if (typeof sub === "string") {
              return (
                <div key={sub}>
                  <button
                    onClick={() =>
                      toggleMinorTopic([...currentMinor, name, sub])
                    }
                    key={sub}
                    className={isSubSelected ? "selectedMinor" : undefined}
                    disabled={
                      uploadMinorTopics.length === MINOR_TOPIC_LIMIT &&
                      !isSubSelected
                    }
                  >
                    {sub}
                  </button>
                </div>
              );
            } else {
              return recursiveExpansion(sub, [...currentMinor, name]);
            }
          })}
      </div>
    );
  };

  // call upload API function
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
          setMinorMoreTopics([]);
          getUser(setCoeusUser);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

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
                {topics.map((major) => {
                  const { name: majorTopic, subs: minorTopics } = major;
                  const isMajorSelected =
                    uploadMajorTopics.includes(majorTopic);
                  return (
                    <div key={majorTopic}>
                      <button
                        onClick={() => toggleMajorTopic(majorTopic)}
                        className={
                          isMajorSelected ? "selectedMajor" : undefined
                        }
                        disabled={
                          uploadMajorTopics.length === MAJOR_TOPIC_LIMIT &&
                          !isMajorSelected
                        } //majorTopic button
                      >
                        {majorTopic}
                      </button>
                      {isMajorSelected &&
                        minorTopics.map((minTopic) => {
                          if (typeof minTopic === "string") {
                            const isMinorSelected = arrayListContains(
                              uploadMinorTopics,
                              [majorTopic, minTopic]
                            );
                            return (
                              <button
                                onClick={() =>
                                  toggleMinorTopic([majorTopic, minTopic])
                                }
                                key={minTopic}
                                className={
                                  isMinorSelected ? "selectedMinor" : undefined
                                }
                                disabled={
                                  uploadMinorTopics.length ===
                                    MINOR_TOPIC_LIMIT && !isMinorSelected
                                }
                              >
                                {minTopic}
                              </button> //minorTopic button
                            );
                          } else {
                            return recursiveExpansion(minTopic, [majorTopic]);
                          }
                        })}
                      <br />
                      <br />
                    </div>
                  );
                })}
                <h3>Major topics</h3>
                {uploadMajorTopics.map((major) => {
                  return <p key={major}>{major}</p>;
                })}
                <h3>Minor topics</h3>
                {uploadMinorTopics.map((minor) => {
                  return <p key={minor}>{minor.join(" → ")}</p>;
                })}
                <br />
                {uploadMajorTopics.length > 0 &&
                  uploadMinorTopics.length > 0 && (
                    <>
                      <button
                        onClick={() => {
                          upload();
                        }}
                      >
                        Upload your video
                      </button>
                    </>
                  )}
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
