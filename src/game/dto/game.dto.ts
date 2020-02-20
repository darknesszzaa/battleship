import { AttackModel } from '../model/attack.model';
import { ShipModel } from '../model/ship.model';
import { BaseDto } from './base.dto';

export class GameDto extends BaseDto {
  public gameId: string;
  public ship: ShipModel[];
  public totalMove: number;
  public attack: AttackModel[];
  public isCompleted: boolean;

  constructor() {
    super();
    this._mapper = {
      gameId: '_id',
      ship: 'ship',
      totalMove: 'totalMove',
      attack: 'attack',
      isCompleted: 'isCompleted',
    };
  }
}
