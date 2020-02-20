import * as mongoose from 'mongoose';

export const AttackSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  isHit: Boolean,
});
