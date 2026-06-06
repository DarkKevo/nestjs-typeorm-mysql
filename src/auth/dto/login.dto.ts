import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'kevin',
    description: 'Nombre del usuario',
  })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({
    example: '123456',
    description: 'Clave del usuario',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
