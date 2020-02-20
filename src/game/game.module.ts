import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { GameController } from './game.controller';
import { gameProviders } from './game.providers';
import { GameService } from './game.service';

@Module({
  imports: [DatabaseModule],
  providers: [GameService, ...gameProviders],
  controllers: [GameController],
})
export class GameModule {}
