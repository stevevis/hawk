"use strict";

var React = require("react");
var CoverImage = require("../shared/CoverImage.jsx");
var ReleaseDate = require("../shared/ReleaseDate.jsx");

var FeedItem = React.createClass({
  render: function() {
    var item = this.props.data;
    return (
      <div className="feed-item row">
        <div className="small-4 medium-3 columns">
          <CoverImage src={item.cover}/>
        </div>
        <div className="small-8 medium-9 columns">
          <h4>{item.rname}</h4>
          <h5>{item.aname}</h5>
          <div className="show-for-medium-up">
            <ReleaseDate year={item.year} month={item.month} day={item.day}/>
          </div>
          {/*<ul className="inline-list">
            <li><a href="#">Love it</a></li>
            <li><a href="#">Got it</a></li>
            <li><a href="#">Want it</a></li>
            <li><a href="#">Hide it</a></li>
          </ul>*/}
        </div>
      </div>
    );
  }
});

module.exports = FeedItem;
