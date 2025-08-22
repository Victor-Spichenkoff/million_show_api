import axios from "axios";
import {baseUrl} from "../../../global";
import * as request from "supertest";

export const testAuthData = {
    userName: "new_user",
    password: "1234",
}

export const hasUser = async () => {
    return (await axios.get(baseUrl+"/user")).data.has(u => u.userName === testAuthData.userName);
}

export const createAccount = async () => {

    try {
    await axios.post(`${baseUrl}/auth/signup`)
        return true
    } catch {
        return false
    }
}

export const loginAndGetAccessToken = async () => {
    const res = await axios.post(`${baseUrl}/auth/signin`)
    return res.data.access_token

}

export const getAuthTokenTest = async (server: any) => {
    await request(server)
        .post('/auth/signup')
        .send({ userName: testAuthData.userName, password: testAuthData.password })

    const loginRes = await request(server)
        .post('/auth/signin')
        .send({ userName: testAuthData.userName, password: testAuthData.password })
        .expect(201)

    return loginRes.body.access_token
}
