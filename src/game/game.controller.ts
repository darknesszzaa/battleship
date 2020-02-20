import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttackDto } from './dto/attack.dto';
import { GameDto } from './dto/game.dto';
import { ShipPlacementDto } from './dto/ship-placement.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Get()
  public async findAll() {
    const responseMessage = await this.gameService.findAll().then((list) => {
      const dataResponse: GameDto = new GameDto();
      return list.map((item) => {
        return dataResponse.toResponse(item);
      });
    });
    return responseMessage;
  }

  @Get('status/:id')
  public async getStatus(@Param() param) {
    try {
      const responseMessage = await this.gameService.getStatus(param.id);
      const dataResponse = new GameDto();
      return dataResponse.toResponse(responseMessage);
    } catch (error) {
      throw error;
    }
  }

  @Get('new-game')
  public async newGame() {
    try {
      const responseMessage = await this.gameService.newGame();
      const dataResponse = new GameDto();
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

  @Post('attack')
  public async attack(@Body() data: AttackDto) {
    try {
      const responseMessage = await this.gameService.attack(data);
      const dataResponse = new GameDto();
      return dataResponse.toResponse(responseMessage);
    } catch (error) {
      throw error;
    }
  }
}
