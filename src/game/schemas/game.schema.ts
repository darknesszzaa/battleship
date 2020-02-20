import * as mongoose from 'mongoose';
import { AttackSchema } from './attack.schema';
import { ShipSchema } from './ship.schema';

export const GameSchema = new mongoose.Schema({
  ship:  [ShipSchema],
  totalMove: Number,
  attack:[AttackSchema],
  isCompleted: Boolean,
});
