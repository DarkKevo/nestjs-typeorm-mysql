import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDTO {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Kevin',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    description: 'Número de documento de identidad',
    example: 30259086,
  })
  @IsNumber()
  documentId: number;

  @ApiPropertyOptional({
    description: 'Número de teléfono (opcional)',
    example: 4464566,
  })
  @IsNumber()
  @IsOptional()
  phoneNumber: number;
}
