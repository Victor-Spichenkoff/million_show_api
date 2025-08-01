import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {Transform} from "class-transformer";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value === '' ? undefined : value)
    @MinLength(4, { message: 'Current password must be at least 4' })
    @MaxLength(12, { message: 'Current password must be lower than 12 characters' })
    currentPassword?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value === '' ? undefined : value)
    @MinLength(4, { message: 'Password must be at least 4' })
    @MaxLength(12, { message: 'Password must be lower than 12 characters' })
    newPassword?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value === '' ? undefined : value)
    @MinLength(4, { message: 'Password must be at least 4' })
    @MaxLength(12, { message: 'Password must be lower than 12 characters' })
    password?: string
}
