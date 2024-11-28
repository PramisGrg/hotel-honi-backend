import { Router } from "express"
import { validateBody } from "../middlewares/validateBody.middleware"
import {
  registerUserResendOtpSchema,
  registerUserSchema,
  registerUserVerifyOtpSchema
} from "../schema/auth/register.schema"
import {
  registerUserController,
  registerUserResendOtpController,
  registerUserVerifyOtpController
} from "../controllers/auth/register.controller"
import { loginUserSchema } from "../schema/auth/login.schema"
import { loginUserController } from "../controllers/auth/login.controller"
import {
  resetUserPasswordResendOtpSchema,
  resetUserPasswordSendOtpSchema,
  resetUserPasswordSetNewSchema,
  resetUserPasswordVerifyOtpSchema
} from "../schema/auth/reset.schema"
import {
  resetUserPasswordResendOtpController,
  resetUserPasswordSendOtpController,
  resetUserPasswordSetNewController,
  resetUserPasswordVerifyOtpController
} from "../controllers/auth/reset.controller"
import { recentDeviceMiddleware } from "../middlewares/recentDevice.middleware"

const authRouter = Router({ mergeParams: true })

//to register a user
authRouter.post("/register", validateBody(registerUserSchema), registerUserController)
authRouter.post("/register/resend", validateBody(registerUserResendOtpSchema), registerUserResendOtpController)
authRouter.patch("/register", recentDeviceMiddleware, validateBody(registerUserVerifyOtpSchema), registerUserVerifyOtpController)

//to login a user
authRouter.post("/login", recentDeviceMiddleware, validateBody(loginUserSchema), loginUserController)

//to reset password for a user
authRouter.post(
  "/reset-password/send",
  validateBody(resetUserPasswordSendOtpSchema),
  resetUserPasswordSendOtpController
)
authRouter.post(
  "/reset-password/resend",
  validateBody(resetUserPasswordResendOtpSchema),
  resetUserPasswordResendOtpController
)
authRouter.post(
  "/reset-password/verify",
  validateBody(resetUserPasswordVerifyOtpSchema),
  resetUserPasswordVerifyOtpController
)

authRouter.post("/reset-password/set",
  validateBody(resetUserPasswordSetNewSchema),
  resetUserPasswordSetNewController
)

export default authRouter
