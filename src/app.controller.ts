import { Controller, Get } from '@nestjs/common'
import {Sleep} from "helpers/time";


@Controller('')
export class AppController {
    @Get("/teste")
    async test() {
        return "Funcionando"
    }
    @Get("/testes")
    tests() {
        return "Funcionando"
    }

    @Get()
    root() {
        return "Tested"
    }
}
