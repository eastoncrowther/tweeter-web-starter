import { TweeterRequest } from "./TweeterRequest";

export interface PostStatusRequest extends TweeterRequest {
  post: string;
  userAlias: string;
  timestamp: number;
}
