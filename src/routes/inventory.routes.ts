import { Router } from "express"
import { validateBody } from "../middlewares/validateBody.middleware"
import { createInventorySchema } from "../schema/inventory/create.schema"
import { createInventoryController } from "../controllers/inventory/create.controller"
import { UploadFiles, UploadToProvider } from "../middlewares/asset.middleware"
import { updateInventorySchema } from "../schema/inventory/update.schema"
import { updateInventoryController } from "../controllers/inventory/update.controller"
import { getAllInventoryController, getInventoryController } from "../controllers/inventory/get.controller"
import { deleteInventoryController } from "../controllers/inventory/delete.controller"

const inventoryRouter = Router({ mergeParams: true })

inventoryRouter.get("/all", getAllInventoryController)
inventoryRouter.get("/:inventoryId", getInventoryController)

inventoryRouter.post(
  "/create",
  UploadFiles,
  UploadToProvider({ key: "image", multiple: false }),
  validateBody(createInventorySchema),
  createInventoryController
)

inventoryRouter.patch(
  "/update/:inventoryId",
  UploadFiles,
  UploadToProvider({ key: "image", multiple: false }),
  validateBody(updateInventorySchema),
  updateInventoryController
)

inventoryRouter.delete("/delete/:inventoryId", deleteInventoryController)

export default inventoryRouter
