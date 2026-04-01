import { PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../model/dao/dynamo/DynamoDAOFactory";

export const handler = async (event: any): Promise<any> => {
  try {
    const body = JSON.parse(event.body);
    const request = body as PostStatusRequest;
    if (!request.token || !request.post || !request.userAlias || !request.timestamp) {
      throw new Error("[Bad Request] Missing required fields");
    }

    const statusService = new StatusService(new DynamoDAOFactory());
    await statusService.postStatus(request.token, request.post, request.userAlias, request.timestamp);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ success: true, message: null }),
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
