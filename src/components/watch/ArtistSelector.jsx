"use strict";

var React = require("react");
var ReleaseList = require("./ReleaseList.jsx");
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
    var button = $(this.refs["watch-" + artist._id].getDOMNode());
    var watching = button.hasClass("watching");

    if (watching) {
      UserActions.unwatchArtist(artist._id);
      button.html("Watch");
      button.removeClass("watching");
    } else {
      UserActions.watchArtist(artist._id);
      button.html("Un-watch");
      button.addClass("watching");
    }
  },

  render: function() {
    var errorMessage = "";
    var artistElements = [];
    // Give the first artist list item the active class
    var className = "artist active";

    if (this.props.artists.length > 0) {
      artistElements.push(<li className="artist-spacer" key="top-spacer"></li>);

      this.props.artists.forEach(function(artist) {
        var buttonText = "Watch";
        var buttonClasses = "button tiny radius ghost";
        if (artist.watching) {
          buttonText = "Un-watch";
          buttonClasses += " watching";
        }

        artistElements.push (
          <li className={className} ref={artist._id} key={artist._id} onMouseEnter={this.handleMouseEnter.bind(this, artist)}>
            <div className="small-9 columns">
              <h4>{artist.name}</h4>
            </div>
            <div className="small-3 columns">
              <a href="#" className={buttonClasses} ref={"watch-" + artist._id} onClick={this.handleClickWatch.bind(this, artist)}>
                {buttonText}
              </a>
            </div>
          </li>
        );

        // Each artist list item after the first should not have the active class
        className = "artist";
      }.bind(this));

      artistElements.push(<li className="artist-spacer" key="bottom-spacer"></li>); 
    } else {
      errorMessage = ( <h6 className="text-center">No results to show</h6> );
    }

    return (
      <div className="artist-selector">
        <div className="row">
          {errorMessage}
          <div className="small-6 columns">
            <ul className="artist-list">
              {artistElements}
            </ul>
          </div>
          <div className="small-6 columns">
            <ReleaseList releases={this.state.releases}/>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = ArtistSelector;
