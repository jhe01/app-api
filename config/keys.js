const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  user: process.env.USER,
  pass: process.env.PASS,
  secretOrKey: process.env.SECRET_OR_KEY,
  uploadMongoURI: process.env.UPLOAD_MONGO_URI,
  uploadUser: process.env.UPLOAD_USER,
  uploadPass: process.env.UPLOAD_PASS
};
