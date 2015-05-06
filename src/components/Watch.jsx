"use strict";

var React = require("react");
var request = require("superagent");
var ArtistSelector = require("./watch/ArtistSelector.jsx");

var Watch = React.createClass({

  getInitialState: function() {
    return {
      artists: []
    };
  },

  startSearchingAnimation: function() {
    this.stopSearchingAnimation();
    this.searchAnimationInterval = setInterval(function() {
      var maxLength = $(".input-artist").outerWidth();
      var currentLength = parseFloat($(".loading-svg-line").attr("x2"));
      var newLength = currentLength + maxLength / 100;
      if (newLength > maxLength) {
        newLength = newLength - maxLength;
      }
      $(".loading-svg-line").attr("x2", newLength);
    }, 10);
  },

  stopSearchingAnimation: function(reset) {
    if (this.searchAnimationInterval) {
      clearInterval(this.searchAnimationInterval);
    }
    if (reset) {
      $(".loading-svg-line").attr("x2", 0);
    }
  },

  handleChange: function() {
    if (this.getArtistTimeout) {
      clearTimeout(this.getArtistTimeout);
    }

    var name = this.refs.searchInput.getDOMNode().value.trim();

    if (name.length >= 3) {
      this.getArtistTimeout = setTimeout(function() {
        this.startSearchingAnimation();
        request.get("/api/artist/search")
          .query({ name: name })
          .end(this.renderArtists);
      }.bind(this), 500);
    } else {
      this.getArtistTimeout = setTimeout(function() {
        this.clearArtists();
      }.bind(this), 500);
    }
  },

  renderArtists: function(err, response) {
    this.stopSearchingAnimation(true);
    if (response.ok) {
      this.setState({ artists: response.body });
    }
  },

  clearArtists: function() {
    this.setState({ artists: [] });
  },

  render: function() {
    return (
      <div className="watch">
        <div className="row artist-search">
          <form>
            <div className="small-12 large-10 large-centered columns">
              <input type="text" className="input-artist" placeholder="Who's your favorite artist?" autoFocus="true" 
                  ref="searchInput" onChange={this.handleChange}/>
              <svg className="loading-svg" height="1" width="100%">
                <line className="loading-svg-line" x1="0" y1="0" x2="0" y2="0"/>
              </svg>
            </div>
          </form>
        </div>
        <ArtistSelector artists={this.state.artists}/>
      </div>
    );
  }
});

module.exports = Watch;
