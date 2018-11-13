const express = require("express");
const router = express.Router();

const List = require("../../models/List");

router.get("/events", (req, res) => {
  List.findOne({ ds_key: "events" }).then(list => {
    res.json(list);
  });
});

module.exports = router;
