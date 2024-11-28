import { Router } from "express";
import { getAllRoleController } from "../../controllers/role/get.controller";
import { validateBody } from "../../middlewares/validateBody.middleware";
import { createRoleSchema } from "../../schema/role/create.schema";
import { createRoleController } from "../../controllers/role/create.controller";
import { updateRoleSchema } from "../../schema/role/update.schema";
import { updateRoleController } from "../../controllers/role/update.controller";
import { deleteRoleController } from "../../controllers/role/delete.controller";

const roleRouter = Router({ mergeParams: true })

roleRouter.get('/all', getAllRoleController)
roleRouter.post('/create', validateBody(createRoleSchema), createRoleController)
roleRouter.patch('/update/:roleId', validateBody(updateRoleSchema), updateRoleController)
roleRouter.delete('/delete/:roleId', deleteRoleController)

export default roleRouter