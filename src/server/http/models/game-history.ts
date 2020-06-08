import { Schema, Document, model } from 'mongoose';

export interface IGameHistory extends Document {
  parent_id: string;
  size: number;
  grid: [];
  visited: [];
  solvedTurns: number;
  playerTurns: number;
}

const GameHistorySchema: Schema = new Schema({
  parent_id: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  grid: {
    type: Array,
    required: true,
  },
  visited: {
    type: Array,
    required: true,
  },
  solvedTurns: {
    type: Number,
    required: true,
  },
  playerTurns: {
    type: Number,
    required: true,
  },
});

export default model<IGameHistory & Document>(
  'GameHistory',
  GameHistorySchema,
  'games_history'
);
