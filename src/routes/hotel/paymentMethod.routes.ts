import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody.middleware";
import { createPaymentMethodSchema } from "../../schema/hotel/paymentMethod/create.schema";
import { updatePaymentMethodSchema } from "../../schema/hotel/paymentMethod/update.schema";
import { deletePaymentMethodController } from "../../controllers/hotel/paymentMethod/delete.controller";
import { updatePaymentMethodController } from "../../controllers/hotel/paymentMethod/update.controller";
import { createPaymentMethodController } from "../../controllers/hotel/paymentMethod/create.controller";
import { getAllPaymentMethodController } from "../../controllers/hotel/paymentMethod/get.controller";
const paymentMethodRouter = Router({ mergeParams: true });

paymentMethodRouter.get('/', getAllPaymentMethodController);
paymentMethodRouter.post('/', validateBody(createPaymentMethodSchema), createPaymentMethodController);
paymentMethodRouter.patch('/:paymentMethodId', validateBody(updatePaymentMethodSchema), updatePaymentMethodController);
paymentMethodRouter.delete('/:paymentMethodId', deletePaymentMethodController);


export default paymentMethodRouter;
