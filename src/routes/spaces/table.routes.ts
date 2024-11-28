import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody.middleware";
import { createTableSchema } from "../../schema/space/table/create.schema";
import { updateTableSchema } from "../../schema/space/table/update.schema";
import { getAllTableController, getSingleTableController } from "../../controllers/space/table/get.controller";
import { createTableController } from "../../controllers/space/table/create.controller";
import { updateTableController } from "../../controllers/space/table/update.controller";
import { deleteTableController } from "../../controllers/space/table/delete.controller";
const tableRouter = Router({ mergeParams: true })

tableRouter.get('/all', getAllTableController);
tableRouter.get('/:tableId', getSingleTableController);
tableRouter.post('/create', validateBody(createTableSchema), createTableController);
tableRouter.patch('/update/:tableId', validateBody(updateTableSchema), updateTableController);
tableRouter.delete('/delete/:tableId', deleteTableController);

export default tableRouter;
