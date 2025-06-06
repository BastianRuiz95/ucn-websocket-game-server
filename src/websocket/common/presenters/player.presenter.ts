import { EPlayerStatus } from '../enums';

export interface PlayerPresenter {
  id: string;
  name: string;
  status: EPlayerStatus;
}
