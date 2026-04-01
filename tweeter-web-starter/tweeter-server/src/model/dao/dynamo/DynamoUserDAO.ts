import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IUserDAO, UserRecord } from "../IUserDAO";

const TABLE_NAME = "users";
const REGION = "us-east-1";

export class DynamoUserDAO implements IUserDAO {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: REGION })
    );
  }

  async putUser(user: UserRecord): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          alias: user.alias,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          passwordHash: user.passwordHash,
        },
      })
    );
  }

  async getUser(alias: string): Promise<UserRecord | undefined> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
      })
    );

    if (!result.Item) {
      return undefined;
    }

    return {
      alias: result.Item.alias,
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      imageUrl: result.Item.imageUrl,
      passwordHash: result.Item.passwordHash,
    };
  }
}
