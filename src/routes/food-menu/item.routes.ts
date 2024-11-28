import { Router } from "express"
import { getAllMenuItemController, getSingleMenuItemController } from "../../controllers/food-menu/menu/get.controller"
import { createMenuItemSchema } from "../../schema/food-menu/item/create.schema"
import { validateBody } from "../../middlewares/validateBody.middleware"
import { createMenuItemController } from "../../controllers/food-menu/menu/create.controller"
import { updateMenuItemController } from "../../controllers/food-menu/menu/update.controller"
import { updateMenuItemSchema } from "../../schema/food-menu/item/update.schema"
import { deleteMenuItemController } from "../../controllers/food-menu/menu/delete.controller"
import { UploadFiles, UploadToProvider } from "../../middlewares/asset.middleware"

const menuItemRouter = Router({ mergeParams: true })

menuItemRouter.get("/all", getAllMenuItemController)
menuItemRouter.get("/:itemId", getSingleMenuItemController)
menuItemRouter.post(
  "/create",
  UploadFiles,
  UploadToProvider({ key: "image", multiple: false }),
  validateBody(createMenuItemSchema),
  createMenuItemController
)
menuItemRouter.patch(
  "/update/:itemId",
  UploadFiles,
  UploadToProvider({ key: "image", multiple: false }),
  validateBody(updateMenuItemSchema),
  updateMenuItemController
)
menuItemRouter.delete("/delete/:itemId", deleteMenuItemController)

export default menuItemRouter
