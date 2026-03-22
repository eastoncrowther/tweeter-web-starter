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
  PostStatusRequest,
  LogoutRequest,
  TweeterResponse,
  GetFollowersRequest,
  GetFollowersResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  GetUserRequest,
  GetUserResponse,
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

  public async postStatus(
    request: PostStatusRequest
  ): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/post");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }

  public async logout(
    request: LogoutRequest
  ): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/logout");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follower/isFollower");

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }

  public async loadMoreFollowers(
    request: GetFollowersRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      GetFollowersRequest,
      GetFollowersResponse
    >(request, "/follower/list");

    if (response.success) {
      const followers = response.followers.map(dto => User.fromDto(dto)!);
      return [followers, response.hasMorePages];
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }

  public async getUser(
    request: GetUserRequest
  ): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get");

    if (response.success) {
      if (response.user) {
        return User.fromDto(response.user);
      } else {
        return null;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred");
    }
  }
}
