const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

// connecting to the database before each test
beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/auth/register", () => {
  const registerId = Date.now();

  it("should allow us to make a new user with valid inputs", async () => {
    const newUser = {
      username: `person${registerId}`,
      password: `password${registerId}`,
      email: `email${registerId}@gmail.com`,
    };
    const res = await request(app).post("/api/v1/auth/register").send(newUser);

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
    expect(res._body.msg).toBe(
      "Duplicate value entered for email field, please choose another value"
    );
  });

  it("should not allow us to make a new user with the same username as an existing user", async () => {
    const newUser = {
      username: `person${registerId}`,
      password: `password${registerId}`,
      email: `email${registerId + 1}@gmail.com`,
    };
    const res = await request(app).post("/api/v1/auth/register").send(newUser);

    expect(res.statusCode).toBe(400);
    expect(res._body.msg).toBe(
      "Duplicate value entered for username field, please choose another value"
    );
  });
});

describe("POST /api/v1/auth/login", () => {
  const registerId = Date.now();

  it("should allow us to login an existing user with correct details", async () => {
    const newUser = {
      username: `person${registerId}`,
      password: `password${registerId}`,
      email: `email${registerId}@gmail.com`,
    };
    await request(app).post("/api/v1/auth/register").send(newUser);
    const currentUser = {
      username: `person${registerId}`,
      password: `password${registerId}`,
    };
    const res = await request(app).post("/api/v1/auth/login").send(currentUser);

    expect(res.statusCode).toBe(200);
    expect(res._body.user.name).toBe(`person${registerId}`);
  });

  it("should not allow us to login an existing user with an incorrect username", async () => {
    const currentUser = {
      username: `person${registerId + 1}`,
      password: `password${registerId}`,
    };
    const res = await request(app).post("/api/v1/auth/login").send(currentUser);

    expect(res.statusCode).toBe(401);
    expect(res._body.msg).toBe("Invalid Credentials");
  });
  
  it("should not allow us to login an existing user with an incorrect password", async () => {
    const currentUser = {
      username: `person${registerId}`,
      password: `password${registerId + 1}`,
    };
    const res = await request(app).post("/api/v1/auth/login").send(currentUser);

    expect(res.statusCode).toBe(401);
    expect(res._body.msg).toBe("Invalid Credentials");
  });
});
