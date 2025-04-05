import { Controller, Get } from '@nestjs/common'


@Controller('')
export class AppController {
    @Get("/teste")
    test() {
        return "Funcionando "
    }
    @Get("/testes")
    tests() {
        return "Funcionando "
    }

    @Get()
    root() {
        return "Tested"
    }
}
