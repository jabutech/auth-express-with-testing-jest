// Use get token
const { getToken } = require("../utils/get-token");
// Use jwt
const jwt = require("jsonwebtoken");
// Use config
const { config } = require("dotenv");
// Use model user
const User = require("../user/model");

// Function module for decode token
function decodeToken() {
  return async function (req, res, next) {
    try {
      // (1) Get token form file get-token handle
      let token = getToken(req);

      // (2)  Jika token tidak ada, lanjutkan proses ke middleware
      if (!token) return next();

      //  (3) Jika token ada, lakukan decode dengan fungsi dari jwt yaitu `verify`
      //  Dan gunakan secret key
      //   Lalu simpan hasil decode pada `req.user` agar bisa digunakan oleh proses lainnya
      req.user = jwt.verify(token, config.secretKey);

      //   (4) Cek apakah token masih ada / belum expired pada MongoDB
      let user = await User.findOne({ token: { $in: [token] } });

      //   (5) response jika token expired
      if (!user) {
        return res.json({
          error: 1,
          message: `Token expired`,
        });
      }
    } catch (err) {
      // Handle error terkait JWT
      if (err && err.name === "JsonWebTokenError") {
        return res.json({
          error: 1,
          message: err.message,
        });
      }
      // (2) tangani error lainnya
      next(err);
    }
    return next();
  };
}

module.exports = {
  decodeToken,
};
