import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { config as configDotenv } from 'dotenv'
import { resolve } from 'path'
import {configDotEnvFile} from "config/dotenv";

//TODO: IS working now?
// configDotenv({ path: resolve(__dirname, '../../.env.test') })

configDotEnvFile()

describe('App E2E', () => {
    let app: INestApplication;
    let server: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        console.log("")
        console.log("TEST_ENV" + process.env.NODE_ENV)
        console.log("TEST_PATH" + process.env.DB_PATH)

        app = moduleFixture.createNestApplication();
        await app.init();
        server = app.getHttpServer();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET / (Hello World)', async () => {
        const res = await request(server).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Hello World!');
    });
});
