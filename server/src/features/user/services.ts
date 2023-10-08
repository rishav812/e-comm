import Product, { ProductStatus } from "../admin/model/productModel";
import Category from "../admin/model/CategoryModel";
import { mysqlConnection } from "../../db/sqldb_Connection";
import { OkPacket, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import User from "../auth/model/user";
import Cart from "./models/cart";
import Favorite from "./models/favorite";
import mongoose from "mongoose";
import Wishlist from "./models/favorite";
import { ICart, IUpdateUserDetail } from "./interface";


export const stripe = require("stripe")(process.env.key);

export class AuthServices {
  static getAllProducts = async (prev_db: string, skip:string) => {
    const skips = skip ? Number(skip) : 0;
    try {
      if (prev_db === "mongodb") {
        const data = await Product.find({ enum: ProductStatus.ACTIVE });
          return {
            productData: data,
            status: 200,
            message: "Product Fetch Successfully",
          };
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }
        const insertQuery = "SELECT * FROM Product WHERE enum = ?";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          "ACTIVE"
        );

        if (insertResult.length === 0) {
          return { status: 404, message: "No products found" };
        } else {
          return {
            productData: insertResult,
            status: 200,
            message: "Successfully fetched the products from the sql database",
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        success: 500,
        message: "Internal Error",
      };
    }
  };

  static getAllCategoryService = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const category = await Category.find({});
        if (category.length !== 0) {
          return {
            data: category,
            status: 200,
            message: "category retrieved successfully by mongodb",
          };
        } else {
          return {
            status: 400,
            message: "please add category",
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const insertQuery = "SELECT * FROM categories";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery
        );
        if (insertResult.length === 0) {
          return { status: 404, message: "No category found" };
        } else {
          return {
            data: insertResult,
            status: 200,
            message: "Successfully fetched the category from the sql database",
          };
        }
      }
    } catch (error: any) {
      return {
        status: error.status || 500,
        message: error.message || "internal server error",
      };
    }
  };

  static productByCategory = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const product = await Product.find({ category_id: id });
        if (product) {
          return {
            productData: product,
            status: 200,
            message: "Product Filter Successfully",
          };
        } else {
          return {
            status: 404,
            message: "Product not found",
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const countQuery = "SELECT * FROM product WHERE category_id=?";
        const result: any = await queryAsync(mysqlConnection, countQuery, [id]);

        if (result.length == 0) {
          return { status: 404, message: "Product not found" };
        } else {
          return {
            productData: result,
            status: 200,
            message: "Successfully fetched the category from the sql database",
          };
        }
      }
    } catch (error) {
      return {
        status: 500,
        message: "internal server error",
      };
    }
  };

  static addToCartService = async (body: ICart, prev_db: string) => {
    const id = uuidv4();
    const { user_id, _id } = body;
    try {
      if (prev_db === "mongodb") {
        const product_id = new mongoose.Types.ObjectId(_id);
        const cartData = new Cart({
          user_id: user_id,
          product_id: product_id,
        });
        const resp_data = await cartData.save();
        return {
          data: resp_data,
          status: 200,
          message: "Product added successfully in cart",
        };
      } else if (prev_db === "sql") {
        const queryAsync = async (
          connection: any,
          sql: string,
          values: any
        ): Promise<RowDataPacket[]> => {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        };

        const insertQuery =
          "INSERT INTO cart (_id, user_id, product_id) VALUES (?, ?, ?)";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [id, user_id, _id]
        );

        if (insertResult.affectedRows === 1) {
          return {
            status: 200,
            message: "Product inserted into cart successfully",
          };
        } else {
          return { status: 500, message: "Error inserting product to cart" };
        }
      }
    } catch (error) {
      return {
        status: 500,
        message: "internal server error",
      };
    }
  };

  static addToFavService = async (body: ICart, prev_db: string) => {
    const id = uuidv4();
    const { user_id, _id } = body;
    try {
      if (prev_db === "mongodb") {
        const product_id = new mongoose.Types.ObjectId(_id);
        const productExist = await Favorite.findOne({
          product_id: product_id,
        });

        if (productExist) {
          return {
            status: 400,
            message: "product-already-added",
          };
        } else {
          const data = new Favorite({
            user_id: user_id,
            product_id: product_id,
          });
          
          const productData = await data.save();
          return {
            data: productData,
            status: 200,
            message: "Product added successfully in cart",
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const countQuery =
          "SELECT COUNT(*) as count FROM favorite WHERE product_id = ?";
        const countResult: RowDataPacket[] = await queryAsync(
          mysqlConnection,
          countQuery,
          [_id]
        );
        const productExists = countResult[0].count > 0;

        if (productExists) {
          return { status: 400, message: "Product already exists" };
        }

        const insertQuery =
          "INSERT INTO favorite (_id, user_id,product_id) VALUES (?, ?, ?)";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [id, user_id, _id]
        );

        if (insertResult.affectedRows === 1) {
          return {
            status: 200,
            message: "Product inserted successfully in wishlist",
          };
        }
      }
    } catch (error: any) {
      return {
        status: 500,
        message: error.message,
      };
    }
  };

  static getCartDataService = async (user_id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const result = await Cart.aggregate([
          {
            $match: { user_id: user_id },
          },
          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "_id",
              as: "cartList",
            },
          },
          {
            $project: {
              cartList: 1,
            },
          },
        ])

        const resArray: any = [];
        result.map((item: any) => {
          resArray.push(item.cartList[0]);
        });
        // console.log(resArray,"send from backend")
        return {
          status: 200,
          CartData: resArray,
        };
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const insertQuery =
          "SELECT product._id,productname,description,price,image FROM cart right join product on cart.product_id=product._id WHERE user_id=?";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [user_id]
        );

        if (insertQuery.length === 0) {
          return { status: 404, message: "No products found" };
        } else {
          return {
            CartData: insertResult,
            status: 200,
            message: "Successfully fetched the products from the sql database",
          };
        }
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: "Internal Server Error" };
    }
  };

  static getWishlistService = async (user_id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const result = await Wishlist.aggregate([
          {
            $match: { user_id: user_id },
          },
          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "_id",
              as: "wishList",
            },
          },
          {
            $project: {
              wishList: 1,
            },
          },
        ]);

        const resArray: any = [];
        result.map((item: any) => {
          resArray.push(item.wishList[0]);
        });

        return {
          status: 200,
          data: resArray,
          message: "wishlist fetch successfully",
        };
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const insertQuery =
          "SELECT product._id,productname,description,price,image FROM favorite right join product on favorite.product_id=product._id WHERE user_id=?";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [user_id]
        );

        if (insertQuery.length === 0) {
          return { status: 404, message: "No products found" };
        } else {
          return {
            data: insertResult,
            status: 200,
            message: "Successfully fetched the products from the sql database",
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  };

  static deleteCartService = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const product = await Cart.deleteOne({ product_id: new_id });
        if (product) {
          return {
            data: product,
            status: 200,
            message: "Product successfully deleted",
          };
        } else {
          return {
            status: 404,
            message: "Product not found",
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }
        try {
          const countQuery = "SELECT COUNT(*) as count FROM cart WHERE product_id = ?";
          const countResult: any = await queryAsync(
            mysqlConnection,
            countQuery,
            [id]
          );

          const productExists = countResult[0].count > 0;

          if (!productExists) {
            return { status: 404, message: "Product not found" };
          }

          const deleteQuery = "DELETE FROM cart WHERE product_id = ? LIMIT 1";
          const deleteResult: any = await queryAsync(
            mysqlConnection,
            deleteQuery,
            [id]
          );

          if (deleteResult.affectedRows === 1) {
            return {
              status: 200,
              message: "Product deleted from cart successfully.",
            };
          } else {
            return { status: 500, message: "Error deleting product" };
          }
        } catch (error) {
          return { status: 500, message: "server error" };
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static clearCartService = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const resp = await Cart.deleteMany();
        return {
          status: 200,
          message: "Cart is being cleared",
        };
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }
        try {
          const insertQuery = "DELETE FROM cart";
          const insertResult: any = await queryAsync(
            mysqlConnection,
            insertQuery
          );
          return {
            status: 200,
            message: "Successfully clear the cart from the sql database",
          };
        } catch (error) {
          return { status: 500, message: "Error while deleting" };
        }
      }
    } catch (error) {
      return { status: 500, message: "Internal Server Error" };
    }
  };

  static deleteWishlistService = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const product = await Wishlist.deleteOne({ product_id: new_id });
        if (product) {
          return {
            data: product,
            status: 200,
            message: "Product successfully deleted",
          };
        } else {
          return {
            status: 404,
            message: "Product not found",
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }
        try {
          const countQuery =
            "SELECT COUNT(*) as count FROM favorite WHERE product_id = ?";
          const countResult: any = await queryAsync(
            mysqlConnection,
            countQuery,
            [id]
          );

          const productExists = countResult[0].count > 0;

          if (!productExists) {
            return { status: 404, message: "Product not found" };
          }

          const deleteQuery = "DELETE FROM favorite WHERE product_id = ?";
          const deleteResult: any = await queryAsync(
            mysqlConnection,
            deleteQuery,
            [id]
          );

          if (deleteResult.affectedRows === 1) {
            return {
              status: 200,
              message: "Product deleted from wishlist successfully.",
            };
          } else {
            return { status: 500, message: "Error deleting product" };
          }
        } catch (error) {
          return { status: 500, message: "error while deleting product" };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  };

  static updateUserData=async(body:IUpdateUserDetail,prev_db:string)=>{
    const {user_id,image,name,email,phone}=body;
    try{
      if(prev_db==='mongodb'){
        const new_id = new mongoose.Types.ObjectId(user_id);
        const update = { image:image,name:name,email:email,phone:phone };
        const resp=await User.findOneAndUpdate({_id:new_id},
          {$set:update })
        }
    }catch(error:any){
      return{
        status:500,
        message:error.message
      }
    }
  }
}
