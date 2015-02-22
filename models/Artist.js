"use strict";

var mongoose = require("mongoose");
var Release = require("./Release");

var artistSchema = mongoose.Schema({
  _id: { type: "Number" },
  gid: { type: "String" },
  name: { type: "String", index: true },
  releases:  [ Release.schema ]
});

var Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;
