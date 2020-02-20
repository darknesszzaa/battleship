import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AttackDto } from './dto/attack.dto';
import { GameDto } from './dto/game.dto';
import { ShipPlacementDto } from './dto/ship-placement.dto';
import { Game } from './interfaces/game.interface';
import { ShipModel } from './model/ship.model';
import { ShipTypeEnum } from '../common/share/enums/ship-type.enum';
import { RotateEnum } from '../common/share/enums/rotate.enum';

const SIZE_HORIZON_GRID = Number.parseInt(process.env.SIZE_HORIZON_GRID);
const SIZE_VERTICAL_GRID = Number.parseInt(process.env.SIZE_VERTICAL_GRID);

const GAP_SHIP = Number.parseInt(process.env.GAP_SHIP);

const SIZE_BATTLE_SHIP = Number.parseInt(process.env.SIZE_BATTLE_SHIP);
const SIZE_CRUISER = Number.parseInt(process.env.SIZE_CRUISER);
const SIZE_DESTROYER = Number.parseInt(process.env.SIZE_DESTROYER);
const SIZE_SUBMARINE = Number.parseInt(process.env.SIZE_SUBMARINE);

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
        ship: [],
        totalMove: 0,
        attack: [],
        isCompleted: false,
      };

      // initial battle ship
      const totalBattleShip = Number.parseInt(process.env.TOTAL_BATTLE_SHIP);
      await this.initialShip(game, totalBattleShip, ShipTypeEnum.BATTLE_SHIP, SIZE_BATTLE_SHIP)

      // initial cruiser
      const totalCruiser = Number.parseInt(process.env.TOTAL_CRUISER);
      await this.initialShip(game, totalCruiser, ShipTypeEnum.CRUISER, SIZE_CRUISER)

      // initial cruiser
      const totalDestroyer = Number.parseInt(process.env.TOTAL_DESTROYER);
      await this.initialShip(game, totalDestroyer, ShipTypeEnum.DESTROYER, SIZE_DESTROYER)

      // initial cruiser
      const totalSubmarine = Number.parseInt(process.env.TOTAL_SUBMARINE);
      await this.initialShip(game, totalSubmarine, ShipTypeEnum.SUBMARINE, SIZE_SUBMARINE)

      const createdGame = new this.gameModel(game);
      return createdGame.save(game);
    } catch (error) {
      throw error;
    }
  }

  public async shipPlacement(shipPlacementDtoData: ShipPlacementDto): Promise<Game> {
    try {
      const gameDB = await this.gameModel.findOne({ _id: shipPlacementDtoData.gameId });
      if (gameDB) {

        for (const shipDB of gameDB.ship) {

          if (shipPlacementDtoData.shipId == shipDB._id) {

            switch (shipDB.shipType) {
              case ShipTypeEnum.BATTLE_SHIP:
                await this.verifyShipPlacement(gameDB, shipPlacementDtoData.x, shipPlacementDtoData.y, SIZE_BATTLE_SHIP, shipPlacementDtoData.rotate, shipPlacementDtoData.shipId);
                break;
              case ShipTypeEnum.CRUISER:
                await this.verifyShipPlacement(gameDB, shipPlacementDtoData.x, shipPlacementDtoData.y, SIZE_CRUISER, shipPlacementDtoData.rotate, shipPlacementDtoData.shipId);
                break;
              case ShipTypeEnum.DESTROYER:
                await this.verifyShipPlacement(gameDB, shipPlacementDtoData.x, shipPlacementDtoData.y, SIZE_DESTROYER, shipPlacementDtoData.rotate, shipPlacementDtoData.shipId);
                break;
              case ShipTypeEnum.SUBMARINE:
                await this.verifyShipPlacement(gameDB, shipPlacementDtoData.x, shipPlacementDtoData.y, SIZE_SUBMARINE, shipPlacementDtoData.rotate, shipPlacementDtoData.shipId);
                break;
              default:
                break;
            }

            shipDB.x = shipPlacementDtoData.x;
            shipDB.y = shipPlacementDtoData.y;
            shipDB.isPlace = true;
            shipDB.rotate = shipPlacementDtoData.rotate;
          }
        }

        return gameDB.save();
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

  public async initialShip(game, total: number, shipType: ShipTypeEnum, size: number) {
    for (let index = 0; index < total; index++) {
      const ship = { x: 0, y: 0, isPlace: false, isSunk: false, rotate: RotateEnum.HORIZON, shipType, size };
      game.ship.push(ship)
    }
  }

  public async verifyShipPlacement(gameDB, x: number, y: number, dtoSize: number, rotate: RotateEnum, shipId: string) {
    if (rotate === RotateEnum.HORIZON) {
      if (x + SIZE_BATTLE_SHIP > SIZE_HORIZON_GRID) {
        throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
      }
    } else if (rotate === RotateEnum.VERTICAL) {
      if (y + SIZE_BATTLE_SHIP > SIZE_VERTICAL_GRID) {
        throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
      }
    }

    for (const shipDB of gameDB.ship) {
      if (shipDB.isPlace && shipDB._id != shipId) {
        if (rotate === RotateEnum.HORIZON && shipDB.rotate === RotateEnum.HORIZON) {
          if (x > shipDB.x) {
            if ((x - shipDB.x) < shipDB.size + GAP_SHIP) {
              if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
              }
            }
          } else {
            if ((shipDB.x - x) < dtoSize + GAP_SHIP) {
              if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
              }
            }
          }
        } else if (rotate === RotateEnum.HORIZON && shipDB.rotate === RotateEnum.VERTICAL) {
          if (x > shipDB.x) {
            if ((x - shipDB.x) <= GAP_SHIP) {
              if (y < shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
                }
              } else {
                if (y - shipDB.y <= shipDB.size + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
                }
              }
            }
          } else {
            if ((shipDB.x - x) < dtoSize + GAP_SHIP) {
              if (y < shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
                }
              } else {
                if (y - shipDB.y <= shipDB.size + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
                }
              }
            }
          }
        } else if (rotate === RotateEnum.VERTICAL && shipDB.rotate === RotateEnum.HORIZON) {
          if (x > shipDB.x) {
            if ((x - shipDB.x) < shipDB.size + GAP_SHIP) {
              if (y > shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
                }
              } else {
                if (shipDB.y - y <= dtoSize + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
                }
              }
            }
          } else {
            if ((shipDB.x - x) <= GAP_SHIP) {
              if (y > shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
                }
              } else {
                if (shipDB.y - y <= shipDB.size + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
                }
              }
            }
          }
        } else if (rotate === RotateEnum.VERTICAL && shipDB.rotate === RotateEnum.VERTICAL) {
          if (y > shipDB.y) {
            if ((y - shipDB.y) < shipDB.size + GAP_SHIP) {
              if (Math.abs(x - shipDB.x) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
              }
            }
          } else {
            if ((shipDB.y - y) < dtoSize + GAP_SHIP) {
              if (Math.abs(x - shipDB.x) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.NOT_ACCEPTABLE);
              }
            }
          }
        }
      }
    }
  }

}
