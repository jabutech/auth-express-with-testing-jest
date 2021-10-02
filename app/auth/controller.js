// Require model user
const User = require("../user/model");

// Function register
async function register(req, res, next) {
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
}

// Export function
module.exports = { register };
