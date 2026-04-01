export interface IFollowDAO {
  putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getFollow(followerAlias: string, followeeAlias: string): Promise<boolean>;
  getFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias?: string
  ): Promise<{ aliases: string[]; hasMore: boolean }>;
  getFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias?: string
  ): Promise<{ aliases: string[]; hasMore: boolean }>;
  getFollowerCount(followeeAlias: string): Promise<number>;
  getFolloweeCount(followerAlias: string): Promise<number>;
}
