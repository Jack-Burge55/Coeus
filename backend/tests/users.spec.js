const request = require("supertest");
const app = require("../app");

require("dotenv").config();

const registerId = Date.now();
const newUser = {
  username: `person${registerId}`,
  password: `password${registerId}`,
  email: `email${registerId}@gmail.com`,
};
const newUserTwo = {
  username: `personTwo${registerId}`,
  password: `passwordTwo${registerId}`,
  email: `emailTwo${registerId}@gmail.com`,
};
let token,
  secondToken,
  userId,
  secondUserId,
  videoId,
  videoLikeCount,
  videoLikedBy;
const badVideoId = "22ea8048344ad812a4de3c99";
const badToken = "badTokenStringValue";
const dummyVideoUrl = "dQw4w9WgXcQ?si=u_2xEGULAg4a8k--";

beforeAll(async () => {
  const res = await request(app).post("/api/v1/auth/register").send(newUser);
  const res1 = await request(app)
    .post("/api/v1/auth/register")
    .send(newUserTwo);
  token = res.body.token;
  secondToken = res1.body.token;
  userId = res.body.user.userId;
  secondUserId = res1.body.user.userId;

  const videoRes = await request(app)
    .post("/api/v1/videos")
    .send({
      url: dummyVideoUrl,
      majorTopics: ["someMajor"],
      minorTopics: ["someMinorOne", "someMinorTwo"],
      uploadedByName: newUser.username
    })
    .set({ authorisation: `Bearer ${secondToken}` });

  videoId = videoRes.body.video._id;
  videoLikeCount = videoRes.body.video.likeCount;
  videoLikedBy = videoRes.body.video.likedBy;
});

afterAll(async () => {
  await request(app).delete(`/api/v1/auth/delete/${userId}`).send({});
  await request(app).delete(`/api/v1/auth/delete/${secondUserId}`).send({});
  await request(app)
    .delete("/api/v1/videos")
    .send({ videoId: videoId })
    .set({ authorisation: `Bearer ${token}` });
});

