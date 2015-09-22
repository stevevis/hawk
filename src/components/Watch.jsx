"use strict";

import React from "react";
import request from "superagent";
import ArtistSelector from "./watch/ArtistSelector.jsx";

class Watch extends React.Component {

  constructor() {
    super();

    this._startSearchingAnimation = this._startSearchingAnimation.bind(this);
    this._stopSearchingAnimation = this._stopSearchingAnimation.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._renderArtists = this._renderArtists.bind(this);
    this._clearArtists = this._clearArtists.bind(this);

    this.state = { artists: []};
  }

  _startSearchingAnimation() {
    this._stopSearchingAnimation();
    this.searchAnimationInterval = setInterval(function() {
      var maxLength = $(".input-artist").outerWidth();
      var currentLength = parseFloat($(".loading-svg-line").attr("x2"));
      var newLength = currentLength + maxLength / 100;
      if (newLength > maxLength) {
        newLength = newLength - maxLength;
      }
      $(".loading-svg-line").attr("x2", newLength);
    }, 10);
  }

  _stopSearchingAnimation(reset) {
    if (this.searchAnimationInterval) {
      clearInterval(this.searchAnimationInterval);
    }
    if (reset) {
      $(".loading-svg-line").attr("x2", 0);
    }
  }

  _handleChange() {
    if (this.getArtistTimeout) {
      clearTimeout(this.getArtistTimeout);
    }

    var name = this.refs.searchInput.getDOMNode().value.trim();

    if (name.length >= 3) {
      this.getArtistTimeout = setTimeout(function() {
        this._startSearchingAnimation();
        request.get("/api/artist/search")
          .query({ name: name })
          .end(this._renderArtists);
      }.bind(this), 500);
    } else {
      this.getArtistTimeout = setTimeout(function() {
        this.clearArtists();
      }.bind(this), 500);
    }
  }

  _renderArtists(err, response) {
    this._stopSearchingAnimation(true);
    if (response.ok) {
      this.setState({ artists: response.body });
    }
  }

  _clearArtists() {
    this.setState({ artists: []});
  }

  render() {
    return (
      <div className="watch">
        <div className="row artist-search">
          <form>
            <div className="small-12 large-10 large-centered columns">
              <input type="text" className="input-artist" placeholder="Who's your favorite artist?" autoFocus="true"
                  ref="searchInput" onChange={this._handleChange}/>
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
}

export default Watch;
