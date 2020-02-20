import { AttackModel } from '../model/attack.model';
import { ShipModel } from '../model/ship.model';
import { BaseDto } from './base.dto';

export class GameDto extends BaseDto {
  public id: string;
  public ship: {
    battleShip: {
      totalRemaining: number;
      totalSunk: number;
      data: ShipModel[];
    }
    cruiser: {
      totalRemaining: number;
      totalSunk: number;
      data: ShipModel[];
    }
    destroyer: {
      totalRemaining: number;
      totalSunk: number;
      data: ShipModel[];
    }
    submarine: {
      totalRemaining: number;
      totalSunk: number;
      data: ShipModel[];
    },
  };
  public totalMove: number;
  public attack: {
    hit: {
      total: number;
      data: AttackModel[];
    }
    miss: {
      total: number;
      data: AttackModel[];
    },
  };
  public isCompleted: boolean;

  constructor() {
    super();
    this._mapper = {
      id: '_id',
      ship: 'ship',
      totalMove: 'totalMove',
      attack: 'attack',
      isCompleted: 'totalMove',
    };
  }
}
