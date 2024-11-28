import { Router } from "express";
import { getAllKotController, getSingleKotController, updateKotItemController } from "../../controllers/order/kot.controller";
import { validateBody } from "../../middlewares/validateBody.middleware";
import { updateKotItemSchema } from "../../schema/order/kot/create.schema";

const kotRouter = Router({ mergeParams: true });

kotRouter.get('/all', getAllKotController);
kotRouter.get("/:kotId", getSingleKotController)
kotRouter.patch('/:kotId/:kotItemId', validateBody(updateKotItemSchema), updateKotItemController);

export default kotRouter;
