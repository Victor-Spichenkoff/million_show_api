import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import {configDotEnvFile} from "config/dotenv";

describe('App E2E', () => {
    let app: INestApplication;
    let server: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        console.log(process.env.NODE_ENV)
        console.log(process.env.DB_PATH)

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
