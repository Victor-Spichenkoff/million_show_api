import { resolve } from 'path'
import { config as configDotenv } from 'dotenv'

export const configDotEnvFile = () => {
    const env = process.env.NODE_ENV || 'default'

    const fileMap = {
        development: '.env.development',
        test: '.env.test',
        localProduction: '.env.localProduction',
        default: '.env',
    }

    const envFile = fileMap[env] || '.env'
    const fullPath = resolve(process.cwd(), envFile)// necessary due to /dist output

    configDotenv({ path: fullPath, override: true })
}

export const Env = {
    isLocalProductionOrDevelopment: () =>
        ["localProduction", "development"].includes(process.env.NODE_ENV ?? ""),

    isDev: () => process.env.NODE_ENV == "development",
}
