import { dbConfig } from "../../config/dbConfig"
import { Question } from "../../models/question.model"
import { DataSource, DataSourceOptions } from "typeorm"
import { SeedQuestions } from "./seedQuestions"

const dataSource = new DataSource(dbConfig as DataSourceOptions)// erro aqui



const seed = async () => {
    await dataSource.initialize()
    
    console.log("\n[ SEED ] Seeding questions... ")
    const questionRepository = dataSource.getRepository(Question)
    const successQuestionCount = await SeedQuestions(questionRepository)
    if(successQuestionCount)
        console.log("[ SEED ]  Questions Inserted " + successQuestionCount)
    else
        console.log("[ SEED ] ❌ Nothing seeded")
    
    await dataSource.destroy()
    console.log("[ SEED ] 🚀 Seed finished")
  }
  
  // Roda o seed
  seed().catch((err) => {
    console.error("[ SEED ] ❌ Erro no seed:", err)
    process.exit(1)
  })