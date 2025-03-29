import { ValidationPipeOptions } from "@nestjs/common";

export const PipeValidationConfig: ValidationPipeOptions = {
    whitelist: true,
    always: true,
}