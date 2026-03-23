import { PagedStatusRequest, PagedStatusResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: any): Promise<any> => {
  try {
    const body = JSON.parse(event.body);
    const request = body as PagedStatusRequest;

    const statusService = new StatusService();
    const [statuses, hasMorePages] = await statusService.loadMoreFeedItems(
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
