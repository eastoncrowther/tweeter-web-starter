import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface GetFollowersResponse extends TweeterResponse {
  followers: UserDto[];
  hasMorePages: boolean;
}
