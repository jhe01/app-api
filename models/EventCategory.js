const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventCategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
});

module.exports = EventCategory = mongoose.model(
  "event_categories",
  EventCategorySchema
);
