import * as request from 'supertest'

export const matchServiceFactory = (server: any, token: string) => {
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
        await request(server)
            .patch('/match/answer/' + answerIndex.toString())
            .set('Authorization', 'Bearer ' + token)

    const stopMatch = async () =>
        await request(server)
            .post('/match/stop/')
            .set('Authorization', 'Bearer ' + token)

    const getCurrentQuestion = async () =>
        await request(server)
            .get('/match/stop/')
            .set('Authorization', 'Bearer ' + token)


    return { startMatch, getNextQuestion, answerQuestion, stopMatch, getCurrentQuestion }
}
