import { IDAOFactory } from "../IDAOFactory";
import { IUserDAO } from "../IUserDAO";
import { IFollowDAO } from "../IFollowDAO";
import { IStoryDAO } from "../IStoryDAO";
import { IFeedDAO } from "../IFeedDAO";
import { IAuthTokenDAO } from "../IAuthTokenDAO";
import { IS3DAO } from "../IS3DAO";

import { DynamoUserDAO } from "./DynamoUserDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStoryDAO } from "./DynamoStoryDAO";
import { DynamoFeedDAO } from "./DynamoFeedDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { S3ImageDAO } from "./S3ImageDAO";

export class DynamoDAOFactory implements IDAOFactory {
  getUserDAO(): IUserDAO {
    return new DynamoUserDAO();
  }

  getFollowDAO(): IFollowDAO {
    return new DynamoFollowDAO();
  }

  getStoryDAO(): IStoryDAO {
    return new DynamoStoryDAO();
  }

  getFeedDAO(): IFeedDAO {
    return new DynamoFeedDAO();
  }

  getAuthTokenDAO(): IAuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  getS3DAO(): IS3DAO {
    return new S3ImageDAO();
  }
}
