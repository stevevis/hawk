"use strict";

var mongoose = require("mongoose");
var Release = require("./Release");

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

var ArtistSchema = mongoose.Schema({
  _id: { type: "Number" },
  gid: { type: "String" },
  name: { type: "String", index: true },
  releases:  [ Release.schema ]
});

ArtistSchema.statics.findByName = function(name) {
  console.log("Searching for " + regexEscape(name));
  return this.aggregate([
    { $match: { name: new RegExp(regexEscape(name), "i") } },
    { $unwind: "$releases" },
    { $sort: { "releases.year": -1, "releases.month": -1, "releases.day": -1 } },
    { $limit: 50 },
    { $group: { _id: "$_id", name: { $first: "$name" }, year: { $max: "$releases.year" }, 
      releases: { $push: { year: "$releases.year", month: "$releases.month", day: "$releases.day", name: "$releases.name", 
        cover: { $concat: [ "http://coverartarchive.org/release-group/", "$releases.rgid", "/front-250" ] } } } } },
    { $sort: { "year": -1 } }
  ]).exec();
};

var Artist = mongoose.model("Artist", ArtistSchema);

module.exports = Artist;
