"use strict";

var React = require("react");
var ReleaseList = require("./ReleaseList.jsx");

var ArtistSelector = React.createClass({
  getInitialState: function() {
    return {
      numArtists: 0,
      releases: []
    };
  },

  componentWillReceiveProps: function() {
    this.setState({ numArtists: 0, releases: [] });
  },

  handleMouseEnter: function(artist) {
    $(".artist").each(function() {
      $(this).removeClass("active");
    });

    $(this.refs[artist._id].getDOMNode()).addClass("active");

    this.setState({ numArtists: this.props.artists.length, releases: artist.releases });
  },

  render: function() {
    var artistNodes = [];

    if (this.props.artists.length > 0) {
      artistNodes.push(<li className="artist-spacer" key="top-spacer"></li>);

      this.props.artists.forEach(function(artist) {
        if (artistNodes.length >= 8) {
          return;
        }

        artistNodes.push (
          <li className="artist" ref={artist._id} key={artist._id} onMouseEnter={this.handleMouseEnter.bind(this, artist)}>
            <h4>{artist.name}</h4>
          </li>
        );
      }.bind(this));

      artistNodes.push(<li className="artist-spacer" key="bottom-spacer"></li>);
    }

    return (
      <div className="artist-selector">
        <div className="row">
          <div className="small-6 columns">
            <ul className="artist-list">
              {artistNodes}
            </ul>
          </div>
          <div className="small-6 columns">
            <ReleaseList numArtists={this.state.numArtists} releases={this.state.releases}/>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = ArtistSelector;
