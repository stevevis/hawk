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

/** 
 * Cover image URLs look like: 
 * http://coverartarchive.org/release-group/bbf6eaa8-1340-35c8-9599-34056896ebab/front-250
 * The trailing "250" can be replaced by a "500" for a bigger image.
 */
ReleaseSchema.virtual("cover").get(function() {
  return "http://coverartarchive.org/release-group/" + this.rgid + "/front-250";
});

// Output virtuals in toJSON and toObject calls
ReleaseSchema.set("toJSON", { virtuals: true });
ReleaseSchema.set("toObject", { virtuals: true });

var Release = mongoose.model("Release", ReleaseSchema);

module.exports = Release;
