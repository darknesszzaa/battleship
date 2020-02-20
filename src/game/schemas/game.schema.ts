import * as mongoose from 'mongoose';
import { AttackSchema } from './attack.schema';
import { ShipSchema } from './ship.schema';

export const GameSchema = new mongoose.Schema({
  ship: {
    battleShip: {
      totalRemaining: Number,
      totalSunk: Number,
      data: [ShipSchema],
    },
    cruiser: {
      totalRemaining: Number,
      totalSunk: Number,
      data: [ShipSchema],
    },
    destroyer: {
      totalRemaining: Number,
      totalSunk: Number,
      data: [ShipSchema],
    },
    submarine: {
      totalRemaining: Number,
      totalSunk: Number,
      data: [ShipSchema],
    },
  },
  totalMove: Number,
  attack: {
    hit: {
      total: Number,
      data: [AttackSchema],
    },
    miss: {
      total: Number,
      data: [AttackSchema],
    },
  },
  isCompleted: Boolean,
});
