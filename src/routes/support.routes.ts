import { Router } from "express"
import { getSupportController } from "../controllers/support/get.controller"

const supportRouter = Router({ mergeParams: true })

supportRouter.get("/", getSupportController)

export default supportRouter