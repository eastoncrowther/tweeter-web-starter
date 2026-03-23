import { AuthToken, FakeData, User, GetFollowerCountRequest, GetFolloweeCountRequest, FollowRequest, GetFollowersRequest, IsFollowerRequest, GetFolloweesRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "./net/ServerFacade";

export class FollowService implements Service {
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const request: GetFolloweesRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return new ServerFacade().loadMoreFollowees(request);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const request: GetFollowersRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return new ServerFacade().loadMoreFollowers(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    const request: IsFollowerRequest = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };
    return new ServerFacade().getIsFollowerStatus(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const request: GetFolloweeCountRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return new ServerFacade().getFolloweeCount(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const request: GetFollowerCountRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return new ServerFacade().getFollowerCount(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      user: userToFollow.dto,
    };
    return new ServerFacade().follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      user: userToUnfollow.dto,
    };
    return new ServerFacade().unfollow(request);
  }
}
