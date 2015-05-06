"use strict";

var mongoose = require("mongoose");
var Release = require("./Release");

// Thanks - http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711
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
  return this.aggregate([
    { $match: { name: new RegExp(regexEscape(name), "i") } }, // match the search term anywhere in the artist name
    { $unwind: "$releases" }, // split the releases for each artist into individual rows
    { $sort: { "releases.year": -1, "releases.month": -1, "releases.day": -1 } }, // sort by release date
    { $limit: 200 }, // limit the number of releases to the 200 most recent
    { $group: { _id: "$_id", name: { $first: "$name" }, year: { $max: "$releases.year" }, // group back up by artist
      releases: { $push: { year: "$releases.year", month: "$releases.month", day: "$releases.day", name: "$releases.name", 
        cover: { $concat: [ "http://coverartarchive.org/release-group/", "$releases.rgid", "/front-250" ] } } } } },
    { $sort: { "year": -1 } }, // sort artists by the year of their most recent release
    { $limit: 10 } // limit to 10 artist search results
  ])
  .exec()
  .then(function(artists) {
    return new Promise(function(resolve) {
      // Only return a max of 5 releases per artist
      artists.forEach(function(artist) {
        artist.releases = artist.releases.slice(0, 5);
      });
      resolve(artists);
    });
  });
};

ArtistSchema.statics.getArtistFeedById = function(id) {
  return this.aggregate([
    { $match: { _id: id } },
    { $unwind: "$releases" }, // split the releases array into individual rows
    { $sort: { "releases.year": -1, "releases.month": -1, "releases.day": -1 } }, // sort by release date
    { $project: {
      _id: 0,
      "aid": "$_id",
      "aname": "$name",
      "rid": "$releases._id",
      "rname": "$releases.name",
      "rgid": "$releases.rgid",
      "year": "$releases.year",
      "month": "$releases.month",
      "day": "$releases.day"
    }}
  ]).exec();
};

var Artist = mongoose.model("Artist", ArtistSchema);

module.exports = Artist;
