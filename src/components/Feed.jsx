"use strict";

var React = require("react");
var FeedItem = require("./feed/FeedItem.jsx");
var FeedStore = require("../stores/FeedStore");
var FeedActions = require("../actions/FeedActions");

// When the user scrolls down to this many pixels from the bottom of the page, load more feed items.
var WINDOW_Y_OFFSET_LOAD_MORE = 200;

var Feed = React.createClass({
  getInitialState: function() {
    var feed;

    if (!FeedStore.isInitialized() && this.props.feed) {
      FeedActions.getFeedSuccess(1, this.props.feed);
      feed = this.props.feed;
    } else {
      feed = FeedStore.getFeed();
    }

    return {
      feed: feed
    };
  },

  componentDidMount: function() {
    FeedStore.addChangeListener(this._onFeedChange);
    window.addEventListener("scroll", this._handleScroll);
  },

  componentWillUnmount: function() {
    FeedStore.removeChangeListener(this._onFeedChange);
    window.removeEventListener("scroll", this._handleScroll);
  },

  _onFeedChange: function() {
    this.setState({
      updating: false,
      feed: FeedStore.getFeed()
    });
  },

  _handleScroll: function() {
    if (window.pageYOffset + window.innerHeight + WINDOW_Y_OFFSET_LOAD_MORE > $(".feed").outerHeight() &&
        FeedStore.getNextPageNumber() && !this.state.updating) {
      this.state.updating = true;
      FeedActions.getFeed(FeedStore.getNextPageNumber(), FeedStore.getPageSize());
    }
  },

  render: function() {
    var errorMessage;
    if (this.state.feed.length < 1) {
      errorMessage = ( <h6 className="feed-error text-center">You're not watching any artists!</h6> );
    }

    return (
      <div className="feed">
        <div className="row">
          {errorMessage}
          <div className="small-12 medium-10 large-9 medium-centered columns">
            <ul>
              {this.state.feed.map(function(item) {
                return (
                  <div className="row" key={item.rid}>
                    <FeedItem data={item}/>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Feed;
