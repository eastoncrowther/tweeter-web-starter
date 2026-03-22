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
}
