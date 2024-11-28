import { Router } from "express"
import { validateBody } from "../../middlewares/validateBody.middleware"
import { createRoomSchema } from "../../schema/space/room/create.schema"
import { createRoomController } from "../../controllers/space/room/create.controller"
import { updateRoomController } from "../../controllers/space/room/update.controller"
import { updateRoomSchema } from "../../schema/space/room/update.schema"
import { deleteRoomController } from "../../controllers/space/room/delete.controller"
import { getAllRoomController, getSingleRoomController } from "../../controllers/space/room/get.controller"
import { UploadFiles, UploadToProvider } from "../../middlewares/asset.middleware"
const roomRouter = Router({ mergeParams: true })

roomRouter.get("/all", getAllRoomController)
roomRouter.get("/:roomId", getSingleRoomController)
roomRouter.post("/create", UploadFiles, UploadToProvider({ key: "image", multiple: true }), validateBody(createRoomSchema), createRoomController)
roomRouter.patch("/update/:roomId", UploadFiles, UploadToProvider({ key: "image", multiple: true }), validateBody(updateRoomSchema), updateRoomController)
roomRouter.delete("/delete/:roomId", deleteRoomController)

export default roomRouter
