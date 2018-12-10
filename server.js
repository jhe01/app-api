const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const path = require("path");

const users = require("./routes/api/users");
const events = require("./routes/api/events");
const list = require("./routes/api/list");
const roles = require("./routes/api/roles");
const golfclubs = require("./routes/api/golfclubs");
const golfcourse = require("./routes/api/golfcourse");
const eventcategory = require("./routes/api/event_category");
const eventtype = require("./routes/api/event_types");
const recent_event_album = require("./routes/api/recent_event_album");
// const upload = require("./routes/api/upload");

// Upload
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

const Uploads = require("./models/Uploads");
const Event = require("./models/Events");
const GolfClubRecentEventAlbum = require("./models/GolfClubRecentEventAlbum");
const GolfClubs = require("./models/GolfClubs");

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

const db = require("./config/keys").mongoURI;
const user = require("./config/keys").user;
const pass = require("./config/keys").pass;

let gfs;

const conn = mongoose
  .connect(db)
  .then(db => {
    // console.log(mongoose.connection);
    gfs = Grid(db.connection.db, mongoose.mongo);
    gfs.collection("uploads");

    //gfs.collection("upload");
    console.log("Connected to MongoDB!");
    return db.connection.db;
  })
  .catch(err => console.log(err));

const storage = new GridFsStorage({
  db: conn,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

app.use(passport.initialize());

require("./config/passport.js")(passport);
app.use(cors());
// Routes
app.use("/api/users", users);
app.use("/api/events", events);
app.use("/api/list", list);
app.use("/api/golfclubs", golfclubs);
// app.use("/api/golfcourses", golfcourse);
app.use("/api/roles", roles);
app.use("/api/eventcategory", eventcategory);
app.use("/api/eventtype", eventtype);
app.use("/api/album", recent_event_album);

// Routes - upload
// app.use("/api/upload", upload);

app.get("/api/upload/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist"
      });
    }

    // Files exist
    return res.json(files);
  });
});

app.post("/api/upload/add/:id", upload.single("file"), (req, res) => {
  const file = req.file;

  if (file.id) {
    Event.findOne({ _id: req.params.id }, (err, event) => {
      if (err) throw err;

      const newBanner = {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        upid: file.id,
        filename: file.filename,
        metadata: file.metadata,
        uploadDate: file.uploadDate,
        contentType: file.contentType
      };

      if (event.banner.length > 0) {
        gfs.remove(
          { _id: event.banner[0].upid, root: "uploads" },
          (err, gridStore) => {
            if (err) {
              return res.status(404).json({ err: err });
            }
          }
        );
      }
      event.banner.splice(0, 1);
      event.banner.push(newBanner);
      event.save(err => {
        if (err) return res.status(404).json({ err: err });

        Event.findOne({ _id: req.params.id })
          .populate(["club", "eventType", "eventCategory", "banner"])
          .exec((err, ev) => {
            if (err) throw err;

            res.json(ev);
          });
      });
    });
  }
});

app.post("/api/club/upload/add/:id", upload.single("file"), (req, res) => {
  const file = req.file;

  if (file.id) {
    GolfClubs.findOne({ _id: req.params.id }, (err, club) => {
      if (err) throw err;

      const newLogo = {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        upid: file.id,
        filename: file.filename,
        metadata: file.metadata,
        uploadDate: file.uploadDate,
        contentType: file.contentType
      };

      if (club.logo.length > 0) {
        gfs.remove(
          { _id: club.logo[0].upid, root: "uploads" },
          (err, gridStore) => {
            if (err) {
              return res.status(404).json({ err: err });
            }
          }
        );
      }
      club.logo.splice(0, 1);
      club.logo.push(newLogo);
      club
        .save()
        .then(club => res.json(club))
        .catch(err => res.status(404).json(err));
    });
  }
});

app.post("/api/club/upload/album/:id", upload.array("files"), (req, res) => {
  const files = req.files;

  if (file.id) {
    GolfClubRecentEventAlbum.findOne({ _id: req.params.id }, (err, album) => {
      if (err) throw err;
      const images = [];

      for (let i = 0; i < files.length; i++) {
        const image = {
          fieldname: files[0].fieldname,
          originalname: files[0].originalname,
          mimetype: files[0].mimetype,
          upid: files[0].id,
          filename: files[0].filename,
          metadata: files[0].metadata,
          uploadDate: files[0].uploadDate,
          contentType: files[0].contentType
        };

        images.push(image);
      }

      album.images.push(images);
      event.save(err => {
        if (err) return res.status(404).json({ err: err });

        GolfClubRecentEventAlbum.findOne({ _id: req.params.id })
          .populate(["club_id"])
          .exec((err, ev) => {
            if (err) throw err;

            res.json(ev);
          });
      });
    });
  }
});

app.get("/api/upload/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }

    // Check if image
    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "image/gif"
    ) {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  });
});

app.delete("/api/upload/files/:id", (req, res) => {
  gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port : ${port}`);
});
