const request = require("supertest");
const app = require("../app");

require("dotenv").config();

const registerId = Date.now();
const newUser = {
  username: `person${registerId}`,
  password: `password${registerId}`,
  email: `email${registerId}@gmail.com`,
};
let token, userId, res, videoId;
const badToken = "badTokenStringValue";
const dummyVideoUrl = "dQw4w9WgXcQ?si=u_2xEGULAg4a8k--";

beforeAll(async () => {
  res = await request(app).post("/api/v1/auth/register").send(newUser);
  token = res.body.token;
  userId = res.body.user.userId;
});

afterAll(async () => {
  await request(app).delete(`/api/v1/auth/delete/${userId}`).send({});
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
    const res = await request(app)
      .post("/api/v1/videos")
      .send({
        url: dummyVideoUrl,
        majorTopics: ["someMajor"],
        minorTopics: ["someMinorOne", "someMinorTwo"]
      })
      .set({ authorisation: `Bearer ${token}` });

    videoId = res.body.video._id;
    expect(res.status).toBe(201);
    expect(res.body.video.url).toBe(dummyVideoUrl);
    expect(res.body.video.uploadedBy).toBe(userId);
  });

  it("Should raise an error if a duplicate video is uploaded", async () => {
    const body = {
      url: dummyVideoUrl,
      majorTopics: ["someMajor"],
      minorTopics: ["someMinorOne", "someMinorTwo"]
    };
    const res = await request(app)
      .post("/api/v1/videos")
      .send(body)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(400);
    expect(res.text).toBe("Duplicate, video already uploaded");
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

  it("Should return 0 videos given an invalid user", async () => {
    const res = await request(app)
      .get(`/api/v1/videos/${"2" + userId.slice(1)}`)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(200);
    expect(res.body.videos.length).toBe(0);
    expect(res.body.count).toBe(0);
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

  it("Should return an error if an invalid video is tried to be deleted", async () => {
    const res = await request(app)
      .delete("/api/v1/videos")
      .send({ videoId: `2${videoId.slice(1)}` })
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(`No video with id: 2${videoId.slice(1)} found`);
  });
});
