const request = require("supertest");
const app = require("../app");

require("dotenv").config();

const registerId = Date.now();
const newUser = {
  username: `person${registerId}`,
  password: `password${registerId}`,
  email: `email${registerId}@gmail.com`,
};
const newUser1 = {
  username: `person1${registerId}`,
  password: `password1${registerId}`,
  email: `email1${registerId}@gmail.com`,
};
let token, token1, userId, userId1, videoId;
const badVideoId = "22ea8048344ad812a4de3c99";
const dummyVideoUrl = "dQw4w9WgXcQ?si=u_2xEGULAg4a8k--";
const videoMajor = ["someMajor"];

beforeAll(async () => {
  const res = await request(app).post("/api/v1/auth/register").send(newUser);
  const res1 = await request(app).post("/api/v1/auth/register").send(newUser1);
  token = res.body.token;
  userId = res.body.user.userId;
  token1 = res1.body.token;
  userId1 = res1.body.user.userId;
});

afterAll(async () => {
  await request(app).delete(`/api/v1/auth/delete/${userId}`).send({});
  await request(app).delete(`/api/v1/auth/delete/${userId1}`).send({});
});

describe("/api/v1/videos", () => {
  // authorisation error
  it("Should give an unauthorised 401 error if API authorisation failed", async () => {
    const res = await request(app)
      .post("/api/v1/videos")
      .send({ url: dummyVideoUrl });
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Authentication failed");
  });

  // uploadVideo
  it("Should allow a user to upload a valid video", async () => {
    const likeRes = await request(app)
      .patch(`/api/v1/users/like/${videoId}`)
      .set({ authorisation: `Bearer ${token}` });

    const res = await request(app)
      .post("/api/v1/videos")
      .send({
        url: dummyVideoUrl,
        majorTopics: videoMajor,
        minorTopics: ["someMinorOne", "someMinorTwo"],
        uploadedByName: newUser.username,
      })
      .set({ authorisation: `Bearer ${token}` });

    videoId = res.body.video._id;

    expect(res.status).toBe(201);
    expect(res.body.video.url).toBe(dummyVideoUrl);
    expect(res.body.video.uploadedBy).toBe(userId);
    expect(res.body.video.uploadedByName).toBe(newUser.username);
  });

  it("Should raise an error if a duplicate video is uploaded", async () => {
    const body = {
      url: dummyVideoUrl,
      majorTopics: videoMajor,
      minorTopics: ["someMinorOne", "someMinorTwo"],
      uploadedByName: newUser.username,
    };
    const res = await request(app)
      .post("/api/v1/videos")
      .send(body)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(400);
    expect(res.text).toBe("Duplicate, video already uploaded");
  });

  // getVideo
  it("Should get a video given a valid videoId", async () => {
    const res = await request(app)
      .get(`/api/v1/videos`)
      .send({ videoId: videoId })
      .set({ authorisation: `Bearer ${token}` });

    expect(res.status).toBe(200);
    expect(res.body.video._id).toBe(videoId);
  });

  it("Should return an error given an invalid videoId", async () => {
    const res = await request(app)
      .get(`/api/v1/videos`)
      .send({ videoId: badVideoId })
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(`No video with id: ${badVideoId} found`);
  });

  // getAllVideosByUser
  it("Should get all videos given a valid user", async () => {
    const res = await request(app)
      .get(`/api/v1/videos/${userId}`)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(200);
    expect(res.body.videos.length).toBe(1);
    expect(res.body.count).toBe(1);
    expect(res.body.videos[0].url).toBe(dummyVideoUrl);
    expect(res.body.videos[0].uploadedBy).toBe(userId);
  });

  // getAllVideosByLike
  it("Should get all videos liked by a user", async () => {
    await request(app)
      .patch(`/api/v1/users/like/${videoId}`)
      .set({ authorisation: `Bearer ${token1}` });

    const res = await request(app)
      .get("/api/v1/videos/likes")
      .set({ authorisation: `Bearer ${token1}` });
    expect(res.body.videos.length).toBe(1);
    expect(res.body.videos[0]._id).toBe(videoId);
  });

  it("Should return 0 videos given an invalid user", async () => {
    const res = await request(app)
      .get(`/api/v1/videos/${"2" + userId.slice(1)}`)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(200);
    expect(res.body.videos.length).toBe(0);
    expect(res.body.count).toBe(0);
  });

  // getAllVideosByTopic
  it("Should get all videos given a valid topic", async () => {
    const res = await request(app)
      .get(`/api/v1/videos/topic/${videoMajor[0]}`)
      .set({ authorisation: `Bearer ${token}` });

    expect(res.body.videos.length).toBe(1);
    expect(res.body.videos[0]._id).toBe(videoId);
  });

  it("Should return an error given an invalid topic", async () => {
    const res = await request(app)
      .get(`/api/v1/videos/topic/badTopic`)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("No videos with topic badTopic found");
  });

  // getAllOtherVideos
  it("Should get all videos except those of user", async () => {
    const res1 = await request(app)
      .get(`/api/v1/videos/all-other`)
      .set({ authorisation: `Bearer ${token1}` });

    expect(res1.body.videos.length).toBe(1);
    expect(res1.body.videos[0]._id).toBe(videoId);
  });

  it("Should return an error given no videos", async () => {
    const res = await request(app)
      .get(`/api/v1/videos/all-other`)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("No videos found");
  });

  // getAllVideos
  it("Should get all", async () => {
    const res = await request(app)
      .get("/api/v1/videos/all")
      .set({ authorisation: `Bearer ${token1}` });
    expect(res.body.videos.length).toBe(1);    
    expect(res.body.videos[0]._id).toBe(videoId);
  });

  // deleteVideo
  it("Should delete a valid video", async () => {
    const res = await request(app)
      .delete("/api/v1/videos")
      .send({ videoId: videoId })
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(200);
    expect(res.body.videoId).toBe(videoId);
    expect(res.body.url).toBe(dummyVideoUrl);
  });

  it("Should return an error if an invalid video tries to be deleted", async () => {
    const res = await request(app)
      .delete("/api/v1/videos")
      .send({ videoId: `2${videoId.slice(1)}` })
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(`No video with id: 2${videoId.slice(1)} found`);
  });
});
