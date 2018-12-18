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
  logo: [
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
  address: {
    type: String,
    required: false
  },
  maintenance_day: {
    type: String,
    required: false
  },
  policies: [
    {
      name: {
        type: String,
        required: false
      },
      is_allowed: {
        type: Boolean,
        default: true
      }
    }
  ],
  services: [
    {
      name: {
        type: String,
        required: false
      }
    }
  ],
  facilities: [
    {
      name: {
        type: String,
        required: false
      }
    }
  ],
  facility_images: [
    {
      caption: {
        type: String,
        required: false
      },
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
  fairway_images: [
    {
      caption: {
        type: String,
        required: false
      },
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
