export interface FeedRecord {
  receiverAlias: string;
  senderAlias: string;
  timestamp: number;
  post: string;
}

export interface IFeedDAO {
  putFeedBatch(records: FeedRecord[]): Promise<void>;
  getFeedPage(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<{ items: FeedRecord[]; hasMore: boolean }>;
}
