"use strict";

var React = require("react");
var ImageLoader = require("react-imageloader");

var ReleaseList = React.createClass({
  render: function() {
    var releaseNodes = [];
    var maxReleases = 0;

    if (this.props.releases.length > 0) {
      var top = $(".artist-list").offset().top;
      // Each release is about 142px high (including margins)
      maxReleases = Math.floor((window.innerHeight - top) / 142);

      this.props.releases.forEach(function(release) {
        // This makes sure the release list always fits niceley on the screen
        if (releaseNodes.length >= maxReleases) {
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
  },

  componentDidMount: function() {
    $(".release-list").sticky({topSpacing:50, bottomSpacing: 50, getWidthFrom: ".artist-list"});
  },

  componentDidUpdate: function() {
    $(".release-list").css("top", "50px");
  }
});

module.exports = ReleaseList;