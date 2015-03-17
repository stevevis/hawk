"use strict";

var React = require("react");
var FeedItem = require("./feed/FeedItem.jsx");
var FeedStore = require("../stores/FeedStore");
var FeedActions = require("../actions/FeedActions");

var Feed = React.createClass({
  getInitialState: function() {
    var feed;

    if (!FeedStore.isInitialized() && this.props.feed) {
      FeedActions.getFeedSuccess(1, this.props.feed);
      feed = this.props.feed;
    } else {
      feed = FeedStore.getFeed();
    }

    return { feed: feed };
  },

  componentDidMount: function() {
    FeedStore.addChangeListener(this.onFeedChange);
  },

  render: function() {
    return (
      <div className="feed">
        <div className="row">
          <div className="small-12 medium-10 large-9 medium-centered columns">
            <ul>
              {this.state.feed.map(function(item) {
                 return <FeedItem key={item.rid} data={item}/>;
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  },

  onFeedChange: function() {
    this.setState({ feed: FeedStore.getFeed() });
  }
});

module.exports = Feed;
