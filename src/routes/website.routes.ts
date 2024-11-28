import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validateBody } from "../middlewares/validateBody.middleware"
import { createWebsiteSchema } from "../schema/website/create.schema"
import { createWebsiteController } from "../controllers/website/create.controller"
import { getWebsiteController } from "../controllers/website/get.controller"
import { updateWebsiteSchema } from "../schema/website/update.schema"
import { updateWebsiteController } from "../controllers/website/update.controller"
import { deleteWebsiteController } from "../controllers/website/delete.controller"

const websiteRouter = Router({ mergeParams: true })

websiteRouter.get("/get", authMiddleware, getWebsiteController)
websiteRouter.post("/create", authMiddleware, validateBody(createWebsiteSchema), createWebsiteController)
websiteRouter.patch("/update/:websiteId", authMiddleware, validateBody(updateWebsiteSchema), updateWebsiteController)
websiteRouter.delete("/delete/:websiteId", authMiddleware, deleteWebsiteController)

export default websiteRouter
