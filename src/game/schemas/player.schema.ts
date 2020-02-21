import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
  role: Number,
  name: String,
});
