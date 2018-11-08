const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UploadsSchema = new Schema({
  length: {
    type: Number,
    required: false
  },
  chunkSize: {
    type: Number,
    required: false
  },
  uploadDate: {
    type: Date,
    required: false
  },
  filename: {
    type: String,
    required: false
  },
  md5: {
    type: String,
    required: false
  },
  contentType: {
    type: String,
    required: false
  }
});

module.exports = Uploads = mongoose.model("uploads.files", UploadsSchema);