describe("/api/v1/users", () => {
  // authorisation error
  it("Should give an unauthorised 401 error if API authorisation failed", async () => {
    const getAllRes = await request(app)
      .get("/api/v1/users")
      .set({ authorisation: `Bearer ${badToken}` });
    expect(getAllRes.status).toBe(401);
    expect(getAllRes.body.msg).toBe("Authentication failed");
  });

  // getAll
  it("Should be able to get all users", async () => {
    const getAllRes = await request(app)
      .get("/api/v1/users")
      .set({ authorisation: `Bearer ${token}` });
    const cleanedUsers = getAllRes.body.cleanedUsers;
    expect(
      cleanedUsers.filter((user) => user.username == `person${registerId}`)
        .length
    ).toBe(1);
    expect(
      cleanedUsers.filter((user) => user.username == `personTwo${registerId}`)
        .length
    ).toBe(1);
  });

  // get
  it("Should be able to get a specific user", async () => {
    const getRes = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set({ authorisation: `Bearer ${token}` });
    expect(getRes.body.username).toBe(`person${registerId}`);
  });

  it("Should give an unauthorised 401 error if API authorisation failed for get", async () => {
    const getRes = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set({ authorisation: `Bearer ${badToken}` });
    expect(getRes.status).toBe(401);
    expect(getRes.body.msg).toBe("Authentication failed");
  });

  it("Should give a 400 error if a non existent user is searched for get", async () => {
    const changedUserId = "2" + userId.slice(1);
    const getRes = await request(app)
      .get(`/api/v1/users/${changedUserId}`)
      .set({ authorisation: `Bearer ${token}` });
    expect(getRes.status).toBe(400);
    expect(getRes.body.msg).toBe(`No user with id: ${changedUserId} found`);
  });

  // followUser
  it("Should allow a user to follow another user", async () => {
    const res = await request(app)
      .patch(`/api/v1/users/follow/${secondUserId}`)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(200);
    expect(res.body.user.follows.length).toBe(1);
  });

  it("Should give a 400 error if a user tries to follow a non existent user", async () => {
    const res = await request(app)
      .patch(`/api/v1/users/follow/2${secondUserId.slice(1)}`)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(
      `No user with id: 2${secondUserId.slice(1)} found`
    );
  });

  it("Should allow a user to unfollow another user", async () => {
    const res = await request(app)
      .patch(`/api/v1/users/unfollow/${secondUserId}`)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(200);
    expect(res.body.user.follows.length).toBe(0);
  });

  it("Should give a 400 error if a user tries to follow a non existent user", async () => {
    const res = await request(app)
      .patch(`/api/v1/users/unfollow/2${secondUserId.slice(1)}`)
      .set({ authorisation: `Bearer ${token}` });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(
      `No user with id: 2${secondUserId.slice(1)} found`
    );
  });

  // likeVideo
  it("should be able to like a valid video which updates video likeCount", async () => {
    expect(videoLikeCount).toBe(0);
    expect(videoLikedBy.length).toBe(0);

    const likeRes = await request(app)
      .patch(`/api/v1/users/like/${videoId}`)
      .set({ authorisation: `Bearer ${token}` });

    const updatedVideo = await request(app)
      .get(`/api/v1/videos`)
      .send({ videoId: videoId })
      .set({ authorisation: `Bearer ${token}` });

    expect(likeRes.status).toBe(200);
    expect(likeRes.body.user.likedVideos[0]).toBe(videoId);

    expect(updatedVideo.body.video.likeCount).toBe(1);
    expect(updatedVideo.body.video.likedBy[0]).toBe(userId);
  });

  it("should not change a videos likeCount if the same user likes it twice", async () => {
    await request(app)
      .patch(`/api/v1/users/like/${videoId}`)
      .set({ authorisation: `Bearer ${token}` });

    const updatedVideo = await request(app)
      .get(`/api/v1/videos`)
      .send({ videoId: videoId })
      .set({ authorisation: `Bearer ${token}` });

    expect(updatedVideo.body.video.likeCount).toBe(1);
    expect(updatedVideo.body.video.likedBy[0]).toBe(userId);
  });

  it("should return an error if invalid video liked", async () => {
    const res = await request(app)
    .patch(`/api/v1/users/like/${badVideoId}`)
    .set({ authorisation: `Bearer ${token}` });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(
      `No video with id: ${badVideoId} found`
    );
  });

  it("should return an error if a user tries to like their own video", async () => {
    const res = await request(app)
    .patch(`/api/v1/users/like/${videoId}`)
    .set({ authorisation: `Bearer ${secondToken}` });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(
      "User cannot like their own videos"
    );
  });

    // unlikeVideo
    it("should be able to unlike a valid video which updates video likeCount", async () => {
      const unlikeRes = await request(app)
        .patch(`/api/v1/users/unlike/${videoId}`)
        .set({ authorisation: `Bearer ${token}` });
  
      const updatedVideo = await request(app)
        .get(`/api/v1/videos`)
        .send({ videoId: videoId })
        .set({ authorisation: `Bearer ${token}` });
  
      expect(unlikeRes.status).toBe(200);
      expect(unlikeRes.body.user.likedVideos.length).toBe(0);
  
      expect(updatedVideo.body.video.likeCount).toBe(0);
      expect(updatedVideo.body.video.likedBy.length).toBe(0);
    });
  
    it("should not change a videos likeCount if the same user unlikes it twice", async () => {
      await request(app)
        .patch(`/api/v1/users/unlike/${videoId}`)
        .set({ authorisation: `Bearer ${token}` });
  
      const updatedVideo = await request(app)
        .get(`/api/v1/videos`)
        .send({ videoId: videoId })
        .set({ authorisation: `Bearer ${token}` });
  
        expect(updatedVideo.body.video.likeCount).toBe(0);
        expect(updatedVideo.body.video.likedBy.length).toBe(0);
    });
  
    it("should return an error if invalid video unliked", async () => {
      const res = await request(app)
      .patch(`/api/v1/users/unlike/${badVideoId}`)
      .set({ authorisation: `Bearer ${token}` });
  
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe(
        `No video with id: ${badVideoId} found`
      );
    });
  
    it("should return an error if a user tries to unlike their own video", async () => {
      const res = await request(app)
      .patch(`/api/v1/users/unlike/${videoId}`)
      .set({ authorisation: `Bearer ${secondToken}` });
  
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe(
        "User cannot unlike their own videos"
      );
    });
});
