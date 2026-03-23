import { RegisterRequest, AuthResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: any): Promise<any> => {
  try {
    const body = JSON.parse(event.body);
    const request = body as RegisterRequest;
    if (!request.alias || !request.password || !request.firstName || !request.lastName || !request.userImageBytes || !request.imageFileExtension) {
      throw new Error("[Bad Request] Missing required fields");
    }


    const userService = new UserService();
    const [user, authToken] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBytes,
      request.imageFileExtension
    );

    const responseData: AuthResponse = {
      success: true,
      message: null,
      user: user,
      authToken: authToken,
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
