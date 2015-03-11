"use strict";

var mongoose = require("mongoose");

var DatabaseUpdateSchema = mongoose.Schema({
  updateDate: { type: Date, default: Date.now },
  version: { type: "String", default: 0 },
  totalArtists: { type: "Number", default: 0 },
  artistsUpdated: { type: "Number", default: 0 },
  newArtists: { type: "Number", default: 0 },
  totalReleases: { type: "Number", default: 0 },
  newReleases: { type: "Number", default: 0 },
});

var DatabaseUpdate = mongoose.model("DatabaseUpdate", DatabaseUpdateSchema);

module.exports = DatabaseUpdate;
