import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ShipPlacementDto {

  @IsString()
  @IsNotEmpty()
  public readonly id: string;

  @Min(1)
  @Max(4)
  @IsNumber()
  @IsNotEmpty()
  public readonly shipType: number;

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
  @Max(4)
  @IsNotEmpty()
  public readonly rotate: number;
}
