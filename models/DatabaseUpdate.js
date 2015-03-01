"use strict";

var mongoose = require("mongoose");

var databaseUpdateSchema = mongoose.Schema({
  updateDate: { type: Date, default: Date.now },
  version: { type: "String" },
  totalArtists: { type: "Number" },
  newArtists: { type: "Number" },
  totalReleases: { type: "Number" },
  newReleases: { type: "Number" },
});

var DatabaseUpdate = mongoose.model("DatabaseUpdate", databaseUpdateSchema);

module.exports = DatabaseUpdate;
