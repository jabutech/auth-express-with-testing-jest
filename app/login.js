// Jika error bisa cek dengan code ini
//   expect(response).toThrow(TypeError);

// Use supertest
const request = require("supertest");
// Use server express
const server = require("../app");
// Use mongodb
const mongoose = require("mongoose");

// Before test
beforeEach((done) => {
  // (1) Connect mongodb
  mongoose.connect(
    "mongodb://root:123456@127.0.0.1:27017/auth-test2?authSource=admin",
    () => done()
  );

  // (2)  Register user
  // variable
  const payload = {
    full_name: "Dwi Aprilia",
    username: "dwi",
    password: "123456",
    role: "admin",
  };
  // Register process
  request(server).post("/auth/register").send(payload);
});

// Test 1
test("When username and password is empty", async () => {
  // (1) Declaration login route
  const response = await request(server).post("auth/login");
  // (2) Expectation
  // (1) thrown error response must be `422 Unprocessable Entity`
  expect(response.statusCode).toBe(422);
  //   (2) Thrown error response.message must be `email atau password salah.`
  expect(response.message).toBe("email atau password salah.");
});

// Test 2
test("When username incorect", async () => {
  // Var payload
  const payload = {
    username: "dwiiii",
    password: "123456",
  };
  // (1) Delcaration login route
  const response = await request(server).post("auth/login").send(payload);

  // (2) Expectation
  // (1) thrown error response must be `422 Unprocessable Entity`
  expect(response.statusCode).toBe(422);
  //   (2) Thrown error response.message must be `email atau password salah.`
  expect(response.message).toBe("email atau password salah.");
});

// Test 3
test("When password incorect", async () => {
  // Var payload
  const payload = {
    username: "dwi",
    password: "123456789",
  };
  // (1) Delcaration login route
  const response = await request(server).post("auth/login").send(payload);

  // (2) Expectation
  // (1) thrown error response must be `422 Unprocessable Entity`
  expect(response.statusCode).toBe(422);
  //   (2) Thrown error response.message must be `email atau password salah.`
  expect(response.message).toBe("email atau password salah.");
});

// Test 4
test("When login successfully", async () => {
  // Var payload
  const payload = {
    username: "dwi",
    password: "123456",
  };
  // (1) Delcaration login route
  const response = await request(server).post("auth/login").send(payload);

  //   Expect content
  const data = {
    username: "dwi",
    full_name: "Dwi Aprilia",
    role: "admin",
  };

  // (2) Expectation
  // (1) thrown error response must be `200 Success`
  expect(response.statusCode).toBe(200);
  //   (3) response type must be json
  expect(response.type).toBe("application/json");
  //   (4) response message 'logged in successfully'
  expect(response.body.data).toBe("logged in successfully");
  //   (5) response body must be variable data
  expect(response.body.data).toBe(data);
  // (6) to have property token
  expect(response.body.data).toHaveProperty("token");
  // (6) Property token greather than length 0 (is not empty)
  expect(response.body.data.token).toBeGreatherThan(0);
});
