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
  readyTimeout: 30000
};

/**
 * Get an SSH client that is ready to execute commands on the MusicBrainz DB server.
 */
function getSSHClient() {
  return new Promise(function(resolve, reject) {
    logger.debug("Connecting to MusicBrainz DB server %s", connectConfig.host);
    var client = new Client();
    client.on("ready", function() {
      resolve(client);
    }).on("error", function(err) {
      logger.error("Error connecting to MusicBrainz server");
      reject(err);
    }).connect(connectConfig);
  });
}

/**
 * Exec the given command on the given SSH client, return the output in the callback.
 */
function execSSHClient(command, callback) {
  getSSHClient().then(function(client) {
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
        logger.info("[Output]\n`%s`", buffer);
        client.end();
        callback(null, buffer);
      }).on("data", function(data) {
        buffer += data;
      }).stderr.on("data", function(data) {
        buffer += data;
      });
    });
  }, function(err) {
    callback(err);
  });
}

/**
 * Continue to execute the given command on the given SSH client until the output matches the expected value.
 */
function execSSHClientUntil(command, expected, delay, callback) {
  logger.info("Executing command `%s` until output is `%s`", command, expected);

  execSSHClient(command, function(err, output) {
    if (output === expected) {
      callback(null);
    } else {
      setTimeout(function() {
        execSSHClientUntil(command, expected, delay, callback);
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
 * initialize database script. Sends an SNS notification when it's done. Skip creating the database if the latest
 * database dumps are the same version as lastVersion.
 */
MusicBrainzService.prototype.createDatabase = function(lastVersion, callback) {
  var version = "";

  async.series({
    checkIfRunning: function(callback) {
      logger.info("Checking if update job is already running on MusicBrainz server");
      execSSHClient(pgConfig.commands.checkInitDbProcess, function(err, output) {
        if (err) {
          return callback (err);
        }
        if (output !== "0") {
          callback(new Error("Update job is already running"));
        } else {
          callback(null);
        }
      });
    },
    downloadDumps: function(callback) {
      execSSHClient(pgConfig.commands.downloadDumps + " " + lastVersion, function(err, output) {
        if (err) {
          return callback (err);
        }
        // The first line of the output will look like "Latest 20150225-002259", extract the version number
        version = output.split("\n")[0].split(" ")[1];
        if (lastVersion === version) {
          callback(new Error("Skipping creating new database since there are no new database dumps"), version);
        } else {
          callback(null);
        }
      });
    },
    cleanup: function(callback) {
      execSSHClient(pgConfig.commands.cleanup, callback);
    },
    createDatabase: function(callback) {
      execSSHClient(pgConfig.commands.createDatabase, callback);
    },
    waitUntilFinished: function(callback) {
      logger.info("Waiting until update job finishes on MusicBrainz server");
      execSSHClientUntil(pgConfig.commands.checkInitDbProcess, "0", 10 * 60 * 1000, callback);
    },
    sendNotification: function(callback) {
      execSSHClient(pgConfig.commands.getLastLineOfLog, function(err, output) {
        if (err) {
          callback(err);
        } else {
          // Send an SNS notification with the output from the log file, ignore any errors
          SNSService.sendDatabaseUpdateMessage("Finished Creating MusicBrainz DB", output, callback, true);
        }
      });
    }
  }, function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, version);
    }
  });
};

MusicBrainzService.prototype.getArtists = function(callback) {
  logger.info("Getting artists from MusicBrainze DB");

  pg.connect(pgConfig.connect, function(err, client, done) {
    if (err) {
      done();
      logger.error("Could not connect to musicbrainz database: %j", err);
      return callback(err);
    }

    var statement = {
      name: "get artists",
      text: fs.readFileSync(path.join(__dirname, "../sql/artists.sql")).toString(),
      values: []
    };

    client.query(statement, function(err, result) {
      done();
      if (err) {
        logger.error("Could not get artists from musicbrainz database: %j", err);
        callback(err);
      } else {
        callback(null, result.rows);
      }
    });
  });
};

MusicBrainzService.prototype.getReleasesForArtist = function(artistId, callback) {
  logger.debug("Getting releases for artist %d from MusicBrainz DB", artistId);

  pg.connect(pgConfig.connect, function(err, client, done) {
    if (err) {
      done();
      logger.error("Could not connect to musicbrainz postgres database: %j", err);
      return callback(null);
    }

    var statement = {
      name: "get releases for artist",
      text: fs.readFileSync(path.join(__dirname, "../sql/releases.sql")).toString(),
      values: [ artistId ]
    };

    client.query(statement, function(err, result) {
      done();
      if (err) {
        logger.error("Could not get releases for artist %d from musicbrainz database: %j", err);
        callback(err);
      } else {
        callback(null, result.rows);
      }
    });
  });
};

module.exports = new MusicBrainzService();
