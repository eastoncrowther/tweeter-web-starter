import { TweeterResponse } from "./TweeterResponse";
import { StatusDto } from "../../dto/StatusDto";

export interface PagedStatusResponse extends TweeterResponse {
  statuses: StatusDto[];
  hasMorePages: boolean;
}
