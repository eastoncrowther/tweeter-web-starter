import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IStoryDAO, StoryRecord } from "../IStoryDAO";

const TABLE_NAME = "story";
const REGION = "us-east-1";

export class DynamoStoryDAO implements IStoryDAO {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: REGION })
    );
  }

  async putStory(record: StoryRecord): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          sender_alias: record.senderAlias,
          timestamp: record.timestamp,
          post: record.post,
        },
      })
    );
  }

  async getStoryPage(
    senderAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<{ items: StoryRecord[]; hasMore: boolean }> {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "sender_alias = :sender",
      ExpressionAttributeValues: {
        ":sender": senderAlias,
      },
      Limit: pageSize,
      ScanIndexForward: false, // newest first
    };

    if (lastTimestamp !== undefined) {
      params.ExclusiveStartKey = {
        sender_alias: senderAlias,
        timestamp: lastTimestamp,
      };
    }

    const result = await this.client.send(new QueryCommand(params));
    const items: StoryRecord[] = (result.Items || []).map((item) => ({
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
