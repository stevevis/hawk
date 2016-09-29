"use strict";

import logger from "../../config/logger";
import User from "../../models/User";

class UserFeedController {
  get name() {
    return "user_feed";
  }

  get path() {
    return "/api/user/:userId/feed";
  }

  get methods() {
    return [ "GET" ];
  }

  get isSecure() {
    return true;
  }

  /**
   * Get a user's feed
   * GET /api/user/:userId/feed[?limit=<limit>][&page=<page>]
   */
  * get() {
    let page = this.request.query.page ? parseInt(this.request.query.page) : 1;
    let limit = this.request.query.limit ? parseInt(this.request.query.limit) : 20;
    logger.info("Requested user %s feed page %d limit %d", this.params.userId, page, limit);

    this.body = yield User.getUserFeedById(this.params.userId, page, limit);
    this.status = 200;
  }
}

export default new UserFeedController();
