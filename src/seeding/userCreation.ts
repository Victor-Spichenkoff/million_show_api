import axios from 'axios'
import { getRandomIntInclusive } from '../../helpers/numeric'
import {configDotEnvFile, Env} from "../../config/dotenv";

configDotEnvFile()

if(!Env.isSeedModeOn())
    throw new Error("[SEED USER] SEED MODE IS OFF")

const baseUrl = 'http://localhost:2006'

const names = [
    'james',
    'maria',
    'john',
    'a',
    'bs',
    'l',
    'kadshdndsnj',
    'player_123',
    'player_one',
    'player_one',
    'ビクター',
    'max_33',
    'max_33',
]

const create = false

async function createAndPlay(name: string) {
    try {
        const userName = name
        const password = '12345'

        // 1. create
        try {
            if (create)
                await axios.post(`${baseUrl}/auth/signup`, {
                    userName,
                    password,
                    role: 'normal',
                })
        } catch (e) {}

        // 2. login
        const loginRes = await axios.post(`${baseUrl}/auth/signin`, {
            userName,
            password,
        })
        const token = loginRes.data.access_token

        const totalMatches = getRandomIntInclusive(1, 10)
        console.log(`\n\n===================================================`)
        console.log(`[${userName}] -> ${totalMatches} matches`)

        for (let i = 1; i <= totalMatches; i++) {
            // start
            try {
                await axios.post(
                    `${baseUrl}/match/start`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                )
            } catch (e) {
                console.log('ERROR match/start: ' + e.response?.data.message)
            }

            // in case it don't auto-create

            try {
                 await axios.get(`${baseUrl}/match/${i}`)

            } catch{}

            // one round
            while (true) {
                // make a cancellation (5%)
                if (getRandomIntInclusive(0, 20) == 20) {
                    await axios.post(
                        `${baseUrl}/match/start?force=true`,
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        },
                    )
                    console.log('CANCEL!')
                    break
                }

                let currentQuestion: any

                currentQuestion = await axios.get(`${baseUrl}/match/next`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                //use hint
                if (getRandomIntInclusive(0, 10) > 5) {
                    try {
                        await axios.get(`${baseUrl}/hint/half`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                    } catch {}
                }

                try {
                    // correct
                    if (getRandomIntInclusive(0, 10 + currentQuestion.data.level * 2) <= 9) {
                        const res = await axios.patch(
                            `${baseUrl}/match/answer/${currentQuestion.data.answerIndex}`,
                            {},
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            },
                        )
                        if (res.data.points) {
                            console.log(`[ ${userName} ] It's million`)
                            break
                        }
                    } else {
                        // wrong
                        console.log('WRONG!')
                        await axios.patch(
                            `${baseUrl}/match/answer/${currentQuestion.data.answerIndex == 1 ? 2 : 1}`,
                            {},
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            },
                        )
                        break
                    }
                } catch {}

                // stop
                if (getRandomIntInclusive(0, 9 + currentQuestion.data.level) > 9) {
                    console.log('STOP!')
                    await axios.post(
                        `${baseUrl}/match/stop`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } },
                    )
                    break
                }
            }
        }
    } catch (err: any) {
        console.error(
            `ERROR with ${name} ${err.response?.data.path}: ${err.message} | ${err.response?.data.message}`,
        )
    }
}

// Cria e joga com 10 usuários
;(async () => {
    for (let name of names) {
        await createAndPlay(name)
    }
    // await createAndPlay("max_33")
})()

//start:
// "id": 88,
//     "state": "playing",
//     "hintState": "none",
//     "skips": 2,
//     "halfHalf": 1,
//     "universitary": 2,
//     "questionIndex": 0,
//     "startDate": "2025-08-04T13:54:25.000Z",
//     "wrongPrize": 0,
//     "stopPrize": 0,
//     "nextPrize": 1000,
//     "questionState": "waiting",
//     "historic": {
//     "id": 124,
//         "finalPrize": 0,
//         "finishDate": 0,
//         "finalState": null
// }

//next
// {
//     "id": 19,
//     "isBr": true,
//     "label": "Qual destes objetos usamos para cortar papel?",
//     "option1": "Martelo",
//     "option2": "Tesoura",
//     "option3": "Colher",
//     "option4": "Lápis",
//     "level": 1,
//     "answerIndex": "2"
// }

// asnwer:
// {
//     "isCorrect": true
// }
