"use strict";

var _ = require("lodash");

var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

var base = {
  region: "us-east-1",
  EC2: {
    apiVersion: "2014-10-02",
    musicBrainz: {
      instanceId: "i-7b151e8a",
      username: "ubuntu",
      password: "Mu5icBra1nz"
    }
  },
  SNS: {
    apiVersion: "2010-03-31",
    databaseUpdateTopic: "arn:aws:sns:us-east-1:982428925509:hawk-update-database"
  },
  S3: {
    hawk: {
      bucket: "stevevis-hawk",
      region: "us-east-1"
    },
    headers: {
      "Cache-Control": "max-age=315360000, no-transform, public"
    }
  }
};

var specific = {
  development: {
    EC2: {
      musicBrainz: {
        privateIp: "52.1.26.152"
      }
    }
  },
  production: {
    EC2: {
      musicBrainz: {
        privateIp: "172.30.1.209"
      }
    }
  }
};

module.exports = _.merge(base, specific[env]);
