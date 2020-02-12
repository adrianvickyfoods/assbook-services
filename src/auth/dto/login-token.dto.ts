
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class LoginTokenDto {
    @IsString()
    @IsNotEmpty()
    readonly token: string;

    @IsString()
    @IsOptional()
    readonly firebaseToken: string;
}