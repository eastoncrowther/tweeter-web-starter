import { IUserDAO } from "./IUserDAO";
import { IFollowDAO } from "./IFollowDAO";
import { IStoryDAO } from "./IStoryDAO";
import { IFeedDAO } from "./IFeedDAO";
import { IAuthTokenDAO } from "./IAuthTokenDAO";
import { IS3DAO } from "./IS3DAO";

export interface IDAOFactory {
  getUserDAO(): IUserDAO;
  getFollowDAO(): IFollowDAO;
  getStoryDAO(): IStoryDAO;
  getFeedDAO(): IFeedDAO;
  getAuthTokenDAO(): IAuthTokenDAO;
  getS3DAO(): IS3DAO;
}
