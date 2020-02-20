import { Document } from 'mongoose';
import { AttackModel } from '../model/attack.model';
import { ShipModel } from '../model/ship.model';

export interface Game extends Document {
  ship: {
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
  totalMove: number;
  attack: {
    hit: {
      total: number;
      data: AttackModel[];
    }
    miss: {
      total: number;
      data: AttackModel[];
    },
  };
  isCompleted: boolean;
}
