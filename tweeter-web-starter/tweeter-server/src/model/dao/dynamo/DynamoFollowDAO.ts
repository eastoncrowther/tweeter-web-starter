import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IFollowDAO } from "../IFollowDAO";

const TABLE_NAME = "follows";
const INDEX_NAME = "follows_index";
const REGION = "us-east-1";

export class DynamoFollowDAO implements IFollowDAO {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: REGION })
    );
  }

  async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
  }

  async deleteFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
  }

  async getFollow(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
    return !!result.Item;
  }

  async getFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias?: string
  ): Promise<{ aliases: string[]; hasMore: boolean }> {
    const params: any = {
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      KeyConditionExpression: "followee_handle = :followee",
      ExpressionAttributeValues: {
        ":followee": followeeAlias,
      },
      Limit: pageSize,
    };

    if (lastFollowerAlias) {
      params.ExclusiveStartKey = {
        followee_handle: followeeAlias,
        follower_handle: lastFollowerAlias,
      };
    }

    const result = await this.client.send(new QueryCommand(params));
    const aliases = (result.Items || []).map(
      (item) => item.follower_handle as string
    );
    return {
      aliases,
      hasMore: !!result.LastEvaluatedKey,
    };
  }

  async getFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias?: string
  ): Promise<{ aliases: string[]; hasMore: boolean }> {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "follower_handle = :follower",
      ExpressionAttributeValues: {
        ":follower": followerAlias,
      },
      Limit: pageSize,
    };

    if (lastFolloweeAlias) {
      params.ExclusiveStartKey = {
        follower_handle: followerAlias,
        followee_handle: lastFolloweeAlias,
      };
    }

    const result = await this.client.send(new QueryCommand(params));
    const aliases = (result.Items || []).map(
      (item) => item.followee_handle as string
    );
    return {
      aliases,
      hasMore: !!result.LastEvaluatedKey,
    };
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: INDEX_NAME,
        KeyConditionExpression: "followee_handle = :followee",
        ExpressionAttributeValues: {
          ":followee": followeeAlias,
        },
        Select: "COUNT",
      })
    );
    return result.Count || 0;
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "follower_handle = :follower",
        ExpressionAttributeValues: {
          ":follower": followerAlias,
        },
        Select: "COUNT",
      })
    );
    return result.Count || 0;
  }
}
