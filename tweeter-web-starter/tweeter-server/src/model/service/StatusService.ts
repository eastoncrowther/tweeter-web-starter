import { FakeData } from "tweeter-shared";
import { StatusDto } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const [statuses, hasMorePages] = FakeData.instance.getPageOfStatuses(
      lastItem ? FakeData.instance.findStatusByPost(lastItem.post) : null,
      pageSize
    );
    const dtos = statuses.map(s => s.dto);
    return [dtos, hasMorePages];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // For milestone 3, we just reuse the feed logic
    const [statuses, hasMorePages] = FakeData.instance.getPageOfStatuses(
      lastItem ? FakeData.instance.findStatusByPost(lastItem.post) : null,
      pageSize
    );
    const dtos = statuses.map(s => s.dto);
    return [dtos, hasMorePages];
  }

  public async postStatus(
    token: string,
    post: string,
    userAlias: string,
    timestamp: number
  ): Promise<void> {
    // For milestone 3, this is a no-op
    // In a real implementation, this would save the status to the database
  }
}

