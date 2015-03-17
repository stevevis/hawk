"use strict";

var React = require("react");
var moment = require("moment");
var pad = require("underscore.string/pad");

var ReleaseDate = React.createClass({
  render: function() {
    var year = this.props.year,
        month = pad(this.props.month, 2, "0"),
        day = pad(this.props.day, 2, "0");

    var date = moment(year + " " + month + " " + day, "YYYY MM DD");
    var dateString = date.format("Do MMMM YYYY");
    return (
      <h6>{dateString}</h6>
    );
  }
});

module.exports = ReleaseDate;
