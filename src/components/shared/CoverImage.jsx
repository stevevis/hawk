"use strict";

var React = require("react");
var ImageLoader = require("react-imageloader");

var CoverImage = React.createClass({
  preload: function() {
    return (
      <div className="cover-image"/>
    );
  },

  render: function() {
    return (
      <ImageLoader src={this.props.src} preloader={this.preload}/>
    );
  }
});

module.exports = CoverImage;
