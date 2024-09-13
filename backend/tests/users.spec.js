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
let token, userId, secondUserId, res, res1;
const badToken = "badTokenStringValue";

beforeAll(async () => {
  res = await request(app).post("/api/v1/auth/register").send(newUser);
  res1 = await request(app).post("/api/v1/auth/register").send(newUserTwo);
  token = res.body.token;
  userId = res.body.user.userId;
  secondUserId = res1.body.user.userId;
});

afterAll(async () => {
  await request(app).delete(`/api/v1/auth/delete/${userId}`).send({});
  await request(app).delete(`/api/v1/auth/delete/${secondUserId}`).send({});
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
});
