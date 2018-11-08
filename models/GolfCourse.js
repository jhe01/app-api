const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GolfCourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  club_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: false
  }
});

module.exports = GolfCourse = mongoose.model("golf_courses", GolfCourseSchema);
