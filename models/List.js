const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  ds_key: {
    type: String,
    required: false
  }
});

module.exports = List = mongoose.model("list_records", ListSchema);
