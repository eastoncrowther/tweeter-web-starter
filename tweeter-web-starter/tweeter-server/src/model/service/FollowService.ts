import { FakeData, UserDto } from "tweeter-shared";

export class FollowService {
  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    // For milestone 3, we just return the dummy data here
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    // For milestone 3, we just return the dummy data here
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async follow(token: string, user: UserDto): Promise<[number, number]> {
    // For milestone 3, we just return the dummy counts
    const followerCount = await this.getFollowerCount(token, user);
    const followeeCount = await this.getFolloweeCount(token, user);
    return [followerCount, followeeCount];
  }

  public async unfollow(token: string, user: UserDto): Promise<[number, number]> {
    // For milestone 3, we just return the dummy counts
    const followerCount = await this.getFollowerCount(token, user);
    const followeeCount = await this.getFolloweeCount(token, user);
    return [followerCount, followeeCount];
  }

  public async isFollower(token: string, user: UserDto, selectedUser: UserDto): Promise<boolean> {
    // For milestone 3, dummy response
    return FakeData.instance.isFollower();
  }

  public async getFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
      lastItem ? FakeData.instance.findUserByAlias(lastItem.alias) : null,
      pageSize,
      userAlias
    );
    const userDtos = users.map(u => u.dto);
    return [userDtos, hasMore];
  }

  public async getFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
      lastItem ? FakeData.instance.findUserByAlias(lastItem.alias) : null,
      pageSize,
      userAlias
    );
    const userDtos = users.map(u => u.dto);
    return [userDtos, hasMore];
  }
}
