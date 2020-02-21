import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get('new-game')
  public async newGame() {
    try {
      const responseMessage = await this.gameService.newGame();
      const dataResponse = new NewGameDto();
      return dataResponse.toResponse(responseMessage);
    } catch (error) {
      throw error;
    }
  }

  @Post('ship-placement')
  public async shipPlacement(@Body() data: ShipPlacementDto) {
    try {
      const responseMessage = await this.gameService.shipPlacement(data);
      const dataResponse = new GameDto();
      return dataResponse.toResponse(responseMessage);
    } catch (error) {
      throw error;
    }
  }

  @Post('confirm-ship-placement')
  public async confirmShipPlacement(@Body() data: ConfirmShipPleacementDto) {
    try {
      return await this.gameService.confirmShipPlacement(data);
    } catch (error) {
      throw error;
    }
  }

  @Post('attack')
  public async attack(@Body() data: AttackDto) {
    try {
      return await this.gameService.attack(data);
    } catch (error) {
      throw error;
    }
  }
}
