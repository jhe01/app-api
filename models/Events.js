const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: "golf_clubs",
    required: false
  },
  oneDayOnly: {
    type: Boolean,
    default: false,
    required: false
  },
  isWholeDay: {
    type: Boolean,
    default: false,
    required: false
  },
  dateOfEvent: {
    type: String,
    required: false
  },
  from: {
    type: String,
    required: false
  },
  timeFrom: {
    type: String,
    required: false
  },
  timeTo: {
    type: String,
    required: false
  },
  to: {
    type: String,
    required: false
  },
  eventType: {
    type: Schema.Types.ObjectId,
    ref: "event_types",
    required: true
  },
  eventCategory: {
    type: Schema.Types.ObjectId,
    ref: "event_categories",
    required: true
  },
  numberOfPlayers: {
    type: Number,
    required: false
  },
  details: {
    type: String,
    required: false
  },
  is_active: {
    type: Boolean,
    default: true,
    required: false
  },
  is_public: {
    type: Boolean,
    default: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  banner: [
    {
      fieldname: {
        type: String,
        required: false
      },
      originalname: {
        type: String,
        required: false
      },
      mimetype: {
        type: String,
        required: false
      },
      upid: {
        type: String,
        required: false
      },
      filename: {
        type: String,
        required: false
      },
      metadata: {
        type: String,
        required: false
      },
      uploadDate: {
        type: Date,
        required: false
      },
      contentType: {
        type: String,
        required: false
      }
    }
  ],
  date_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = Events = mongoose.model("events", EventsSchema);
