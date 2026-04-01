import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IFeedDAO, FeedRecord } from "../IFeedDAO";

const TABLE_NAME = "feed";
const REGION = "us-east-1";
const BATCH_SIZE = 25;

export class DynamoFeedDAO implements IFeedDAO {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: REGION })
    );
  }

  async putFeedBatch(records: FeedRecord[]): Promise<void> {
    // DynamoDB BatchWrite is limited to 25 items per call
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const writeRequests = batch.map((record) => ({
        PutRequest: {
          Item: {
            receiver_alias: record.receiverAlias,
            timestamp: record.timestamp,
            sender_alias: record.senderAlias,
            post: record.post,
          },
        },
      }));

      await this.client.send(
        new BatchWriteCommand({
          RequestItems: {
            [TABLE_NAME]: writeRequests,
          },
        })
      );
    }
  }

  async getFeedPage(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<{ items: FeedRecord[]; hasMore: boolean }> {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "receiver_alias = :receiver",
      ExpressionAttributeValues: {
        ":receiver": receiverAlias,
      },
      Limit: pageSize,
      ScanIndexForward: false, // newest first
    };

    if (lastTimestamp !== undefined) {
      params.ExclusiveStartKey = {
        receiver_alias: receiverAlias,
        timestamp: lastTimestamp,
      };
    }

    const result = await this.client.send(new QueryCommand(params));
    const items: FeedRecord[] = (result.Items || []).map((item) => ({
      receiverAlias: item.receiver_alias as string,
      senderAlias: item.sender_alias as string,
      timestamp: item.timestamp as number,
      post: item.post as string,
    }));

    return {
      items,
      hasMore: !!result.LastEvaluatedKey,
    };
  }
}
