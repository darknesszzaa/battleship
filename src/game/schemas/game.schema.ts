import * as mongoose from 'mongoose';
import { AttackSchema } from './attack.schema';
import { ShipSchema } from './ship.schema';

export const GameSchema = new mongoose.Schema({
  totalMove: Number,
  isConfirmShipPlacement: Boolean,
  isCompleted: Boolean,
  ship:  [ShipSchema],
  attack: [AttackSchema],
});
