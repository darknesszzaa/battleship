import { AttackModel } from '../model/attack.model';
import { ShipModel } from '../model/ship.model';
import { BaseDto } from './base.dto';

export class GameDto extends BaseDto {
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
      'isConfirmShipPlacement': 'isConfirmShipPlacement',
      'isCompleted': 'isCompleted',
      'ship[].shipId': 'ship[]._id',
      'ship[].x': 'ship[].x',
      'ship[].y': 'ship[].y',
      'ship[].isPlace': 'ship[].isPlace',
      'ship[].rotate': 'ship[].rotate',
      'ship[].shipType': 'ship[].shipType',
      'ship[].size': 'ship[].size',
    };
  }
}
