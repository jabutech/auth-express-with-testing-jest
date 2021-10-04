// Require package dotenv
const dotenv = require("dotenv");
// Use config from dotenv
dotenv.config();

// Export variable from file .env
module.exports = {
  // Export variable SERVICE_NAME
  serviceName: process.env.SERVICE_NAME,
  // Secret key JWT
  secretKey: process.env.SECRET_KEY,
  // Database config
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPort: process.env.DB_PORT,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
};
