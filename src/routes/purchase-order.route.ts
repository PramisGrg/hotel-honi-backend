import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.middleware";
import { createPurchaseOrderSchema } from "../schema/purchase-order/create.schema";
import { createPurchaseOrderController } from "../controllers/purchase-order/create.controller";
import { updatePurchaseOrderSchema } from "../schema/purchase-order/update.schema";
import { updatePurchaseOrderController } from "../controllers/purchase-order/update.controller";
import { deletePurchaseOrderController } from "../controllers/purchase-order/delete.controller";
import { getAllPurchaseOrderController, getPurchaseOrderController } from "../controllers/purchase-order/get.controller";

const purchaseOrderRouter = Router({ mergeParams: true })

purchaseOrderRouter.get('/all', getAllPurchaseOrderController);
purchaseOrderRouter.get('/:purchaseOrderId', getPurchaseOrderController);
purchaseOrderRouter.post('/create', validateBody(createPurchaseOrderSchema), createPurchaseOrderController);
purchaseOrderRouter.patch('/update/:purchaseOrderId', validateBody(updatePurchaseOrderSchema), updatePurchaseOrderController);
purchaseOrderRouter.patch('/delete/:purchaseOrderId', deletePurchaseOrderController);

export default purchaseOrderRouter