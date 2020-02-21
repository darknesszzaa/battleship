import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { RotateEnum } from '../common/share/enums/rotate.enum';
import { ShipTypeEnum } from '../common/share/enums/ship-type.enum';
import { AttackDto } from './dto/attack.dto';
import { ConfirmShipPleacementDto } from './dto/confirm-ship-placement.dto';
import { GameDto } from './dto/game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { ShipPlacementDto } from './dto/ship-placement.dto';
import { Game } from './interfaces/game.interface';
import { PlayerModel } from './model/player.model';
import { ShipModel } from './model/ship.model';

const SIZE_HORIZON_GRID = Number(process.env.SIZE_HORIZON_GRID);
const SIZE_VERTICAL_GRID = Number(process.env.SIZE_VERTICAL_GRID);
const GAP_SHIP = Number(process.env.GAP_SHIP);
const SIZE_BATTLE_SHIP = Number(process.env.SIZE_BATTLE_SHIP);
const SIZE_CRUISER = Number(process.env.SIZE_CRUISER);
const SIZE_DESTROYER = Number(process.env.SIZE_DESTROYER);
const SIZE_SUBMARINE = Number(process.env.SIZE_SUBMARINE);

@Injectable()
export class GameService {
  constructor(
    @Inject('GAME_MODEL')
    private readonly gameModel: Model<Game>,
    private readonly jwtService: JwtService,
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
        isConfirmShipPlacement: false,
        isCompleted: false,
        palyer: [],
      };

      // initial battle ship
      const totalBattleShip = Number(process.env.TOTAL_BATTLE_SHIP);
      await this.initialShip(game, totalBattleShip, ShipTypeEnum.BATTLE_SHIP, SIZE_BATTLE_SHIP);

      // initial cruiser
      const totalCruiser = Number(process.env.TOTAL_CRUISER);
      await this.initialShip(game, totalCruiser, ShipTypeEnum.CRUISER, SIZE_CRUISER);

      // initial cruiser
      const totalDestroyer = Number(process.env.TOTAL_DESTROYER);
      await this.initialShip(game, totalDestroyer, ShipTypeEnum.DESTROYER, SIZE_DESTROYER);

      // initial cruiser
      const totalSubmarine = Number(process.env.TOTAL_SUBMARINE);
      await this.initialShip(game, totalSubmarine, ShipTypeEnum.SUBMARINE, SIZE_SUBMARINE);

