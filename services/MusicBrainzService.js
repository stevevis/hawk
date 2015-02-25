"use strict";

var fs = require("fs");
var path = require("path");
var pg = require("pg");
var async = require("async");
var Client = require("ssh2").Client;

// Config
var logger = require("../config/logger");
var pgConfig = require("../config/postgres");
var logger = require("../config/logger");
var AWSConfig = require("../config/aws");

// Services
var SNSService = require("../services/SNSService");

var connectConfig = {
  host: AWSConfig.EC2.musicBrainz.privateIp,
  username: AWSConfig.EC2.musicBrainz.username,
  password: AWSConfig.EC2.musicBrainz.password,
  readyTimeout: 60000
};

function getSSHClient(callback) {
  logger.info("Connecting to MusicBrainz DB server");
  var client = new Client();
  client.on("ready", function() {
    callback(null);
  }).connect(connectConfig);
  return client;
}

function execSSHClient(client, command, callback) {
  logger.info("Executing command `%s`", command);

  client.exec(command, function(err, stream) {
    if (err) {
      logger.error(err);
      return callback(err);
    }

    var buffer = "";
    stream.setEncoding("utf8");
    stream.stderr.setEncoding("utf8");

    stream.on("close", function() {
      buffer = buffer.trim();
      logger.info("[Output] `%s`", buffer);
      callback(null, buffer);
    }).on("data", function(data) {
      buffer += data;
    }).stderr.on("data", function(data) {
      buffer += data;
    });
  });
}

function execSSHClientUntil(client, command, expected, delay, callback) {
  logger.info("Executing command `%s` until output is `%s`", command, expected);

  execSSHClient(client, command, function(err, output) {
    if (output === expected) {
      callback(null);
    } else {
      setTimeout(function() {
        execSSHClientUntil(client, command, expected, delay, callback);
      }, delay);
    }
  });
}

/**
 * MusicBrainzService constructor.
 */
var MusicBrainzService = function() {};

/**
 * Create a fresh Postgres MusicBrainz database on the server by downloading the latest database dumps and running the
 * initialize database script. Sends an SNS notification when it's done.
 */
MusicBrainzService.prototype.createDatabase = function(callback) {
  var client = null;
  async.series({
    getClient: function(callback) {
      client = getSSHClient(callback);
    },
    checkIfRunning: function(callback) {
      execSSHClient(client, pgConfig.commands.checkInitDbProcess, function(err, output) {
        if (output !== "0") {
          callback(new Error("Update job is already running"));
        } else {
          callback(null);
        }
      });
    },
    cleanup: function(callback) {
      execSSHClient(client, pgConfig.commands.cleanup, callback);
    },
    downloadDumps: function(callback) {
      execSSHClient(client, pgConfig.commands.downloadDumps, callback);
    },
    createDatabase: function(callback) {
      execSSHClient(client, pgConfig.commands.createDatabase, callback);
    },
    waitUntilFinished: function(callback) {
      execSSHClientUntil(client, pgConfig.commands.checkInitDbProcess, "0", 10 * 60 * 1000, callback);
    },
    sendNotification: function(callback) {
      execSSHClient(client, pgConfig.commands.getLastLineOfLog, function(err, output) {
        if (err) {
          callback(err);
        }

        // Send an SNS notification with the output from the log file
        SNSService.sendDatabaseUpdateMessage("Finished Creating MusicBrainz DB", output, callback);
      });
    }
  }, function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

MusicBrainzService.prototype.getArtists = function(callback) {
  logger.info("Getting artists from MusicBrainze DB");

  pg.connect(pgConfig.connect, function(err, client, done) {
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

  pg.connect(pgConfig.connect, function(err, client, done) {
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
