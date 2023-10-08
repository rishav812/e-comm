import express from 'express';
import authRoutes from './auth/routes';
import adminRoutes from './admin/routes';
import userRoutes from './user/routes';
import paymentRoutes from './stripe/routes'

const rootRouter = express.Router();


rootRouter.use("/auth", authRoutes);
rootRouter.use("/admin",adminRoutes);
rootRouter.use("/user",userRoutes);
rootRouter.use("/payment_intents",paymentRoutes);

export default rootRouter;