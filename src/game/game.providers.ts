import { Connection } from 'mongoose';
import { GameSchema } from './schemas/game.schema';

export const gameProviders = [
  {
    provide: 'GAME_MODEL',
    useFactory: (connection: Connection) => connection.model('games', GameSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
