import { Router } from "express"
import { validateBody } from "../middlewares/validateBody.middleware"
import { getAllSupplierController, getSingleSupplierController } from "../controllers/supplier/get.controller"
import { createSupplierSchema } from "../schema/supplier/create.schema"
import { updateSupplierSchema } from "../schema/supplier/update.schema"
import { createSupplierController } from "../controllers/supplier/create.controller"
import { updateSupplierController } from "../controllers/supplier/update.controller"
import { deleteSupplierController } from "../controllers/supplier/delete.controller"

const supplierRouter = Router({ mergeParams: true })

supplierRouter.get("/all", getAllSupplierController)
supplierRouter.get("/:supplierId", getSingleSupplierController)
supplierRouter.post("/create", validateBody(createSupplierSchema), createSupplierController)
supplierRouter.patch("/update/:supplierId", validateBody(updateSupplierSchema), updateSupplierController)
supplierRouter.delete("/delete/:supplierId", deleteSupplierController)

export default supplierRouter
