import { Router } from "express";
import { verifyUserToken } from "../../middleware/verifyUser";
import { payment, savePaymentDetails } from "./controller";
import { dbType_Select } from "../admin/controller";
import { DbType } from "../../middleware/Db_Select";

const paymentRouter = Router();

paymentRouter.post("/select-db", verifyUserToken, dbType_Select);

paymentRouter.use(DbType);

paymentRouter.post("/pay", verifyUserToken,payment);
paymentRouter.post("/create-payment", verifyUserToken,savePaymentDetails);

export default paymentRouter;