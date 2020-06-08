import { IGame } from '../http/models/game';

export interface IModels {
  gameModel: IGame;
}

export default interface IController {
  models: Array<IModels>;
}
