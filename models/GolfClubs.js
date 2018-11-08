const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GolfClubsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  courses: [
    {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: false
      }
    }
  ],
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

module.exports = GolfClubs = mongoose.model("golf_clubs", GolfClubsSchema);
