"use strict";

var AWS = require("aws-sdk");
var AWSConfig = require("../config/aws");
var logger = require("../config/logger");

var EC2Service = function() {
  AWS.config.region = AWSConfig.region;
  this.ec2 = new AWS.EC2({ apiVersion: AWSConfig.EC2.apiVersion });
};

/**
 * Start up an EC2 instance.
 */
EC2Service.prototype.startInstance = function(instanceId, callback) {
  logger.info("Starting instance %s", instanceId);

  var params = {
    InstanceIds: [ instanceId ]
  };

  this.ec2.startInstances(params, function(err, data) {
    if (err) {
      logger.info("Failed to start instance %s", instanceId);
      callback(err);
    } else {
      logger.info("Successfully started instance %s", instanceId);
      logger.debug(data);
      callback(null, data);
    }
  });
};

/**
 * Wait for an EC2 instance to reach a particular instance status e.g. running, stopped.
 */
EC2Service.prototype.waitForInstanceStatus = function(instanceId, status, callback) {
  logger.info("Waiting for instance %s to reach status %s", instanceId, status);

  var params = {
    InstanceIds: [ instanceId ]
  };

  this.ec2.waitFor(status, params, function(err, data) {
    if (err) {
      logger.info("Failed to wait for instance %s to reach status %s", instanceId, status);
      callback(err);
    } else {
      logger.info("Instance %s has status %s", instanceId, status);
      logger.debug(data);
      callback(null, data);
    }
  });
};

/**
 * Stop an EC2 instance.
 */
EC2Service.prototype.stopInstance = function(instanceId, callback, ignoreError) {
  logger.info("Stopping instance %s", instanceId);

  var params = {
    InstanceIds: [ instanceId ]
  };

  this.ec2.stopInstances(params, function(err, data) {
    if (err) {
      logger.info("Failed to stop instance " + instanceId);
      callback(ignoreError ? null : err);
    } else {
      logger.info("Successfully stopped instance " + instanceId);
      logger.debug(data);
      callback(null, data);
    }
  });
};

/**
 * Describe an EC2 instance.
 */
EC2Service.prototype.describeInstance = function(instanceId, callback) {
  logger.info("Getting description of instance %s", instanceId);

  var params = {
    InstanceIds: [ instanceId ]
  };

  this.ec2.describeInstances(params, function(err, data) {
    if (err) {
      logger.info("Failed to get description of instance %s", instanceId);
      callback(err);
    } else {
      logger.info("Got description of instance %s", instanceId);
      logger.debug(data);
      callback(null, data);
    }
  });
};

module.exports = new EC2Service();
