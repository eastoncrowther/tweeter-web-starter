import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface GetFolloweesRequest extends TweeterRequest {
  userAlias: string;
  pageSize: number;
  lastItem: UserDto | null;
}
