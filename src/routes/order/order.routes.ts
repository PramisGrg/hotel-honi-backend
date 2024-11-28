import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody.middleware";
import { createOrderSchema } from "../../schema/order/create.schema";
import { createOrderController } from "../../controllers/order/create.controller";
import { getAllOrderController, getSingleOrderController } from "../../controllers/order/get.controller";
import { checkoutOrderSchema } from "../../schema/order/checkout.schema";
import { checkoutOrderController } from "../../controllers/order/checkout.controller";
import kotRouter from "./kot.routes";
import { getBillDetailsSchema } from "../../schema/order/get.billDetails.schema";
import { getBillDetailsController } from "../../controllers/order/get.billDetails.controller";
const orderRouter = Router({ mergeParams: true })


orderRouter.post('/create', validateBody(createOrderSchema), createOrderController)
orderRouter.get('/all', getAllOrderController);
orderRouter.get('/:orderId', getSingleOrderController);
orderRouter.post('/bill-details', validateBody(getBillDetailsSchema), getBillDetailsController);
orderRouter.post('/checkout', validateBody(checkoutOrderSchema), checkoutOrderController);

//kot for a given order
orderRouter.use('/:orderId/kot', kotRouter)
export default orderRouter
