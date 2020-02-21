import * as mongoose from 'mongoose';
import { AttackSchema } from './attack.schema';
import { PlayerSchema } from './player.schema';
import { ShipSchema } from './ship.schema';

export const GameSchema = new mongoose.Schema({
  ship:  [ShipSchema],
  totalMove: Number,
  attack: [AttackSchema],
  isConfirmShipPlacement: Boolean,
  isCompleted: Boolean,
  player: [PlayerSchema],
});
