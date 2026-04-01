import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IAuthTokenDAO, AuthTokenRecord } from "../IAuthTokenDAO";

const TABLE_NAME = "authtokens";
const REGION = "us-east-1";

export class DynamoAuthTokenDAO implements IAuthTokenDAO {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: REGION })
    );
  }

  async putAuthToken(record: AuthTokenRecord): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          token: record.token,
          alias: record.alias,
          timestamp: record.timestamp,
        },
      })
    );
  }

  async getAuthToken(token: string): Promise<AuthTokenRecord | undefined> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );

    if (!result.Item) {
      return undefined;
    }

    return {
      token: result.Item.token,
      alias: result.Item.alias,
      timestamp: result.Item.timestamp,
    };
  }

  async updateAuthTokenTimestamp(
    token: string,
    timestamp: number
  ): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { token },
        UpdateExpression: "SET #ts = :ts",
        ExpressionAttributeNames: { "#ts": "timestamp" },
        ExpressionAttributeValues: { ":ts": timestamp },
      })
    );
  }

  async deleteAuthToken(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );
  }
}
