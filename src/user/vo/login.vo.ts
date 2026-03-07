import { User } from "../entities/user.entity"

export class LoginUserVo {
  elements: {
    user: User,
    token: string
  }
  message: string
  success: boolean
}