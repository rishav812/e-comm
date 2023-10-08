import { Router } from "express";
import { DbType } from "../../middleware/Db_Select";
import { dbType_Select } from "../admin/controller";
import { verifyUserToken } from "../../middleware/verifyUser";
import {
  getAllCategory,
  getProductByCategory,
  FetchFromAdmin,
  addToCartApi,
  addToFavApi,
  getCartData,
  deleteCartData,
  clearCart,
  getWishList,
  deleteWishlist,
  updateUserApi,
} from "./controller";

const userRouter = Router();

userRouter.post("/select-db", verifyUserToken, dbType_Select);

userRouter.use(DbType);

userRouter.get("/fetch-published-product", verifyUserToken, FetchFromAdmin);
userRouter.get("/fetch-all-category", verifyUserToken, getAllCategory);
userRouter.get("/fetch-product-by-category/:id", verifyUserToken, getProductByCategory);
userRouter.post("/add-to-cart", verifyUserToken,  addToCartApi);
userRouter.post("/update-user-data",verifyUserToken,updateUserApi);
userRouter.get("/get-cart-data", verifyUserToken, getCartData);
userRouter.post("/add-to-wishlist", verifyUserToken, addToFavApi);
userRouter.delete("/delete-cart-data/:id", verifyUserToken, deleteCartData);
userRouter.delete("/delete-all-cart-data", verifyUserToken, clearCart);
userRouter.get("/get-wishlist", verifyUserToken, getWishList);
userRouter.delete("/delete-fav-product/:id", verifyUserToken, deleteWishlist);

export default userRouter;
