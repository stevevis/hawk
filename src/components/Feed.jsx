"use strict";

import React from "react";
import FeedItem from "./feed/FeedItem.jsx";
import FeedStore from "../stores/FeedStore";
import FeedActions from "../actions/FeedActions";

// When the user scrolls down to this many pixels from the bottom of the page, load more feed items.
var WINDOW_Y_OFFSET_LOAD_MORE = 200;

class Feed extends React.Component {

  constructor() {
    super();

    this._getOrInitializeFeed = this._getOrInitializeFeed.bind(this);
    this._onFeedChange = this._onFeedChange.bind(this);
    this._handleScroll = this._handleScroll.bind(this);

    this.state = { feed: []};
  }

  componentWillMount() {
    this.setState(this._getOrInitializeFeed());
  }

  componentDidMount() {
    FeedStore.addChangeListener(this._onFeedChange);
    window.addEventListener("scroll", this._handleScroll);
  }

  componentWillUnmount() {
    FeedStore.removeChangeListener(this._onFeedChange);
    window.removeEventListener("scroll", this._handleScroll);
  }

  _getOrInitializeFeed() {
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
  }

  _onFeedChange() {
    this.setState({
      updating: false,
      feed: FeedStore.getFeed()
    });
  }

  _handleScroll() {
    if (window.pageYOffset + window.innerHeight + WINDOW_Y_OFFSET_LOAD_MORE > $(".feed").outerHeight() &&
        FeedStore.getNextPageNumber() && !this.state.updating) {
      this.state.updating = true;
      FeedActions.getFeed(FeedStore.getNextPageNumber(), FeedStore.getPageSize());
    }
  }

  render() {
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
}

Feed.propTypes = {
  feed: React.PropTypes.array
};

export default Feed;
