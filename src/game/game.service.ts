import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RotateEnum } from '../common/share/enums/rotate.enum';
import { ShipTypeEnum } from '../common/share/enums/ship-type.enum';
import { AttackDto } from './dto/attack.dto';
import { ConfirmShipPleacementDto } from './dto/confirm-ship-placement.dto';
import { GameDto } from './dto/game.dto';
import { ShipPlacementDto } from './dto/ship-placement.dto';
import { Game } from './interfaces/game.interface';
import { ShipModel } from './model/ship.model';
import { AttackModel } from './model/attack.model';

const SIZE_HORIZON_GRID = Number(process.env.SIZE_HORIZON_GRID);
const SIZE_VERTICAL_GRID = Number(process.env.SIZE_VERTICAL_GRID);
const GAP_SHIP = 1;
const SIZE_BATTLE_SHIP = 4;
const SIZE_CRUISER = 3;
const SIZE_DESTROYER = 2;
const SIZE_SUBMARINE = 3;
const TOTAL_BATTLE_SHIP = 1;
const TOTAL_CRUISER = 2;
const TOTAL_DESTROYER = 3;
const TOTAL_SUBMARINE = 4;

@Injectable()
export class GameService {
  constructor(
    @Inject('GAME_MODEL')
    private readonly gameModel: Model<Game>,
  ) { }

