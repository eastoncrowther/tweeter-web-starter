import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../model/dao/dynamo/DynamoDAOFactory";

export const handler = async (event: any): Promise<any> => {
  try {
    const body = JSON.parse(event.body);
    const request = body as FollowRequest;
    if (!request.token || !request.user) {
      throw new Error("[Bad Request] Missing required fields");
    }

    const followService = new FollowService(new DynamoDAOFactory());
    const [followerCount, followeeCount] = await followService.unfollow(request.token, request.user);

    const responseData: FollowResponse = {
      success: true,
      message: null,
      followerCount: followerCount,
      followeeCount: followeeCount,
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(responseData),
    };

  } catch (error) {
    console.error("Handler failed:", error);

    if (error instanceof Error && error.message.includes("[Bad Request]")) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, message: error.message }),
      };
    }

    if (error instanceof Error && error.message.includes("[Unauthorized]")) {
      return {
        statusCode: 403,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, message: error.message }),
      };
    }

    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, message: "Internal server error occurred." }),
    };
  }
};
