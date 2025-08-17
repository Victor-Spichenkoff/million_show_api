import { resolve } from 'path';
import { config as configDotenv } from 'dotenv';

export const configDotEnvFile = () => {
    console.log(process.env.NODE_ENV)
    switch (process.env.NODE_ENV) {
        case 'development':
            configDotenv({ path: resolve(__dirname, '../.env.development') });
            break;
        case 'test':
            configDotenv({ path: resolve(__dirname, '../.env.test') });
            break;
        default:
            configDotenv({ path: resolve(__dirname, '../.env')})
            break
    }
}
