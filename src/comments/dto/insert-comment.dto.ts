import { IsNumber, IsInt, IsString, Min, Max, Allow } from "class-validator";

export class InsertCommentDto {
    @IsString()
    readonly text: string;

    @Allow()
    post;

    @Allow()
    user;
}
