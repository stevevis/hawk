"use strict";

var fs = require("fs");
var path = require("path");
var pg = require("pg");
var pgConfig = require("../config/postgres");
var logger = require("../config/logger");

var MusicBrainzService = function() {};

MusicBrainzService.prototype.getArtists = function(callback) {
  logger.info("Getting artists from MusicBrainze DB");

  pg.connect(pgConfig, function(err, client, done) {
    if (err) {
      logger.error("Could not connect to musicbrainz database: %j", err);
      done();
      callback(err);
    }

    var statement = {
      name: "get artists",
      text: fs.readFileSync(path.join(__dirname, "../sql/artists.sql")).toString(),
      values: []
    };

    client.query(statement, function(err, result) {
      if (err) {
        logger.error("Could not get artists from musicbrainz database: %j", err);
        done();
        callback(err);
      }

      done();
      callback(null, result.rows);
    });
  });
};

MusicBrainzService.prototype.getReleasesForArtist = function(artistId, callback) {
  logger.debug("Getting release for artist %d from MusicBrainz DB", artistId);

  pg.connect(pgConfig, function(err, client, done) {
    if (err) {
      logger.error("Could not connect to musicbrainz postgres database: %j", err);
      done();
      callback(null);
    }

    var statement = {
      name: "get releases for artist",
      text: fs.readFileSync(path.join(__dirname, "../sql/releases.sql")).toString(),
      values: [ artistId ]
    };

    client.query(statement, function(err, result) {
      if (err) {
        logger.error("Could not get releases for artist %d from musicbrainz database: %j", err);
        done();
        callback(err);
      }

      done();
      callback(null, result.rows);
    });
  });
};

module.exports = new MusicBrainzService();
