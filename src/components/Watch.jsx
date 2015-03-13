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

  handleChange: function() {
    if (this.getArtistTimeout) {
      clearTimeout(this.getArtistTimeout);
    }

    var name = this.refs.artistInput.getDOMNode().value.trim();

    if (name.length >= 3) {
      this.getArtistTimeout = setTimeout(function() {
        request.get("/api/artist")
          .query({ name: name })
          .end(this.renderArtists);
      }.bind(this), 1000);
    }
  },

  renderArtists: function(response) {
    if (response.ok) {
      this.setState({ artists: response.body });
    }
  },

  render: function() {
    return (
      <div className="watch">

        <div className="row">
          <form>
            <div className="small-12 large-10 large-centered columns">
              <input type="text" className="input-artist" placeholder="Who's your favorite artist?" autoFocus="true" 
                  ref="artistInput" onChange={this.handleChange}/>
            </div>
          </form>
        </div>

        <ArtistSelector artists={this.state.artists}/>

      </div>
    );
  }
});

module.exports = Watch;
