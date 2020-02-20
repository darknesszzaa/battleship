import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AttackDto } from './dto/attack.dto';
import { GameDto } from './dto/game.dto';
import { ShipPlacementDto } from './dto/ship-placement.dto';
import { Game } from './interfaces/game.interface';

@Injectable()
export class GameService {
  constructor(
    @Inject('GAME_MODEL')
    private readonly gameModel: Model<Game>,
  ) { }

  public async findAll(): Promise<Game[]> {
    try {
      return this.gameModel.find();
    } catch (error) {
      throw error;
    }
  }

  public async getStatus(id: string): Promise<GameDto> {
    try {
      return await this.gameModel.findOne({ _id: id });
    } catch (error) {
      throw error;
    }
  }

  public async newGame(): Promise<Game> {
    try {
      const game = {
        ship: {
          battleShip: {
            totalRemaining: 1,
            totalSunk: 0,
            data: [],
          },
          cruiser: {
            totalRemaining: 2,
            totalSunk: 0,
            data: [],
          },
          destroyer: {
            totalRemaining: 3,
            totalSunk: 0,
            data: [],
          },
          submarine: {
            totalRemaining: 4,
            totalSunk: 0,
            data: [],
          },
        },
        totalMove: 0,
        attack: {
          hit: {
            total: 0,
            data: [],
          },
          miss: {
            total: 0,
            data: [],
          },
        },
        isCompleted: false,
      };
      const createdGame = new this.gameModel(game);
      return createdGame.save(game);
    } catch (error) {
      throw error;
    }
  }

  public async shipPlacement(data: ShipPlacementDto): Promise<Game> {
    try {
      const game = await this.gameModel.findOne({ _id: data.id });
      if (game) {
        return game.save();
      } else {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  public async attack(data: AttackDto): Promise<Game> {
    try {
      const game = await this.gameModel.findOne({ _id: data.id });
      if (game) {
        return game.save();
      } else {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

}
