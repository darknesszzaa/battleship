import { AttackModel } from '../model/attack.model';
import { PlayerModel } from '../model/player.model';
import { ShipModel } from '../model/ship.model';
import { BaseDto } from './base.dto';

export class GameDto extends BaseDto {
  public gameId: string;
  public ship: ShipModel[];
  public totalMove: number;
  public attack: AttackModel[];
  public isCompleted: boolean;
  public isConfirmShipPlacement: boolean;
  public player: PlayerModel[];

  constructor() {
    super();
    this._mapper = {
      'gameId': '_id',
      'ship[].shipId': 'ship[]._id',
      'ship[].x': 'ship[].x',
      'ship[].y': 'ship[].y',
      'ship[].isPlace': 'ship[].isPlace',
      'ship[].isSunk': 'ship[].isSunk',
      'ship[].rotate': 'ship[].rotate',
      'ship[].shipType': 'ship[].shipType',
      'ship[].size': 'ship[].size',
      'totalMove': 'totalMove',
      'attack': 'attack',
      'isConfirmShipPlacement': 'isConfirmShipPlacement',
      'isCompleted': 'isCompleted',
      'player[].name': 'player[].name',
      'player[].role': 'player[].role',
    };
  }
}
