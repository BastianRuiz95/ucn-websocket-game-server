import { EWsPlayerStatus } from "../enums";

export interface Player {
  id: string;
  name: string;
  status: EWsPlayerStatus;
}
