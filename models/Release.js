"use strict";

var mongoose = require("mongoose");

var ReleaseSchema = mongoose.Schema({
  _id: { type: "Number" },
  gid: { type: "String" },
  name: { type: "String", index: true },
  rgid: { type: "String" },
  year: { type: "Number" },
  month: { type: "Number", min: 1, max: 12},
  day: { type: "Number", min: 1, max: 31 }
});

var Release = mongoose.model("Release", ReleaseSchema);

module.exports = Release;
