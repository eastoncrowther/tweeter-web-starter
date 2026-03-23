import { TweeterRequest } from "./TweeterRequest";
import { StatusDto } from "../../dto/StatusDto";

export interface PagedStatusRequest extends TweeterRequest {
  userAlias: string;
  pageSize: number;
  lastItem: StatusDto | null;
}
