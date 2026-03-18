import { TweeterResponse } from "./TweeterResponse";

export interface GetFollowerCountResponse extends TweeterResponse {
  followerCount: number;
}
