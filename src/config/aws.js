/* eslint no-process-env: "off" */

const _ = require("lodash");

const env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

const base = {
  EC2: {
    region: "us-west-2",
    apiVersion: "2014-10-02",
    musicBrainz: {
      instanceId: "i-c87585c5",
      username: "ubuntu",
      password: "Mu5icBra1nz"
    }
  },
  SNS: {
    region: "us-west-2",
    apiVersion: "2010-03-31",
    databaseUpdateTopic: "arn:aws:sns:us-west-2:982428925509:hawk-database-update"
  },
  S3: {
    bucket: {
      name: "musichawk",
      region: "us-west-2"
    },
    headers: {
      "Cache-Control": "max-age=315360000, no-transform, public"
    }
  },
  CloudFront: {
    URL: "http://dpf6wbziy9btt.cloudfront.net"
  }
};

const specific = {
  development: {
    EC2: {
      musicBrainz: {
        privateIp: "52.33.43.252"
      }
    }
  },
  production: {
    EC2: {
      musicBrainz: {
        privateIp: "172.31.32.22"
      }
    }
  }
};

module.exports = _.merge(base, specific[env]);
