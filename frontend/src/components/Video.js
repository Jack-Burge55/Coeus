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
      {majorTopics.map(major => <h4 key={major}>{major}</h4>)}
      {minorTopics.map(minor => <h5 key={minor}>{minor}</h5>)}
    </>
  );
};

export default Video;
