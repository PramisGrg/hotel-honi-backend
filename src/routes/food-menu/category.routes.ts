import { Router } from "express"
import { createFoodMenuCategorySchema } from "../../schema/food-menu/category/create.schema"
import { validateBody } from "../../middlewares/validateBody.middleware"
import { createFoodCategoryController } from "../../controllers/food-menu/category/create.controller"
import {
  getAllFoodMenuCategoryController,
  getSingleFoodMenuCategoryController
} from "../../controllers/food-menu/category/get.controller"
import { updateFoodMenuCategorySchema } from "../../schema/food-menu/category/update.schema"
import { updateFoodMenuCategoryController } from "../../controllers/food-menu/category/update.controller"
import { deleteFoodMenuCategoryController } from "../../controllers/food-menu/category/delete.controller"
import { UploadFiles, UploadToProvider } from "../../middlewares/asset.middleware"

const menuCategoryRouter = Router({ mergeParams: true })

menuCategoryRouter.get("/all", getAllFoodMenuCategoryController)
menuCategoryRouter.get("/:categoryId", getSingleFoodMenuCategoryController)
menuCategoryRouter.post(
  "/create",
  UploadFiles,
  UploadToProvider({ key: "image", multiple: false }),
  validateBody(createFoodMenuCategorySchema),
  createFoodCategoryController
)
menuCategoryRouter.patch(
  "/update/:categoryId",
  UploadFiles,
  UploadToProvider({ key: "image", multiple: false }),
  validateBody(updateFoodMenuCategorySchema),
  updateFoodMenuCategoryController
)
menuCategoryRouter.delete("/delete/:categoryId", deleteFoodMenuCategoryController)

export default menuCategoryRouter
