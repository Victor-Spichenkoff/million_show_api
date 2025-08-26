import { dbConfig } from '../../config/dbConfig'
import { Question } from '../../models/question.model'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeedQuestions } from './seedQuestions'
import {configDotEnvFile, Env} from "../../config/dotenv";
import * as process from "node:process";

configDotEnvFile()
if(!Env.isSeedModeOn()) {
    console.log("[SEED] SEED MODE IS OFF")
    process.exit(0)
}


export const seed = async (dataSource: DataSource) => {
    if(!dataSource.isInitialized)
        await dataSource.initialize()

    console.log('\n[ SEED ] Seeding questions... ')
    const questionRepository = dataSource.getRepository(Question)
    const successQuestionCount = await SeedQuestions(questionRepository)
    if (successQuestionCount) console.log('[ SEED ]  Questions Inserted ' + successQuestionCount)
    else console.log('[ SEED ] ❌ Nothing seeded')

    console.log('[ SEED ] 🚀 Seed finished')
}

if (process.env.NODE_ENV != 'test') {
    const dataSource = new DataSource(dbConfig as DataSourceOptions) // erro aqui

    seed(dataSource).catch((err) => {
        console.error('[ SEED ] ❌ Seed error:', err)
        process.exit(1)
    })

    dataSource.destroy()
} else console.log('NO AUTO SEED - TEST ENVIRONMENT')
