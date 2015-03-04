"use strict";

var React = require("react");

var Track = React.createClass({
  handleChange: function() {
    console.log(this.refs.artistInput.getDOMNode().value);
  },
  render: function() {
    return (
      <div className="add-artist">
        <div className="row">
          <form>
            <div className="small-12 large-10 large-centered columns">
              <input type="text" className="input-artist" placeholder="Who's your favorite artist?" autoFocus="true" 
                  onChange={this.handleChange} ref="artistInput" />
            </div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = Track;
