const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  club_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "golf_clubs"
  },
  role_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "roles"
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  date_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = Users = mongoose.model("users", UsersSchema);
