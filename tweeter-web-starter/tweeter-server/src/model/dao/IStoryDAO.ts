export interface StoryRecord {
  senderAlias: string;
  timestamp: number;
  post: string;
}

export interface IStoryDAO {
  putStory(record: StoryRecord): Promise<void>;
  getStoryPage(
    senderAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<{ items: StoryRecord[]; hasMore: boolean }>;
}
