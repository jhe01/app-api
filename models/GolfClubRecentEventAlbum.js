const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GolfClubRecentEventAlbumSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  club_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  images: [
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
  date_created: {
    type: Date,
    default: Date.now
  },
  date_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = GolfClubRecentEventAlbum = mongoose.model(
  "golf_club_recent_event_album",
  GolfClubRecentEventAlbumSchema
);
