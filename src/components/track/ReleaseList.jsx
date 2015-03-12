"use strict";

var React = require("react");
var ImageLoader = require("react-imageloader");

var ReleaseList = React.createClass({
  render: function() {
    var releaseNodes = [];

    if (this.props.releases.length > 0) {
      this.props.releases.forEach(function(release) {
        if (releaseNodes.length >= 4) {
          return;
        }

        releaseNodes.push (
          <div className="row release" key={release.name}>
            <div className="small-4 columns">
              <div className="cover-image">
                <ImageLoader src={release.cover} />
              </div>
            </div>
            <div className="small-8 columns">
              <h5>{release.name}</h5>
              <h6>{release.year}</h6>
            </div>
          </div>
        );
      }.bind(this));
    }

    return (
      <div className="release-list">
        {releaseNodes}
      </div>
    );
  }
});

module.exports = ReleaseList;