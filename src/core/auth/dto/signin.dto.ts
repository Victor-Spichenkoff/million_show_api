import { IsString, Max, Min } from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';


export class SignInDto {
  @IsString()
  @ApiProperty()
  userName: string

  @IsString()
  @ApiProperty()
  @Min(4, {message: 'Password must be between 4 and 12 characters' })
  @Max(12, {message: 'Password must be between 4 and 12 characters' })
  password: string
}
