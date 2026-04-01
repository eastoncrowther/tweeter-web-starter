import { UserDto } from "tweeter-shared";
import { IDAOFactory } from "../dao/IDAOFactory";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService {
  private daoFactory: IDAOFactory;
  private authService: AuthorizationService;

  constructor(daoFactory: IDAOFactory) {
    this.daoFactory = daoFactory;
    this.authService = new AuthorizationService(daoFactory);
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    await this.authService.validateToken(token);
    const followDAO = this.daoFactory.getFollowDAO();
    return followDAO.getFollowerCount(user.alias);
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    await this.authService.validateToken(token);
    const followDAO = this.daoFactory.getFollowDAO();
    return followDAO.getFolloweeCount(user.alias);
  }

  public async follow(
    token: string,
    user: UserDto
  ): Promise<[number, number]> {
    const currentUserAlias = await this.authService.validateToken(token);
    const followDAO = this.daoFactory.getFollowDAO();

    await followDAO.putFollow(currentUserAlias, user.alias);

    const followerCount = await followDAO.getFollowerCount(user.alias);
    const followeeCount = await followDAO.getFolloweeCount(user.alias);
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    user: UserDto
  ): Promise<[number, number]> {
    const currentUserAlias = await this.authService.validateToken(token);
    const followDAO = this.daoFactory.getFollowDAO();

    await followDAO.deleteFollow(currentUserAlias, user.alias);

    const followerCount = await followDAO.getFollowerCount(user.alias);
    const followeeCount = await followDAO.getFolloweeCount(user.alias);
    return [followerCount, followeeCount];
  }

  public async isFollower(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.authService.validateToken(token);
    const followDAO = this.daoFactory.getFollowDAO();
    return followDAO.getFollow(user.alias, selectedUser.alias);
  }

  public async getFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.validateToken(token);
    const followDAO = this.daoFactory.getFollowDAO();
    const userDAO = this.daoFactory.getUserDAO();

    const result = await followDAO.getFollowers(
      userAlias,
      pageSize,
      lastItem?.alias
    );

    // Hydrate aliases into full UserDtos
    const userDtos: UserDto[] = [];
    for (const alias of result.aliases) {
      const userRecord = await userDAO.getUser(alias);
      if (userRecord) {
        userDtos.push({
          firstName: userRecord.firstName,
          lastName: userRecord.lastName,
          alias: userRecord.alias,
          imageUrl: userRecord.imageUrl,
        });
      }
    }

    return [userDtos, result.hasMore];
  }

  public async getFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.validateToken(token);
    const followDAO = this.daoFactory.getFollowDAO();
    const userDAO = this.daoFactory.getUserDAO();

    const result = await followDAO.getFollowees(
      userAlias,
      pageSize,
      lastItem?.alias
    );

    // Hydrate aliases into full UserDtos
    const userDtos: UserDto[] = [];
    for (const alias of result.aliases) {
      const userRecord = await userDAO.getUser(alias);
      if (userRecord) {
        userDtos.push({
          firstName: userRecord.firstName,
          lastName: userRecord.lastName,
          alias: userRecord.alias,
          imageUrl: userRecord.imageUrl,
        });
      }
    }

    return [userDtos, result.hasMore];
  }
}
