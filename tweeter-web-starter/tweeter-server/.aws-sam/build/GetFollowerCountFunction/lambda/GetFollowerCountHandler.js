"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
// Note: We change the input to `event: any` because API Gateway passes an event object, 
// not your custom request object.
const handler = async (event) => {
    try {
        // 1. Parse the stringified JSON body from the API Gateway event
        const body = JSON.parse(event.body);
        const request = body;
        // 2. Execute your business logic
        const followService = new FollowService_1.FollowService();
        const count = await followService.getFollowerCount(request.token, request.user);
        // 3. Construct your domain response
        const responseData = {
            success: true,
            message: null,
            followerCount: count,
        };
        // 4. Return the specific structure API Gateway requires
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Essential so your React local server can talk to AWS
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(responseData),
        };
    }
    catch (error) {
        console.error("Handler failed:", error);
        // Return a structured error response if something crashes
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                success: false,
                message: "Internal server error occurred.",
            }),
        };
    }
};
exports.handler = handler;
