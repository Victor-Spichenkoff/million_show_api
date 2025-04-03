import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly jwtService: JwtService) {
        super()
    }

    //precisa chamar o pai
    canActivate(context: ExecutionContext) {
        return super.canActivate(context); // Mantém a autenticação do Nest
    }


    // substitui o original, posso mexer nele
    handleRequest(err, user, info, context) {
        if (err || !user) {
            throw new UnauthorizedException('Token invalid');
        }

        // Adiciona o usuário na requisição para handlers posteriores
        const request = context.switchToHttp().getRequest();
        request.user = user;

        return user; // Retorna o usuário autenticado
    }
}