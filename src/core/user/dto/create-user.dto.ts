import { ApiProperty } from "@nestjs/swagger";
import {IsEnum, IsString, MaxLength, MinLength} from "class-validator";
import {UserRoles} from "../../../../types/roles";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    userName: string

    @ApiProperty()
    @IsString()
    @MinLength(4, { message: 'Password must be at least 4' })
    @MaxLength(12, { message: 'Password must be lower than 12+1 characters' })
    password: string

    @ApiProperty()
    @IsEnum(["normal", "adm"], { message: 'There\'s only "normal" and "adm"' })
    role: UserRoles
}
