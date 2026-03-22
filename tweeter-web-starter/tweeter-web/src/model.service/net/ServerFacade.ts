import {
  GetFollowerCountRequest,
  GetFollowerCountResponse,
  GetFolloweeCountRequest,
  GetFolloweeCountResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://1luhyw26n8.execute-api.us-east-1.amazonaws.com/Prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getFollowerCount(
    request: GetFollowerCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowerCountRequest,
      GetFollowerCountResponse
    >(request, "/follower/count");

    if (response.success) {
      return response.followerCount;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }

  public async getFolloweeCount(
    request: GetFolloweeCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFolloweeCountRequest,
      GetFolloweeCountResponse
    >(request, "/followee/count");

    if (response.success) {
      return response.followeeCount;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }
}
