const request = require("supertest");
const app = require("../app");

require("dotenv").config();

describe("/api/v1/auth", () => {
  const registerId = Date.now();
  let userId;

  // createUser
  it("should allow us to make a new user with valid inputs", async () => {
    const newUser = {
      username: `person${registerId}`,
      password: `password${registerId}`,
      email: `email${registerId}@gmail.com`,
    };
    const res = await request(app).post("/api/v1/auth/register").send(newUser);
    userId = res.body.user.userId;

    expect(res.statusCode).toBe(201);
  });

  it("should not allow us to make a new user with the same email as an existing user", async () => {
    const newUser = {
      username: `person${registerId + 1}`,
      password: `password${registerId}`,
      email: `email${registerId}@gmail.com`,
    };
    const res = await request(app).post("/api/v1/auth/register").send(newUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe(
      "Duplicate value entered for email field, please choose another value"
    );
  });

  it("should not allow us to make a new user with a missing username, email, or password", async () => {
    const newUser = {
      username: ``,
      password: `password${registerId}`,
      email: `email${registerId}@gmail.com`,
    };
    const res = await request(app).post("/api/v1/auth/register").send(newUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Please provide a valid username");

    const newUser1 = {
      username: `person${registerId}`,
      password: "",
      email: `email${registerId}@gmail.com`,
    };
    const res1 = await request(app)
      .post("/api/v1/auth/register")
      .send(newUser1);

    expect(res1.statusCode).toBe(400);
    expect(res1.body.msg).toBe("Please provide a valid password");

    const newUser2 = {
      username: `person${registerId}`,
      password: `password${registerId}`,
      email: "",
    };
    const res2 = await request(app)
      .post("/api/v1/auth/register")
      .send(newUser2);

    expect(res2.statusCode).toBe(400);
    expect(res2.body.msg).toBe("Please provide a valid email");
  });

  it("should not allow us to make a new user with the same username as an existing user", async () => {
    const newUser = {
      username: `person${registerId}`,
      password: `password${registerId}`,
      email: `email${registerId + 1}@gmail.com`,
    };
    const res = await request(app).post("/api/v1/auth/register").send(newUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe(
      "Duplicate value entered for username field, please choose another value"
    );
  });

  // loginUser
  it("should allow us to login an existing user with correct details", async () => {
    const currentUser = {
      username: `person${registerId}`,
      password: `password${registerId}`,
    };
    const res = await request(app).post("/api/v1/auth/login").send(currentUser);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe(`person${registerId}`);
  });

  it("should not allow us to login an existing user with an incorrect username", async () => {
    const currentUser = {
      username: `person${registerId + 1}`,
      password: `password${registerId}`,
    };
    const res = await request(app).post("/api/v1/auth/login").send(currentUser);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Credentials");
  });

  it("should not allow us to login an existing user with an incorrect password", async () => {
    const currentUser = {
      username: `person${registerId}`,
      password: `password${registerId + 1}`,
    };
    const res = await request(app).post("/api/v1/auth/login").send(currentUser);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Credentials");
  });

  // deleteUser
  it("should allow us to delete an existing user with correct details", async () => {
    const res = await request(app)
      .delete(`/api/v1/auth/delete/${userId}`)
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe(`person${registerId}`);
  });

  it("should not allow us to delete an existing user with incorrect details", async () => {
    const res = await request(app)
      .delete(`/api/v1/auth/delete/${"2" + userId.slice(1)}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe(
      `No user with id: ${"2" + userId.slice(1)} found`
    );
  });
});
