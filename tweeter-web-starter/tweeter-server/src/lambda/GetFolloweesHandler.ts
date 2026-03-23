import { GetFolloweesRequest, GetFolloweesResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: any): Promise<any> => {
  try {
    const body = JSON.parse(event.body);
    const request = body as GetFolloweesRequest;

    const followService = new FollowService();
    const [followees, hasMorePages] = await followService.getFollowees(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem
    );

    const responseData: GetFolloweesResponse = {
      success: true,
      message: null,
      followees: followees,
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
