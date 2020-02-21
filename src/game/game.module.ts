import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { jwtConstants } from './constants';
import { GameController } from './game.controller';
import { gameProviders } from './game.providers';
import { GameService } from './game.service';

@Module({
  imports: [DatabaseModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    })],
  providers: [GameService, ...gameProviders],
  controllers: [GameController],
})
export class GameModule { }
