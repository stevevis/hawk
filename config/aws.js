"use strict";

var AWSConfig = {
  region: "us-east-1",
  EC2: {
    apiVersion: "2014-10-02",
    musicBrainz: {
      instanceId: "i-7b151e8a",
      privateIp: "172.30.1.209",
      //privateIp: "54.85.70.179",
      username: "ubuntu",
      password: "Mu5icBra1nz"
    }
  },
  SNS: {
    apiVersion: "2010-03-31",
    databaseUpdateTopic: "arn:aws:sns:us-east-1:982428925509:hawk-update-database"
  },
};

module.exports = AWSConfig;
