import { AttackModel } from '../model/attack.model';
import { ShipModel } from '../model/ship.model';
import { BaseDto } from './base.dto';

export class GameBoardDto extends BaseDto {
  public gameId: string;
  public ship: ShipModel[];
  public totalMove: number;
  public attack: AttackModel[];
  public isCompleted: boolean;
  public isConfirmShipPlacement: boolean;

  constructor() {
    super();
    this._mapper = {
      'gameId': '_id',
      'totalMove': 'totalMove',
      'isConfirmShipPlacement': 'isConfirmShipPlacement',
      'isCompleted': 'isCompleted',
      'ship[].shipId': 'ship[]._id',
      'ship[].isSunk': 'ship[].isSunk',
      'ship[].shipType': 'ship[].shipType',
      'ship[].size': 'ship[].size',
      'attack[].x': 'attack[].x',
      'attack[].y': 'attack[].y',
      'attack[].isHit': 'attack[].isHit',
    };
  }
}
