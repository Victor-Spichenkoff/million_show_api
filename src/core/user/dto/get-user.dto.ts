import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNumber, IsString, MaxLength, MinLength} from "class-validator";
import {UserRoles} from "../../../../types/roles";

export class GetUserDto {
    @ApiProperty()
    @IsNumber()
    id: number

    @ApiProperty()
    @IsString()
    userName: string

    @ApiProperty()
    @IsEnum(["normal", "adm"], { message: 'There\'s only "normal" and "adm"' })
    role: UserRoles
}
