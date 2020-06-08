import { Schema, Document, model } from 'mongoose';
import GameHistoryModel from './game-history';

export interface IGame extends Document {
  size: number;
  grid: number[][];
  visited: boolean[][];
  solvedTurns: number;
  playerTurns: number;
}

const GameSchema: Schema = new Schema({
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
GameSchema.post('save', (savedDocument) => {
  const gameHistoryModel = new GameHistoryModel({
    parent_id: savedDocument.get('_id'),
    size: savedDocument.get('size'),
    grid: savedDocument.get('grid'),
    visited: savedDocument.get('visited'),
    solvedTurns: savedDocument.get('solvedTurns'),
    playerTurns: savedDocument.get('playerTurns'),
  });
  gameHistoryModel.save((err) => {
    if (err) return console.error(err);
  });
});
GameSchema.post('update', (savedDocument) => {
  const gameHistoryModel = new GameHistoryModel({
    parent_id: savedDocument.get('_id'),
    size: savedDocument.get('size'),
    grid: savedDocument.get('grid'),
    visited: savedDocument.get('visited'),
    solvedTurns: savedDocument.get('solvedTurns'),
    playerTurns: savedDocument.get('playerTurns'),
  });
  gameHistoryModel.save((err) => {
    if (err) return console.error(err);
  });
});
export default model<IGame & Document>('Game', GameSchema, 'games');
