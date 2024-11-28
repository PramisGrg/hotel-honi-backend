import { Router } from 'express'
import { getAllHotelController, getSingleHotelController } from '../../controllers/hotel/get.controller';
import { createHotelSchema } from '../../schema/hotel/create.schema';
import { validateBody } from '../../middlewares/validateBody.middleware';
import { createHotelController } from '../../controllers/hotel/create.controller';
import { updateHotelController } from '../../controllers/hotel/update.controller';
import { updateHotelSchema } from '../../schema/hotel/update.schema';
import { switchHotelSchema } from '../../schema/hotel/switch.schema';
import { switchHotelController } from '../../controllers/hotel/switch.controller';
import { getInvitationsController } from '../../controllers/hotel/invitation.controller';
import { createBillingInformationController, getBillingInformationController, updateBillingInformationController } from '../../controllers/hotel/billing.controller';
import { createBillingInformationSchema, updateBillingInformationSchema } from '../../schema/hotel/billingInformation.schema';
import paymentMethodRouter from './paymentMethod.routes';

const hotelRouter = Router({ mergeParams: true })

hotelRouter.get('/', getSingleHotelController);
hotelRouter.get('/all', getAllHotelController);
hotelRouter.post('/create', validateBody(createHotelSchema), createHotelController);
hotelRouter.patch('/update', validateBody(updateHotelSchema), updateHotelController);
hotelRouter.patch('/switch', validateBody(switchHotelSchema), switchHotelController);
hotelRouter.get('/invitations', getInvitationsController)
hotelRouter.get('/billing-information', getBillingInformationController);
hotelRouter.post('/billing-information', validateBody(createBillingInformationSchema), createBillingInformationController);
hotelRouter.patch('/billing-information', validateBody(updateBillingInformationSchema), updateBillingInformationController);
hotelRouter.use('/payment-methods', paymentMethodRouter);

export default hotelRouter