      const createdGame = new this.gameModel(game);
      return createdGame.save(game);
    } catch (error) {
      throw error;
    }
  }

  public async joinGame(data: JoinGameDto): Promise<any> {
    try {
      const game = await this.gameModel.findOne({ _id: data.gameId });
      if (game) {
        for (const playerDB of game.player) {
          if (playerDB.role === data.role) {
            throw new HttpException('This role\'s already joined', HttpStatus.BAD_REQUEST);
          }
        }
        const player: PlayerModel = Object.assign(new PlayerModel(), { role: data.role, name: data.name });
        game.player.push(player);
        await game.save();
        const payload = { role: data.role };
        return {
          accessToken: this.jwtService.sign(payload),
        };

      } else {
        throw new HttpException('Game ID is not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('Game ID is not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  public async shipPlacement(shipPlacementDtoData: ShipPlacementDto): Promise<Game> {
    try {
      const gameDB = await this.gameModel.findOne({ _id: shipPlacementDtoData.gameId });
      if (gameDB) {
        if (!gameDB.isCompleted) {
          if (gameDB.player.lenght === 2) {
            if (!gameDB.isConfirmShipPlacement) {

              let isValidShipId = false;
              for (const shipDB of gameDB.ship) {

                if (shipPlacementDtoData.shipId === shipDB._id.toString()) {
                  isValidShipId = true;
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

              if (!isValidShipId) {
                throw new HttpException('Ship ID is not found', HttpStatus.NOT_FOUND);
              }

              return gameDB.save();
            } else {
              throw new HttpException('Can\'t move after confirmd ship placement', HttpStatus.BAD_REQUEST);
            }
          } else {
            throw new HttpException('Need all player to join first', HttpStatus.BAD_REQUEST);
          }
        } else {
          throw new HttpException('Game id is not found', HttpStatus.NOT_FOUND);
        }
      } else {
        throw new HttpException('This game\'s already ended', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('Game id is not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  public async confirmShipPlacement(data: ConfirmShipPleacementDto): Promise<Game> {
    try {
      const game = await this.gameModel.findOne({ _id: data.gameId });
      if (game) {
        if (!game.isCompleted) {
          if (!game.isConfirmShipPlacement) {
            let isCompletePlacement = true;

            for (const shipDB of game.ship) {
              if (!shipDB.isPlace) {
                isCompletePlacement = false;
              }
            }
            if (isCompletePlacement) {
              game.isConfirmShipPlacement = isCompletePlacement;
            } else {
              throw new HttpException('Need to place all ship before confirm', HttpStatus.OK);
            }
          } else {
            throw new HttpException('Ship placement\'s already confirmd ', HttpStatus.TOO_MANY_REQUESTS);
          }
        } else {
          throw new HttpException('This game\'s already ended', HttpStatus.NOT_FOUND);
        }
        return game.save();
      } else {
        throw new HttpException('Game ID is Not Found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('Game ID is Not Found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  public async attack(data: AttackDto): Promise<Game> {
    try {
      const game = await this.gameModel.findOne({ _id: data.gameId });
      if (game) {
        if (!game.isCompleted) {
          return game.save();
        } else {
          throw new HttpException('This game\'s already ended', HttpStatus.NOT_FOUND);
        }
      } else {
        throw new HttpException('Game ID is Not Found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('Game ID is Not Found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  public async initialShip(game, total: number, shipType: ShipTypeEnum, size: number) {
    for (let index = 0; index < total; index++) {
      const ship: ShipModel = Object.assign(new ShipModel(), { x: 0, y: 0, isPlace: false, isSunk: false, rotate: RotateEnum.HORIZON, shipType, size });
      game.ship.push(ship);
    }
  }

  public async verifyShipPlacement(gameDB, x: number, y: number, dtoSize: number, rotate: RotateEnum, shipId: string) {
    if (rotate === RotateEnum.HORIZON) {
      if (x + dtoSize - 1 > SIZE_HORIZON_GRID) {
        throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
      }
    } else if (rotate === RotateEnum.VERTICAL) {
      if (y + dtoSize - 1 > SIZE_VERTICAL_GRID) {
        throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
      }
    }

    for (const shipDB of gameDB.ship) {
      if (shipDB.isPlace && shipDB._id.toString() !== shipId) {
        if (rotate === RotateEnum.HORIZON && shipDB.rotate === RotateEnum.HORIZON) {
          if (x > shipDB.x) {
            if ((x - shipDB.x) <= shipDB.size + GAP_SHIP) {
              if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
              }
            }
          } else {
            if ((shipDB.x - x) <= dtoSize + GAP_SHIP) {
              if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
              }
            }
          }
        } else if (rotate === RotateEnum.HORIZON && shipDB.rotate === RotateEnum.VERTICAL) {
          if (x > shipDB.x) {
            if ((x - shipDB.x) <= GAP_SHIP) {
              if (y < shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              } else {
                if (y - shipDB.y <= shipDB.size + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              }
            }
          } else {
            if ((shipDB.x - x) <= dtoSize + GAP_SHIP) {
              if (y < shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              } else {
                if (y - shipDB.y <= shipDB.size + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              }
            }
          }
        } else if (rotate === RotateEnum.VERTICAL && shipDB.rotate === RotateEnum.HORIZON) {
          if (x > shipDB.x) {
            if ((x - shipDB.x) <= shipDB.size + GAP_SHIP) {
              if (y > shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              } else {
                if (shipDB.y - y <= dtoSize + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              }
            }
          } else {
            if ((shipDB.x - x) <= GAP_SHIP) {
              if (y > shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              } else {
                if (shipDB.y - y <= shipDB.size + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              }
            }
          }
        } else if (rotate === RotateEnum.VERTICAL && shipDB.rotate === RotateEnum.VERTICAL) {
          if (y > shipDB.y) {
            if ((y - shipDB.y) <= shipDB.size + GAP_SHIP) {
              if (Math.abs(x - shipDB.x) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
              }
            }
          } else {
            if ((shipDB.y - y) <= dtoSize + GAP_SHIP) {
              if (Math.abs(x - shipDB.x) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
              }
            }
          }
        }
      }
    }
  }

}
