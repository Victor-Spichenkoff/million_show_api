import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(BadRequestException)
export class ShortErrorFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        // pegar infos
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const status = exception.getStatus()
        const exceptionResponse = exception.getResponse() as any

        // Personalizando o formato do erro
        const formattedError = {
            message: exceptionResponse.message[0],
            statusCode: status,
            path: ctx.getRequest().url,
        }

        response.status(status).json(formattedError)
    }
}