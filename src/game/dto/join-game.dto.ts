import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { RoleEnum } from 'src/common/share/enums/role.enum';

export class JoinGameDto {

  @IsString()
  @IsNotEmpty()
  public readonly gameId: string;

  @Min(1)
  @Max(2)
  @IsNumber()
  @IsNotEmpty()
  public readonly role: number;

  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}
