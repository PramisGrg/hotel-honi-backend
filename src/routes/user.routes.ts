import { Router } from "express"
import { validateBody } from "../middlewares/validateBody.middleware"
import { getUserController } from "../controllers/user/get.controller"
import { updateUserSchema, updateUserVerifyOtpSchema } from "../schema/user/update.schema"
import { updateUserController, updateUserVerifyOtpController } from "../controllers/user/update.controller"
import { deleteUserController } from "../controllers/user/delete.controller"
import { changePasswordSchema } from "../schema/user/changePassword.schema"
import { changePasswordController } from "../controllers/user/changePassword.controller"
import { UploadFiles, UploadToProvider } from "../middlewares/asset.middleware"
import { deleteRecentDeviceLoginController, getAllRecentDeviceController } from "../controllers/user/recentDevice.controller"
import { getAllInvitationController, getSingleInvitationController } from "../controllers/user/invitations.controller"

const userRouter = Router({ mergeParams: true })

userRouter.get("/", getUserController); //Single User
userRouter.get("/recent-devices", getAllRecentDeviceController);
userRouter.patch('/recent-device/:deviceId', deleteRecentDeviceLoginController);
userRouter.patch("/update", UploadFiles, UploadToProvider({ key: "image", multiple: false }), validateBody(updateUserSchema), updateUserController);
userRouter.patch("/update/verify", validateBody(updateUserVerifyOtpSchema), updateUserVerifyOtpController);
userRouter.patch("/change-password", validateBody(changePasswordSchema), changePasswordController);
userRouter.delete("/delete", deleteUserController);
userRouter.get('/invitation/all', getAllInvitationController);
userRouter.get('/invitation/:invitationId', getSingleInvitationController);
export default userRouter
