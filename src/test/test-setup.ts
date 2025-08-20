// need to be the first
import {configDotEnvFile} from "config/dotenv";
configDotEnvFile()


import { Test } from '@nestjs/testing'
import {AppModule} from "src/app.module";

export async function setupTestApp() {
    configDotEnvFile()

    const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
    }).compile()

    const setupApp = moduleFixture.createNestApplication()
    await setupApp.init()

    const setupServer = setupApp.getHttpServer()

    return { setupApp, setupServer }
}
