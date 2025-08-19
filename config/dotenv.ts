import { resolve } from 'path'
import { config as configDotenv } from 'dotenv'

// Alternativa
export const configDotEnvFile = () => {
    const env = process.env.NODE_ENV || 'default'

    const fileMap = {
        development: '.env.development',
        test: '.env.test',
        production: '.env.production',
        default: '.env',
    }

    const envFile = fileMap[env] || '.env'
    const fullPath = resolve(process.cwd(), envFile)// necessary due to /dist output

    configDotenv({ path: fullPath, override: true })
}
