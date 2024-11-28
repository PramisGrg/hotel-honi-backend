import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.middleware";
import { createTransactionSchema } from "../schema/transaction/create.schema";
import { createTransactionController } from "../controllers/transaction/create.controller";
import { getAllTransactionController, getTransactionController } from "../controllers/transaction/get.controller";

const transactionRouter = Router({ mergeParams: true })

transactionRouter.get("/all", getAllTransactionController)
transactionRouter.get("/:userId", getTransactionController)
transactionRouter.post("/", validateBody(createTransactionSchema), createTransactionController)

export default transactionRouter