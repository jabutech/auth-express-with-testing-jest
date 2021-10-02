// Use mongoose
const mongoose = require("mongoose");
// Use bcrypt for hashing password
const bcrypt = require("bcrypt");
// 'mongoose-sequence' untuk membuat autoincrement / nomer urut
const AutoIncrement = require("mongoose-sequence")(mongoose);
// Use property `model` dan `Schema` from mongoose
const { model, Schema } = mongoose;

// Init const HAS_ROUND with default value = 10
const HAS_ROUND = 10;

// Create Schema for user
let userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "Fullname harus diisi."],
      maxLength: [255, "Panjang Fullname maksimal 255 karakter"],
    },
    user_id: {
      type: Number,
    },
    username: {
      type: String,
      required: [true, "Username harus diisi."],
      minLength: [3, "Username minimal 3 karakter."],
      maxLength: [255, "Password maksimal 255 karatkter."],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi."],
      minLength: [3, "Password minimal 3 karakter."],
      maxLength: [255, "Password maksimal 255 karatkter."],
    },
    role: {
      type: String,
      enum: ["user", "admin", "guest"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

// Validation for user exists
userSchema
  // (1) Tangkap property `username`
  .path("username")
  // (2) Membuat validasi
  .validate(
    async function (value) {
      try {
        // (1) Lakukan pencarian ke collection User bedasarkan `username`
        const count = await this.model("User").count({ username: value });
        // (2) Jika count ada artinya ada username yang sama dan kembalikan nilai `false`
        // Jika tidak ada kembalikan nilai `true`
        return !count;
      } catch (err) {
        throw err;
      }
    },
    //   Declaration pesan error ketika user double
    (attr) => `${attr.value} sudah ada!`
  );

// Membuat auto increment
userSchema.plugin(AutoIncrement, { inc_field: "user_id" });

//   Hashing password
userSchema.pre("save", function (next) {
  // Tangkap password dengan 'this' dan lakukan hashing dengan hash_round = 10 diatas
  this.password = bcrypt.hashSync(this.password, HAS_ROUND);
  // Lanjutkan proses
  next();
});

//   Export model
module.exports = model("User", userSchema);
