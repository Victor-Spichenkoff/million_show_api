import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {IsInt, isInt, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(4, { message: 'Current password must be at least 4' })
    @MaxLength(12, { message: 'Current password must be lower than 12 characters' })
    currentPassword: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(4, { message: 'Password must be at least 4' })
    @MaxLength(12, { message: 'Password must be lower than 12 characters' })
    newPassword: string
}
