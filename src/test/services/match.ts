import * as request from 'supertest'

export const matchServiceFactory = (server: any, token: string) => {
    const internalServer = server
    const internalToken = token

    const startMatch = async () =>
        await request(server)
            .post('/match/start')
            .set('Authorization', 'Bearer ' + token)
            .expect(201)

    const getNextQuestion = async () =>
        await request(server) //a question
            .get('/match/next?isEn=true')// only the last question on seed (all en)
            .set('Authorization', 'Bearer ' + token)

    const answerQuestion = async (answerIndex: number) =>
        await request(server) //a question
            .patch('/match/answer/' + answerIndex.toString())
            .set('Authorization', 'Bearer ' + token)

    return { startMatch, getNextQuestion, answerQuestion }
}

export const startMatch = async (server: any, token: string) => await request(server)
    .post('/match/start')
    .set("Authorization", "Bearer " + token)
    .expect(201)

// export const getNextQuestion = async (server: any, token: string) => await request(server)//a question
//     .post('/match/next')
//     .set("Authorization", "Bearer " + token)
//
//
// export const answerQuestion = async (server: any, token: string, answerIndex: number) => await request(server)//a question
//     .post('/match/answer/'+answerIndex)
//     .set("Authorization", "Bearer " + token)
