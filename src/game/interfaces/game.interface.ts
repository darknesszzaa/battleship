import { Document } from 'mongoose';
import { AttackModel } from '../model/attack.model';
import { ShipModel } from '../model/ship.model';

export interface Game extends Document {
  ship: ShipModel[];
  totalMove: number;
  attack: AttackModel[];
  isConfirmShipPlacement: boolean;
  isCompleted: boolean;
}
