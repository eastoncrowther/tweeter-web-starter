import { PagedStatusRequest, PagedStatusResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../model/dao/dynamo/DynamoDAOFactory";

export const handler = async (event: any): Promise<any> => {
  try {
    const body = JSON.parse(event.body);
    const request = body as PagedStatusRequest;
    if (!request.token || !request.userAlias || !request.pageSize) {
      throw new Error("[Bad Request] Missing required fields");
    }

    const statusService = new StatusService(new DynamoDAOFactory());
    const [statuses, hasMorePages] = await statusService.loadMoreStoryItems(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem
    );

    const responseData: PagedStatusResponse = {
      success: true,
      message: null,
      statuses: statuses,
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
