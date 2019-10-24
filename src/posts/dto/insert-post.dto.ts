import { IsString, IsNotEmpty, IsNumber, ValidateIf, Allow, Min, Max, IsDecimal, IsOptional } from 'class-validator';
import { User } from '../../entities/user.entity';

export class InsertPostDto {
  @IsString()
  @ValidateIf(p => !p.description && !p.image && !p.place)
  title: string;

  @IsString()
  @ValidateIf(p => !p.title && !p.image && !p.place)
  description: string;

  @IsString()
  @ValidateIf(p => !p.title && !p.description && !p.place)
  image: string;

  @IsNumber()
  @Min(1)
  @Max(3)
  mood: number;

  @IsOptional()
  @IsString()
  place: string;

  @IsOptional()
  @IsNumber()
  lat: number;

  @IsOptional()
  @IsNumber()
  lng: number;

  @Allow()
  creator: User;
}
