import { StatusDto } from "tweeter-shared";
import { IDAOFactory } from "../dao/IDAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import { FeedRecord } from "../dao/IFeedDAO";

export class StatusService {
  private daoFactory: IDAOFactory;
  private authService: AuthorizationService;

  constructor(daoFactory: IDAOFactory) {
    this.daoFactory = daoFactory;
    this.authService = new AuthorizationService(daoFactory);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.validateToken(token);

    const feedDAO = this.daoFactory.getFeedDAO();
    const userDAO = this.daoFactory.getUserDAO();

    const result = await feedDAO.getFeedPage(
      userAlias,
      pageSize,
      lastItem?.timestamp
    );

    // Hydrate each feed item with the sender's user data
    const statusDtos: StatusDto[] = [];
    for (const item of result.items) {
      const userRecord = await userDAO.getUser(item.senderAlias);
      if (userRecord) {
        statusDtos.push({
          post: item.post,
          user: {
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            alias: userRecord.alias,
            imageUrl: userRecord.imageUrl,
          },
          timestamp: item.timestamp,
        });
      }
    }

    return [statusDtos, result.hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.validateToken(token);

    const storyDAO = this.daoFactory.getStoryDAO();
    const userDAO = this.daoFactory.getUserDAO();

    const result = await storyDAO.getStoryPage(
      userAlias,
      pageSize,
      lastItem?.timestamp
    );

    // Hydrate each story item with the user's data
    const statusDtos: StatusDto[] = [];
    for (const item of result.items) {
      const userRecord = await userDAO.getUser(item.senderAlias);
      if (userRecord) {
        statusDtos.push({
          post: item.post,
          user: {
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            alias: userRecord.alias,
            imageUrl: userRecord.imageUrl,
          },
          timestamp: item.timestamp,
        });
      }
    }

    return [statusDtos, result.hasMore];
  }

  public async postStatus(
    token: string,
    post: string,
    userAlias: string,
    timestamp: number
  ): Promise<void> {
    const currentUserAlias = await this.authService.validateToken(token);

    // 1. Write to story table
    const storyDAO = this.daoFactory.getStoryDAO();
    await storyDAO.putStory({
      senderAlias: currentUserAlias,
      timestamp,
      post,
    });

    // 2. Fan out to all followers' feeds
    const followDAO = this.daoFactory.getFollowDAO();
    const feedDAO = this.daoFactory.getFeedDAO();

    // Get ALL followers (paginate through all of them)
    let hasMore = true;
    let lastAlias: string | undefined = undefined;

    while (hasMore) {
      const result = await followDAO.getFollowers(
        currentUserAlias,
        100, // page size for internal pagination
        lastAlias
      );

      if (result.aliases.length > 0) {
        const feedRecords: FeedRecord[] = result.aliases.map((followerAlias) => ({
          receiverAlias: followerAlias,
          senderAlias: currentUserAlias,
          timestamp,
          post,
        }));

        await feedDAO.putFeedBatch(feedRecords);
        lastAlias = result.aliases[result.aliases.length - 1];
      }

      hasMore = result.hasMore;
    }
  }
}
