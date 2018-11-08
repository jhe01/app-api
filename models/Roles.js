const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RolesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
});

module.exports = Roles = mongoose.model("roles", RolesSchema);
