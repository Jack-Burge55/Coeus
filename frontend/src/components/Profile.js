import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ setCoeusUser, coeusUser }) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [videos, setVideos] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null)  
  const thisProfile = window.location.href.split("profile/")[1];

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
          if (response.status === 400) {
            setErrorMsg("User profile does not exist");
          }
          if (response.status === 200) {
            setErrorMsg("");
          }
          return response.json();
        })
        .then((data) => {
          setProfileInfo(data)
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
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [thisProfile]);

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

  const upload = async () => {
    const uploadInput = document.getElementById("embedInput");
    const uploadValue = uploadInput.value;
    const body = {
      url: uploadValue,
    };
    console.log(body);

    uploadInput.value = "";
    try {
      const url = new URL("http://localhost:1234/api/v1/videos/");
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorisation: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (coeusUser && profileInfo) ? (
    <>
      {!errorMsg ? (
        <div>
          <h1>{profileInfo.username}'s profile</h1>
          {videos.length > 0 &&
            videos.map((video, id) => {
              return (
                <iframe
                  key={id}
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.url}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              );
            })}
          <br />
          {thisProfile === coeusUser.userId && (
            <>
              <h3>Upload your videos below</h3>
              <p>
                Enter the youtube embed code below e.g.
                qYSc5LuNwPg?si=wZkSVn_oyGP2HXb9
              </p>
              <input id="embedInput" />
              <button onClick={() => upload()}>Upload your video</button>
              <br />
              <button onClick={() => deleteProfile()}>
                Delete your profile
              </button>
            </>
          )}
          <button onClick={() => navigate("/")}>Back to home</button>
        </div>
      ) : (
        <div>
          <h3>No user exists for what you're looking for :(</h3>
        </div>
      )}
    </>
  ) : (
    <h2>Loading...</h2>
  );
};

export default Profile;
