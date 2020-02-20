import * as mongoose from 'mongoose';

export const ShipSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  isPlace: Boolean,
  isSunk: Boolean,
  rotate: Number,
  shipType: Number,
  size: Number,
});
