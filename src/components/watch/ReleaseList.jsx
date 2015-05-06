"use strict";

var React = require("react");
var CoverImage = require("../shared/CoverImage.jsx");

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
              <CoverImage src={release.cover}/>
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
    $(".release-list").sticky({ topSpacing: 85, bottomSpacing: 30, getWidthFrom: ".release-wrapper" });
  },

  componentDidUpdate: function() {
    $(".release-list").css("top", "85px");
  }
});

module.exports = ReleaseList;
