"use strict";

var AWS = require("aws-sdk");
var AWSConfig = require("../config/aws");
var logger = require("../config/logger");

var SNSService = function() {
  AWS.config.region = AWSConfig.region;
  this.sns = new AWS.SNS({ apiVersion: AWSConfig.SNS.apiVersion });
};

function sendMessage(sns, topic, subject, message, callback) {
  var params = {
    TopicArn: topic,
    Subject: subject,
    Message: message
  };

  sns.publish(params, function(err) {
    if (err) {
      logger.error("Failed to send message '%s' to topic '%s'", err);
      callback(err);
    } else {
      logger.info("Successfully sent message");
      callback(null);
    }
  });
}

SNSService.prototype.sendDatabaseUpdateMessage = function(subject, message, callback) {
  sendMessage(this.sns, AWSConfig.SNS.databaseUpdateTopic, subject, message, callback);
};

module.exports = new SNSService();
