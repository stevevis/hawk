"use strict";

var React = require("react");
var ImageLoader = require("react-imageloader");

var CoverImage = React.createClass({
  placeholder: function() {
    return (
      <div className="cover-image"/>
    );
  },

  render: function() {
    return (
      <ImageLoader src={this.props.src} preloader={this.placeholder}>
        <div className="cover-image"/>
      </ImageLoader>
    );
  }
});

module.exports = CoverImage;
