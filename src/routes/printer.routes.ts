import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.middleware";
import { getAllPrinterController, getSinglePrinterController } from "../controllers/printer/get.controller";
import { createPrinterSchema } from "../schema/printer/create.schema";
import { updatePrinterSchema } from "../schema/printer/update.schema";
import { createPrinterController } from "../controllers/printer/create.controller";
import { updatePrinterController } from "../controllers/printer/update.controller";
import { deletePrinterController } from "../controllers/printer/delete.controller";
const printerRouter = Router({ mergeParams: true })


printerRouter.get("/all", getAllPrinterController);
printerRouter.get('/:printerId', getSinglePrinterController)
printerRouter.post('/create', validateBody(createPrinterSchema), createPrinterController)
printerRouter.patch('/update/:printerId', validateBody(updatePrinterSchema), updatePrinterController)
printerRouter.delete('/delete/:printerId', deletePrinterController)

export default printerRouter;
