import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ConfirmShipPleacementDto {
  @IsString()
  @IsNotEmpty()
  public readonly gameId: string;
}
