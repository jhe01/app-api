const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventTypesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
});

module.exports = EventTypes = mongoose.model("event_types", EventTypesSchema);
