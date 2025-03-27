import { PartialType } from '@nestjs/swagger';
import { SignInDto } from './signin.dto';

export class SignupDto extends PartialType(SignInDto) {}
