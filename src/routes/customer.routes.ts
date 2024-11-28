import { Router } from "express"
import { validateBody } from "../middlewares/validateBody.middleware"
import { getAllCustomerController, getSingleCustomerController } from "../controllers/customer/get.controller"
import { createCustomerSchema } from "../schema/customer/create.schema"
import { createCustomerController } from "../controllers/customer/create.controller"
import { updateCustomerSchema } from "../schema/customer/update.schema"
import { updateCustomerController } from "../controllers/customer/update.controller"
import { deleteCustomerController } from "../controllers/customer/delete.controller"

const customerRouter = Router({ mergeParams: true })

customerRouter.get("/all", getAllCustomerController)
customerRouter.get("/:customerId", getSingleCustomerController)
customerRouter.post("/create", validateBody(createCustomerSchema), createCustomerController)
customerRouter.patch("/update/:customerId", validateBody(updateCustomerSchema), updateCustomerController)
customerRouter.delete("/delete/:customerId", deleteCustomerController)

export default customerRouter
