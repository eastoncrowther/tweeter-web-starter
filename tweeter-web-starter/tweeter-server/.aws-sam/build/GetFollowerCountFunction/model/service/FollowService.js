"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async getFollowerCount(token, user) {
        // For milestone 3, we just return the dummy data here
        return tweeter_shared_1.FakeData.instance.getFollowerCount(user.alias);
    }
}
exports.FollowService = FollowService;
