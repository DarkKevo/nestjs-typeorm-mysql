import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreatePostDTO {
  @ApiProperty({
    description: 'Titulo del Post',
    example: 'Comprar Papaya',
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({
    description: 'Description del Post',
    example: 'Tengo que ir al super a comprar papayas',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({
    description: 'Id del Creador del Post',
    example: 1,
  })
  @IsNumber()
  autorId: number;
}
