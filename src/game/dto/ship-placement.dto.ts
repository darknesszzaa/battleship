import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ShipPlacementDto {

  @IsString()
  @IsNotEmpty()
  public readonly gameId: string;

  @IsString()
  @IsNotEmpty()
  public readonly shipId: string;

  @Min(1)
  @Max(Number(process.env.SIZE_HORIZON_GRID))
  @IsNumber()
  @IsNotEmpty()
  public readonly x: number;

  @Min(1)
  @Max(Number(process.env.SIZE_VERTICAL_GRID))
  @IsNumber()
  @IsNotEmpty()
  public readonly y: number;

  @Min(1)
  @Max(2)
  @IsNotEmpty()
  public readonly rotate: number;
}
