import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class FollowUserDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}
