import { GetFolloweeCountRequest, GetFolloweeCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

// Note: We change the input to `event: any` because API Gateway passes an event object, 
// not your custom request object.
export const handler = async (event: any): Promise<any> => {
  try {
    // 1. Parse the stringified JSON body from the API Gateway event
    const body = JSON.parse(event.body);
    const request = body as GetFolloweeCountRequest;
    if (!request.token || !request.user) {
      throw new Error("[Bad Request] Missing required fields");
    }
 

    // 2. Execute your business logic
    const followService = new FollowService();
    const count = await followService.getFolloweeCount(request.token, request.user);

    // 3. Construct your domain response
    const responseData: GetFolloweeCountResponse = {
      success: true,
      message: null,
      followeeCount: count,
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
