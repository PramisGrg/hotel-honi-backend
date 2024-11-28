import { Router } from "express"
import { getAllSalesController } from "../controllers/sales/get.controller"

const salesRouter = Router({ mergeParams: true })

salesRouter.get("/all", getAllSalesController)

export default salesRouter