import axios from "axios";
import {baseUrl} from "../../../global";

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
