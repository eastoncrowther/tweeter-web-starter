import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface GetFolloweesResponse extends TweeterResponse {
  followees: UserDto[];
  hasMorePages: boolean;
}
