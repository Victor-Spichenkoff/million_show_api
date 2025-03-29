import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
    HttpException,
} from '@nestjs/common'
import { Response } from 'express'

// @Catch(BadRequestException)
export class CustomBadRequestFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        // pegar infos
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const status = exception.getStatus()
        const exceptionResponse = exception.getResponse() as any

        // Personalizando o formato do erro
        const formattedError = {
            statusCode: status,
            error: 'Bad Request',
            message: Array.isArray(exceptionResponse.message) ? exceptionResponse.message[0] : exceptionResponse.message,
            details: Array.isArray(exceptionResponse.message)
                ? exceptionResponse.message.map((msg) => ({
                    field: msg.split(' ')[0].toLowerCase(), // Pega o primeiro "termo" como campo
                    message: msg,
                }))
                : null,//[{ field: 'none', message: exceptionResponse.message }],
            timestamp: new Date().toISOString(),
            path: ctx.getRequest().url,
        }

        response.status(status).json(formattedError)
    }
}