import { GetFollowersRequest, GetFollowersResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: any): Promise<any> => {
  try {
    const body = JSON.parse(event.body);
    const request = body as GetFollowersRequest;
    if (!request.token || !request.userAlias || !request.pageSize) {
      throw new Error("[Bad Request] Missing required fields");
    }


    const followService = new FollowService();
    const [followers, hasMorePages] = await followService.getFollowers(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem
    );

    const responseData: GetFollowersResponse = {
      success: true,
      message: null,
      followers: followers,
      hasMorePages: hasMorePages,
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
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: false,
          message: error.message,
        }),
      };
    }

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
