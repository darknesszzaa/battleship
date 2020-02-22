import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AttackDto } from './dto/attack.dto';
import { ConfirmShipPleacementDto } from './dto/confirm-ship-placement.dto';
import { GameDto } from './dto/game.dto';
import { ShipPlacementDto } from './dto/ship-placement.dto';
import { GameService } from './game.service';
import { GameBoardDto } from './dto/game-board.dto';
import { NewGameDto } from './dto/new-game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  /**
   * Get game status by using game ID for query
   * @param param 
   */
  @Get('status/:id')
  public async getStatus(@Param() param) {
    try {
      const responseMessage = await this.gameService.getStatus(param.id);
      if (responseMessage.isConfirmShipPlacement) {
        const dataResponse = new GameBoardDto();
        return dataResponse.toResponse(responseMessage);
      } else {
        const dataResponse = new GameDto();
        return dataResponse.toResponse(responseMessage);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * New game session
   */
  @Post('new-game')
  public async newGame() {
    try {
      const responseMessage = await this.gameService.newGame();
      const dataResponse = new NewGameDto();
      return dataResponse.toResponse(responseMessage);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ship placement set location and rotate of ship
   * @param data 
   */
  @Put('ship-placement')
  public async shipPlacement(@Body() data: ShipPlacementDto) {
    try {
      const responseMessage = await this.gameService.shipPlacement(data);
      const dataResponse = new GameDto();
      return dataResponse.toResponse(responseMessage);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm ship placement
   * @param data 
   */
  @Put('confirm-ship-placement')
  public async confirmShipPlacement(@Body() data: ConfirmShipPleacementDto) {
    try {
      return await this.gameService.confirmShipPlacement(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Attack make location to attack ship
   * @param data 
   */
  @Put('attack')
  public async attack(@Body() data: AttackDto) {
    try {
      return await this.gameService.attack(data);
    } catch (error) {
      throw error;
    }
  }
}