  /**
   * Get game status by using game ID for query
   * @param id 
   */
  public async getStatus(id: string): Promise<Game> {
    try {
      const data = await this.gameModel.findOne({ _id: id });
      if (data) {
        return data;
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

  /**
   * New game session and generate game data and store in MongoDB
   */
  public async newGame(): Promise<Game> {
    try {
      const game = {
        totalMove: 0,
        isConfirmShipPlacement: false,
        isCompleted: false,
        createAt: new Date(),
        ship: [],
        attack: [],
      };

      // initial battle ship
      await this.initialShip(game, TOTAL_BATTLE_SHIP, ShipTypeEnum.Battleship, SIZE_BATTLE_SHIP);

      // initial cruiser
      await this.initialShip(game, TOTAL_CRUISER, ShipTypeEnum.Cruiser, SIZE_CRUISER);

      // initial cruiser
      await this.initialShip(game, TOTAL_DESTROYER, ShipTypeEnum.Destroyer, SIZE_DESTROYER);

      // initial cruiser
      await this.initialShip(game, TOTAL_SUBMARINE, ShipTypeEnum.Submarine, SIZE_SUBMARINE);

      const createdGame = new this.gameModel(game);
      return createdGame.save(game);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ship placement set location and rotate of ship
   * @param shipPlacementDtoData 
   */
  public async shipPlacement(shipPlacementDtoData: ShipPlacementDto): Promise<Game> {
    try {
      const gameDB = await this.gameModel.findOne({ _id: shipPlacementDtoData.gameId });
      if (gameDB) {
        if (!gameDB.isCompleted) {
          if (!gameDB.isConfirmShipPlacement) {

            let isValidShipId = false;
            for (const shipDB of gameDB.ship) {

              if (shipPlacementDtoData.shipId === shipDB._id.toString()) {
                isValidShipId = true;
                switch (shipDB.shipType) {
                  case ShipTypeEnum.Battleship:
                    await this.verifyShipPlacement(gameDB, shipPlacementDtoData.x, shipPlacementDtoData.y, SIZE_BATTLE_SHIP, shipPlacementDtoData.rotate, shipPlacementDtoData.shipId);
                    break;
                  case ShipTypeEnum.Cruiser:
                    await this.verifyShipPlacement(gameDB, shipPlacementDtoData.x, shipPlacementDtoData.y, SIZE_CRUISER, shipPlacementDtoData.rotate, shipPlacementDtoData.shipId);
                    break;
                  case ShipTypeEnum.Destroyer:
                    await this.verifyShipPlacement(gameDB, shipPlacementDtoData.x, shipPlacementDtoData.y, SIZE_DESTROYER, shipPlacementDtoData.rotate, shipPlacementDtoData.shipId);
                    break;
                  case ShipTypeEnum.Submarine:
                    await this.verifyShipPlacement(gameDB, shipPlacementDtoData.x, shipPlacementDtoData.y, SIZE_SUBMARINE, shipPlacementDtoData.rotate, shipPlacementDtoData.shipId);
                    break;
                }

                shipDB.x = shipPlacementDtoData.x;
                shipDB.y = shipPlacementDtoData.y;
                shipDB.isPlace = true;
                shipDB.rotate = shipPlacementDtoData.rotate;
                break;
              }
            }

            if (!isValidShipId) {
              throw new HttpException('Ship ID is not found', HttpStatus.NOT_FOUND);
            }

            return gameDB.save();
          } else {
            throw new HttpException('Can\'t move after confirmed ship placement', HttpStatus.BAD_REQUEST);
          }
        } else {
          throw new HttpException('This game\'s already ended', HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException('Game id is not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('Game id is not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  /**
   * Confirm ship placement
   * @param data 
   */
  public async confirmShipPlacement(data: ConfirmShipPleacementDto): Promise<Object> {
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
              await game.save();
            } else {
              throw new HttpException('Need to place all ship before confirmed', HttpStatus.BAD_REQUEST);
            }
          } else {
            throw new HttpException('Ship placement\'s already confirmed', HttpStatus.BAD_REQUEST);
          }
        } else {
          throw new HttpException('This game\'s already ended', HttpStatus.BAD_REQUEST);
        }

        return { message: 'Ship placement\'s confirm' }

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

  /**
   * Attack make location to attack ship
   * @param data 
   */
  public async attack(data: AttackDto): Promise<Object> {
    try {
      const game = await this.gameModel.findOne({ _id: data.gameId });
      if (game) {
        if (!game.isCompleted) {
          if (game.isConfirmShipPlacement) {
            for (const attackDB of game.attack) {
              if (attackDB.x === data.x && attackDB.y === data.y) {
                throw new HttpException('This location\'s already attacked', HttpStatus.BAD_REQUEST);
              }
            }
            let isHit = false;
            let isSunk = false;
            let shipSunkType;
            for (const shipDB of game.ship) {
              if (shipDB.rotate === RotateEnum.Horizon) {
                if (data.x >= shipDB.x && data.x <= (shipDB.x + shipDB.size - 1) && data.y === shipDB.y) {
                  const attackModel: AttackModel = Object.assign(new AttackModel(), { x: data.x, y: data.y, isHit: true });
                  game.attack.push(attackModel);
                  isHit = true;
                  shipDB.totalHit = shipDB.totalHit + 1;
                  if (shipDB.size === shipDB.totalHit) {
                    shipDB.isSunk = true;
                    isSunk = true;
                    shipSunkType = shipDB.shipType;
                  }
                  break;
                }
              } else if (shipDB.rotate === RotateEnum.Vertical) {
                if (data.y >= shipDB.y && data.y <= (shipDB.y + shipDB.size - 1) && data.x === shipDB.x) {
                  const attackModel: AttackModel = Object.assign(new AttackModel(), { x: data.x, y: data.y, isHit: true });
                  game.attack.push(attackModel);
                  isHit = true;
                  shipDB.totalHit = shipDB.totalHit + 1;
                  if (shipDB.size === shipDB.totalHit) {
                    shipDB.isSunk = true;
                    isSunk = true;
                    shipSunkType = shipDB.shipType;
                  }
                  break;
                }
              }
            }
            game.totalMove = game.totalMove + 1;
            if (!isHit) {
              const attackModel: AttackModel = Object.assign(new AttackModel(), { x: data.x, y: data.y, isHit: false });
              game.attack.push(attackModel);
              await game.save();
              return { message: 'Miss' }
            } else {
              await game.save();
              if (isSunk) {
                let isAllSunk = true;
                for (const shipDB of game.ship) {
                  if (!shipDB.isSunk) {
                    isAllSunk = false;
                  }
                }

                if (isAllSunk) {
                  game.isCompleted = true;
                  await game.save();
                  return { message: 'Win! You have completed the game in ' + game.totalMove + ' moves' }
                } else {

                  switch (shipSunkType) {
                    case ShipTypeEnum.Battleship:
                      return { message: 'You just sank a Battleship' }
                    case ShipTypeEnum.Cruiser:
                      return { message: 'You just sank a Cruiser' }
                    case ShipTypeEnum.Destroyer:
                      return { message: 'You just sank a Destroyer' }
                    case ShipTypeEnum.Submarine:
                      return { message: 'You just sank a Submarine' }
                  }
                }
              } else {
                return { message: 'Hit' }
              }
            }
          } else {
            throw new HttpException('Need to confirm ship placement first', HttpStatus.BAD_REQUEST);
          }
        } else {
          throw new HttpException('This game\'s already ended', HttpStatus.BAD_REQUEST);
        }
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

  /**
   * Initial Ship data and set into game data
   * @param game 
   * @param total 
   * @param shipType 
   * @param size 
   */
  public async initialShip(game, total: number, shipType: ShipTypeEnum, size: number) {
    for (let index = 0; index < total; index++) {
      const ship: ShipModel = Object.assign(new ShipModel(), { x: 0, y: 0, isPlace: false, isSunk: false, rotate: RotateEnum.Horizon, shipType, size, totalHit: 0 });
      game.ship.push(ship);
    }
  }

  /**
   * Verify ship placement logic
   * @param gameDB 
   * @param x 
   * @param y 
   * @param dtoSize 
   * @param rotate 
   * @param shipId 
   */
  public async verifyShipPlacement(gameDB, x: number, y: number, dtoSize: number, rotate: RotateEnum, shipId: string) {
    if (rotate === RotateEnum.Horizon) {
      if (x + dtoSize - 1 > SIZE_HORIZON_GRID) {
        throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
      }
    } else if (rotate === RotateEnum.Vertical) {
      if (y + dtoSize - 1 > SIZE_VERTICAL_GRID) {
        throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
      }
    }

    for (const shipDB of gameDB.ship) {
      if (shipDB.isPlace && shipDB._id.toString() !== shipId) {
        if (rotate === RotateEnum.Horizon && shipDB.rotate === RotateEnum.Horizon) {
          if (x > shipDB.x) {
            if ((x - shipDB.x) <= shipDB.size - 1 + GAP_SHIP) {
              if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
              }
            }
          } else {
            if ((shipDB.x - x) <= dtoSize - 1 + GAP_SHIP) {
              if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
              }
            }
          }
        } else if (rotate === RotateEnum.Horizon && shipDB.rotate === RotateEnum.Vertical) {
          if (x > shipDB.x) {
            if ((x - shipDB.x) <= GAP_SHIP) {
              if (y < shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              } else {
                if (y - shipDB.y <= shipDB.size - 1 + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              }
            }
          } else {
            if ((shipDB.x - x) <= dtoSize - 1 + GAP_SHIP) {
              if (y < shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              } else {
                if (y - shipDB.y <= shipDB.size - 1 + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              }
            }
          }
        } else if (rotate === RotateEnum.Vertical && shipDB.rotate === RotateEnum.Horizon) {
          if (x > shipDB.x) {
            if ((x - shipDB.x) <= shipDB.size - 1 + GAP_SHIP) {
              if (y > shipDB.y) {
                if (Math.abs(y - shipDB.y) <= GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              } else {
                if (shipDB.y - y <= dtoSize - 1 + GAP_SHIP) {
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
                if (shipDB.y - y <= shipDB.size - 1 + GAP_SHIP) {
                  throw new HttpException('Invalid game moves', HttpStatus.BAD_REQUEST);
                }
              }
            }
          }
        } else if (rotate === RotateEnum.Vertical && shipDB.rotate === RotateEnum.Vertical) {
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
