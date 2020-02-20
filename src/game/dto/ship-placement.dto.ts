import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ShipPlacementDto {

  @IsString()
  @IsNotEmpty()
  public readonly gameId: string;

  @IsString()
  @IsNotEmpty()
  public readonly shipId: string;

  @Min(1)
  @Max(10)
  @IsNumber()
  @IsNotEmpty()
  public readonly x: number;

  @Min(1)
  @Max(10)
  @IsNumber()
  @IsNotEmpty()
  public readonly y: number;

  @Min(1)
  @Max(2)
  @IsNotEmpty()
  public readonly rotate: number;
}
