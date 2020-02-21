import { AttackModel } from '../model/attack.model';
import { ShipModel } from '../model/ship.model';
import { BaseDto } from './base.dto';

export class NewGameDto extends BaseDto {
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
      'ship[].isPlace': 'ship[].isPlace',
      'ship[].shipType': 'ship[].shipType',
      'ship[].size': 'ship[].size',
    };
  }
}
