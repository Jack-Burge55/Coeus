const Video = ({ url, majorTopics, minorTopics }) => {
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
      <h3>{majorTopics.join(", ")}</h3>
      {minorTopics.map((minor) => (
        <div>
          <h5 key={minor}>{typeof minor !== "string" && minor.join(" → ")}</h5>
        </div>
      ))}
    </>
  );
};

export default Video;
