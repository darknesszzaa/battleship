import { AttackModel } from '../model/attack.model';
import { BaseDto } from './base.dto';
import { ShipNewGameModel } from '../model/ship-newgame.model';

export class NewGameDto extends BaseDto {
  public gameId: string;
  public ship: ShipNewGameModel[];
  public totalMove: number;
  public attack: AttackModel[];
  public isCompleted: boolean;
  public isConfirmShipPlacement: boolean;

  constructor() {
    super();
    this._mapper = {
      'gameId': '_id',
      'isConfirmShipPlacement': 'isConfirmShipPlacement',
      'isCompleted': 'isCompleted',
      'ship[].shipId': 'ship[]._id',
      'ship[].isPlace': 'ship[].isPlace',
      'ship[].shipType': 'ship[].shipType',
      'ship[].size': 'ship[].size',
    };
  }
}
