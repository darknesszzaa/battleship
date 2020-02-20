import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class AttackDto {
  @IsString()
  @IsNotEmpty()
  public readonly id: string;

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
}
