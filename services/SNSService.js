"use strict";

var AWS = require("aws-sdk");
var AWSConfig = require("../config/aws");
var logger = require("../config/logger");

var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

var SNSService = function() {
  AWS.config.region = AWSConfig.SNS.region;
  this.sns = new AWS.SNS({ apiVersion: AWSConfig.SNS.apiVersion });
};

function sendMessage(sns, topic, subject, message, callback, ignoreError) {
  logger.info("Sending message subject '%s' to topic '%s'", subject, topic);

  if (env !== "production") {
    logger.info("Skipping SNS message in development");
    return callback(null);
  }

  var params = {
    TopicArn: topic,
    Subject: subject ? subject : "No subject",
    Message: message ? message : "No message"
  };

  sns.publish(params, function(err) {
    if (err) {
      logger.error("Failed to send message", err);
      callback(ignoreError ? null : err);
    } else {
      logger.info("Successfully sent message");
      callback(null);
    }
  });
}

SNSService.prototype.sendDatabaseUpdateMessage = function(subject, message, callback, ignoreError) {
  sendMessage(this.sns, AWSConfig.SNS.databaseUpdateTopic, subject, message, callback, ignoreError);
};

module.exports = new SNSService();
