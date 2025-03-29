import { User } from "models/user.model"

export interface AuthUser extends User {
    id: number,
    userName: string
}

export interface AuthReq {
    user: AuthUser
} 