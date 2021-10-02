// Jika error bisa cek dengan code ini
//   expect(response).toThrow(TypeError);
// Use supertest
const request = require("supertest");
// Use server express
const server = require("../app");
// use mongodb
const mongoose = require("mongoose");

// Before test
beforeEach((done) => {
  // Connect mongodb
  mongoose.connect(
    "mongodb://root:123456@127.0.0.1:27017/auth-test2?authSource=admin",
    () => done()
  );
});

// Test Register
test("Ketika username yang dikirim form kosong", async () => {
  // (1) Declaration route process
  const response = await request(server).post("/auth/register");

  const res = response.body.field;

  //  (2) Expectation return
  // (1) thrown error response must be `422 Unprocessable Entity`
  expect(response.statusCode).toBe(422);
  //   (1) Thrown error body.field.full_name.message must be `Fullname harus diisi.`
  expect(res.full_name.message).toBe("Fullname harus diisi.");
  //   (2) Thrown error body.field.username.message must be `Username harus diisi.`
  expect(res.username.message).toBe("Username harus diisi.");
  // (3) Thrown error body.field.password.message must be `Password harus diisi.`
  expect(res.password.message).toBe("Password harus diisi.");
});

test("username minimal 3 katakter dan password minimal 3 katakter", async () => {
  // (1) Declaration route process
  const response = await request(server).post("/auth/register").send({
    username: "ad",
    password: "12",
  });

  //   (2) Expetation return
  // (1) thrown error response must be `422 Unprocessable Entity`
  expect(response.statusCode).toBe(422);
  // (2) Thrown error response must be "Username minimal 3 karakter.."
  expect(response.body.field.username.message).toBe(
    "Username minimal 3 karakter."
  );

  // (2) Thrown error response must be "Password minimal 3 karakter."
  expect(response.body.field.password.message).toBe(
    "Password minimal 3 karakter."
  );
});

test("Proses register berhasil dengan role data 'admin'", async () => {
  // variable
  const payload = {
    full_name: "Dwi Aprilia",
    username: "dwi",
    password: "123456",
    role: "admin",
  };
  // (1) Declaration route process
  const response = await request(server).post("/auth/register").send(payload);

  // Declaration response
  const res = response.body.data;

  //   (2) Expetation return
  //   (1) Status response must be success (200)
  expect(response.statusCode).toBe(200);
  //   (2) res.fullname must be "Dwi Aprilia"
  expect(res.full_name).toBe(payload.full_name);
  //   (3) res.username must be "dwi"
  expect(res.username).toBe(payload.username);
  //   (4) res.password must be "password"
  //   expect(res.password).toBe("password");
  //  (5) Password must be hash with bcrypt
  //   (6) res.role must be "admin"
  expect(res.role).toBe(payload.role);
});

test("Proses register berhasil expect property role not fill", async () => {
  // variable
  const payload = {
    full_name: "Rizky Darmawan",
    username: "letenk",
    password: "password",
  };
  // (1) Declaration route process
  const response = await request(server).post("/auth/register").send(payload);
  // Variable
  const res = response.body.data;
  //   (2) Expetation return
  //   (1) Status response must be success (200)
  expect(response.statusCode).toBe(200);
  //   (2) res.fullname must be "Rizky Darmawan"
  expect(res.full_name).toBe("Rizky Darmawan");
  //   (3) res.username must be "letenk"
  expect(res.username).toBe("letenk");
  //   (4) res.password must be "password"
  //   expect(res.password).toBe("password");
  //   (5) res.role must be "user" when role id not fill
  expect(res.role).toBe("user");
});

test("Username sudah terdaftar", async () => {
  // variable
  const payload = {
    full_name: "Rizky Darmawan",
    username: "letenk",
    password: "password",
  };
  // (1) Declaration route process
  const response = await request(server).post("/auth/register").send(payload);

  // (2) Expetation return
  // (1) thrown error response must be `422 Unprocessable Entity`
  expect(response.statusCode).toBe(422);
  // (2) Thrown error response must be `Username sudah ada.`
  expect(response.body.field.username.message).toBe("letenk sudah ada!");
});

test("drop database", () => {
  //   Drop database
  mongoose.connection.db.dropDatabase(() => {
    // Close connection
    mongoose.connection.close();
  });
  expect("ok");
});
