import {
  GetFollowerCountRequest,
  GetFollowerCountResponse,
  GetFolloweeCountRequest,
  GetFolloweeCountResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  FollowRequest,
  FollowResponse,
  User,
  AuthToken,
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

  public async login(
    request: LoginRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthResponse
    >(request, "/login");

    if (response.success) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.authToken);

      if (user == null) {
        throw new Error("No user returned");
      }
      if (authToken == null) {
        throw new Error("No auth token returned");
      }

      return [user, authToken];
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }

  public async register(
    request: RegisterRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthResponse
    >(request, "/register");

    if (response.success) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.authToken);

      if (user == null) {
        throw new Error("No user returned");
      }
      if (authToken == null) {
        throw new Error("No auth token returned");
      }

      return [user, authToken];
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }

  public async follow(
    request: FollowRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }

  public async unfollow(
    request: FollowRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }
}
