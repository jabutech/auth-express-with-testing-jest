// Require model user
const User = require("../user/model");
// Use passport
const passport = require("passport");
// Use jwt
const jwt = require("jsonwebtoken");
// Use bcrypt
const bcrypt = require("bcrypt");
// Use config
const config = require("../../config");
// Use get-token
const { getToken } = require("../utils/get-token");

// Export function
module.exports = {
  // Function register
  register: async (req, res, next) => {
    try {
      // (1) Take payload from client request register data
      const payload = req.body;

      // (2) Create new object user and include const payload
      let user = new User(payload);

      //   (3) Save data to MongoDB
      await user.save();

      //  (4) Return response to client
      return (
        res
          // Status 200 (success)
          .status(200)
          // data user which succesfully register with format data json
          .json({
            data: user,
          })
      );
    } catch (err) {
      //  (1)  Check error from validation
      if (err && err.name === "ValidationError") {
        // Return response, with status 422 (Unprocessable Entity), and data format json
        return res.status(422).json({
          error: 1,
          message: err.message,
          field: err.errors,
        });
      }

      // (2) Handle error except validation
      next(err);
    }
  },

  // Function handle strategy login
  localStrategy: async (username, password, done) => {
    try {
      // (1) Find username on collection Users
      // (a) Use model User
      let user = await User
        // (b) Find username
        .findOne({ username })
        // (c) Select field for display except this field
        .select("-__v -token -createdAt -updatedAt");

      // (2) If user not found, end process login, and send error
      if (!user) return done();

      // (3) If user found, check password apakah sesuai atau tidak
      if (
        bcrypt
          // (a) function compareSync dari package bcrypt untuk mengcompare password yang di bcrypt di mongoDB dengan password yang dikirim dari user
          .compareSync(
            //  Password dari form user
            password,
            //  Password dari database
            user.password
          )
      ) {
        // (b) Jika sama,
        // keluarkan password agar tidak ditampilkan dari variable user
        ({ password, ...userWithoutPassword } = user.toJSON());

        // return data user tanpa password
        return done(null, userWithoutPassword);
      }
    } catch (err) {
      // If error
      done(err, null);
    }

    done(); // untuk memanggil fungsi ketika password tidak cocok
  },

  // Function for login
  login: async (req, res, next) => {
    passport.authenticate("local", async (err, user) => {
      // (1) Jika error
      if (err) return next(err);

      // (2) Cek jika user tidak ditemukan, return error
      if (!user)
        return res.json({
          error: 1,
          message: "username / password salah",
        });

      // (3) Jika user ada
      // (a) Buat token JWT, dengan memasukkan secret key 'MYREVO6444IR' dan deklarasiikan ke variable
      let newToken = jwt.sign(user, config.secretKey);

      // (b) Simpan token ke field user di mongodb
      await User.findOneAndUpdate(
        // Cari id yang sama dengan user yang login
        { _id: user._id },
        // Masukkan token ke field token pada user terkait
        { $push: { token: newToken } },
        // Instruksikan ke mongo untuk mengembalikan data terbaru
        { new: true }
      );

      // (c) return response to client
      return res.json({
        message: "loggen in successfully",
        user: user,
        token: newToken,
      });
    })(req, res, next);
  },

  // Function `me` for handle user login information
  me: (req, res, next) => {
    // (1) Jika req.user tidak memiliki data dan token,
    // didalam req user ada token yang sudah dibuat pada file middleware
    if (!req.user) {
      // Retrun error
      return res.json({
        error: 1,
        message: `Your're not login or token expired`,
      });
    }

    // Jika data return data user
    return res.json(req.user);
  },

  // Function logout
  logout: async (req, res, next) => {
    // (1) Get token user which login
    let token = getToken(req);

    // (2) Delete `token` from document `User` terkait
    let user = await User.findOneAndUpdate(
      { token: { $in: [token] } },
      { $pull: { token } },
      { useFindAndModify: false }
    );

    // (3) check user or token
    // If user or token not found
    if (!user || !token) {
      // Return response to client
      return res.json({
        error: 1,
        message: "No user found",
      });
    }

    // (4) If token has been deleted / logout successfully
    // Return response to client
    return res.json({
      error: 0,
      message: "Logout Successfully",
    });
  },
};
