import { Router } from "express";
import { DbType } from "../../middleware/Db_Select";
import { verifyUserToken } from "../../middleware/verifyUser";
import {
  ProductGetApi,
  productAddApi,
  ProductDispatchToUser,
  ProductDeleteApi,
  undoProductAction,
  addCategoryApi,
  getAllCategory,
  dbType_Select,
  getUsersData,
  UserDeleteApi,
  paymentDetails,
} from "./controller";

const adminRouter = Router();

adminRouter.post("/select-db",  dbType_Select);

adminRouter.use(DbType);   

adminRouter.post("/add-category", addCategoryApi);
adminRouter.get("/get-all-category", getAllCategory);
adminRouter.get("/get-all-user",getUsersData)
adminRouter.post("/add-product", productAddApi);
adminRouter.get("/get-all-product", ProductGetApi);
adminRouter.delete("/delete-product/:id", ProductDeleteApi);
adminRouter.delete("/delete-user/:id",UserDeleteApi);
adminRouter.put("/update-enums/:id", ProductDispatchToUser);
adminRouter.put("/undo-product/:id", undoProductAction);
adminRouter.get("/get-payment-details",paymentDetails)


export default adminRouter;
