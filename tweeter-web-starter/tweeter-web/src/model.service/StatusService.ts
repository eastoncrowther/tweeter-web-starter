import { AuthToken, Status, FakeData, PostStatusRequest, PagedStatusRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "./net/ServerFacade";

export class StatusService implements Service {
  private readonly serverFacade: ServerFacade;

  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return this.serverFacade.loadMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return this.serverFacade.loadMoreStoryItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      post: newStatus.post,
      userAlias: newStatus.user.alias,
      timestamp: newStatus.timestamp,
    };
    await this.serverFacade.postStatus(request);
  }
}
