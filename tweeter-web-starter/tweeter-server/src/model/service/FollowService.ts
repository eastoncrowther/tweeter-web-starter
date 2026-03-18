import { FakeData, UserDto } from "tweeter-shared";

export class FollowService {
  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    // For milestone 3, we just return the dummy data here
    return FakeData.instance.getFollowerCount(user.alias);
  }
}
