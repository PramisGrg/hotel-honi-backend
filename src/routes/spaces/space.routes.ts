import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody.middleware";
import { createSpaceSchema } from "../../schema/space/space/create.schema";
import { createSpaceController } from "../../controllers/space/space/create.controller";
import { updateSpaceSchema } from "../../schema/space/space/update.schema";
import { updateSpaceController } from "../../controllers/space/space/update.controller";
import { deleteSpaceController } from "../../controllers/space/space/delete.space";
import { getAllSpaceController, getSingleSpaceController } from "../../controllers/space/space/get.controller";
const spaceRouter = Router({ mergeParams: true })



spaceRouter.get('/all', getAllSpaceController);
spaceRouter.get('/:spaceId', getSingleSpaceController);
spaceRouter.post('/create', validateBody(createSpaceSchema), createSpaceController);
spaceRouter.patch('/update/:spaceId', validateBody(updateSpaceSchema), updateSpaceController);
spaceRouter.delete('/delete/:spaceId', deleteSpaceController);

export default spaceRouter
