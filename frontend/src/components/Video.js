import { useNavigate } from "react-router-dom";

const Video = ({ url, majorTopics, minorTopics }) => {
  const navigate = useNavigate()
  return (
    <>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${url}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      {majorTopics.map((major) => {        
        return (
          <div key={major}>
            <button onClick={() => navigate(`/topic/${major.toLowerCase().split(" ").join("-")}`)}>{major}</button>
          </div>
        );
      })}
      {minorTopics.map((minor, index) => (
        <div key={index}>
          <h5 key={minor}>{typeof minor !== "string" && minor.join(" → ")}</h5>
        </div>
      ))}
    </>
  );
};

export default Video;
