import { TweeterResponse } from "./TweeterResponse";

export interface GetFolloweeCountResponse extends TweeterResponse {
  followeeCount: number;
}
