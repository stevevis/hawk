"use strict";

var React = require("react");
var ReleaseList = require("./ReleaseList.jsx");
var UserStore = require("../../stores/UserStore");
var UserActions = require("../../actions/UserActions");

var ArtistSelector = React.createClass({
  getInitialState: function() {
    return {
      numArtists: 0,
      releases: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.artists.length === 0) {
      return this.setState({ releases: [] });
    }

    // Figure out if the new artists array and the old artists array are different
    var newArtists = false;
    if (this.props.artists.length !== nextProps.artists.length) {
      // If the arrays are different size, they are differnt
      newArtists = true;
    } else {
      // If the arrays are the same size, we need to compare the ID of each artist
      for (var i = 0; i < nextProps.artists.length; i++) {
        if (nextProps.artists[i]._id !== this.props.artists[i]._id) {
          newArtists = true;
          break;
        }
      }
    }

    // If we have new artists to render, set the first one to active and show it's releases
    if (newArtists) {
      var releases = nextProps.artists[0].releases;
      this.setState({ releases: releases });
    }
  },

  handleMouseEnter: function(artist) {
    $(".artist").each(function() {
      $(this).removeClass("active");
    });

    $(this.refs[artist._id].getDOMNode()).addClass("active");

    this.setState({ releases: artist.releases });
  },

  handleClickWatch: function(artist, e) {
    e.preventDefault();
    var user = UserStore.getUser();
    UserActions.watchArtist(user._id, artist._id);
    $(this.refs["watch-" + artist._id].getDOMNode()).addClass("watching");
    $(this.refs["watch-" + artist._id].getDOMNode()).html("Watching");
  },

  render: function() {
    var artistNodes = [];
    // Give the first artist list item the active class
    var className = "artist active";
    var numArtists = 0;

    if (this.props.artists.length > 0) {
      artistNodes.push(<li className="artist-spacer" key="top-spacer"></li>);

      this.props.artists.forEach(function(artist) {
        artistNodes.push (
          <li className={className} ref={artist._id} key={artist._id} onMouseEnter={this.handleMouseEnter.bind(this, artist)}>
            <div className="small-9 columns">
              <h4>{artist.name}</h4>
            </div>
            <div className="small-3 columns">
              <a href="#" className="button tiny radius ghost" ref={"watch-" + artist._id} onClick={this.handleClickWatch.bind(this, artist)}>Watch</a>
            </div>
          </li>
        );

        // Each artist list item after the first should not have the active class
        className = "artist";
        numArtists++;
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
            <ReleaseList numArtists={numArtists} releases={this.state.releases}/>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = ArtistSelector;
