import { Router } from "express"
import authRouter from "./auth.routes"
import userRouter from "./user.routes"
import { authMiddleware } from "../middlewares/auth.middleware"
import menuItemRouter from "./food-menu/item.routes"
import menuCategoryRouter from "./food-menu/category.routes"
import spaceRouter from "./spaces/space.routes"
import roomRouter from "./spaces/room.routes"
import tableRouter from "./spaces/table.routes"
import customerRouter from "./customer.routes"
import supplierRouter from "./supplier.routes"
import printerRouter from "./printer.routes"
import websiteRouter from "./website.routes"
import inventoryRouter from "./inventory.routes"
import orderRouter from "./order/order.routes"
import staffRouter from "./staff.routes"
import purchaseOrderRouter from "./purchase-order.route"
import hotelRouter from "./hotel/hotel.routes"
import roleRouter from "./hotel/role.routes"
import transactionRouter from "./transaction.routes"
import salesRouter from "./sales.routes"
import supportRouter from "./support.routes"

const mainRouter = Router({ mergeParams: true })

mainRouter.use("/auth", authRouter)
mainRouter.use("/hotel", authMiddleware, hotelRouter)
mainRouter.use("/user", authMiddleware, userRouter)
mainRouter.use('/role', authMiddleware, roleRouter)
mainRouter.use("/menu/items", authMiddleware, menuItemRouter)
mainRouter.use("/menu/category", authMiddleware, menuCategoryRouter)
mainRouter.use("/space/", authMiddleware, spaceRouter)
mainRouter.use("/room", authMiddleware, roomRouter)
mainRouter.use("/table", authMiddleware, tableRouter)
mainRouter.use("/customer", authMiddleware, customerRouter)
mainRouter.use("/supplier", authMiddleware, supplierRouter)
mainRouter.use("/printer", authMiddleware, printerRouter)
mainRouter.use("/order", authMiddleware, orderRouter)
mainRouter.use("/website", authMiddleware, websiteRouter)
mainRouter.use("/inventory", authMiddleware, inventoryRouter)
mainRouter.use("/staff", authMiddleware, staffRouter)
mainRouter.use("/purchase-order", authMiddleware, purchaseOrderRouter)
mainRouter.use("/transaction", authMiddleware, transactionRouter)
mainRouter.use("/sales", authMiddleware, salesRouter)
mainRouter.use("/support", authMiddleware, supportRouter)


export default mainRouter
