import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.middleware";
import { invitationActionSchema, inviteStaffSchema, updateInviteStaffSchema } from "../schema/staff/invite.schema";
import { inviteStaffController, inviteStaffActionController, updateInviteStaffController } from "../controllers/staff/invite.controller";
import { getAllStaffController } from "../controllers/staff/get.controller";
import { updateStaffSchema } from "../schema/staff/update.schema";
import { updateStaffController } from "../controllers/staff/update.controller";
import { deleteStaffController, deleteStaffInvitationController } from "../controllers/staff/delete.controller";

const staffRouter = Router({ mergeParams: true });

staffRouter.get('/all', getAllStaffController);
staffRouter.post('/invite', validateBody(inviteStaffSchema), inviteStaffController);
staffRouter.patch('/invite/update', validateBody(updateInviteStaffSchema), updateInviteStaffController);
staffRouter.patch('/invite/action', validateBody(invitationActionSchema), inviteStaffActionController);
staffRouter.patch('/update', validateBody(updateStaffSchema), updateStaffController);
staffRouter.delete('/delete-invitation/:invitationId', deleteStaffInvitationController);
staffRouter.delete('/delete-staff/:staffId', deleteStaffController);

export default staffRouter;
