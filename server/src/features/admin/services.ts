import Product from "./model/productModel";
import Category from "./model/CategoryModel";
import DatabaseType from "./model/Db_model";
import { ProductStatus } from "./model/productModel";
import mongoose, { Schema } from "mongoose";
import { mysqlConnection } from "../../db/sqldb_Connection";
import { OkPacket, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import User from "../auth/model/user";
import Payment from "../stripe/model/payment";
import { IAddCategory, IAddProduct } from "./interface";
import { paymentDetails } from "./controller";

export class AuthServices {
  static addProduct = async (body: IAddProduct, prev_db: string) => {
    const { productname, price, description, image, category_id } = body;
    const _id = uuidv4();

    try {
      if (prev_db === "mongodb") {
        if (productname && price && description && image && category_id) {
          const new_id = new mongoose.Types.ObjectId(category_id);
          const data = new Product({
            ...body,
            category_id: new_id,
          });
          await data.save();
        }
        return {
          status: 200,
          message: "Product added successfully",
        };
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
        if (productname && price && description && image && category_id) {
          const insertQuery =
            "INSERT INTO Product (_id, productname, price, description, image, category_id) VALUES (?, ?, ?, ?, ?, ?)";
          const insertResult: any = await queryAsync(
            mysqlConnection,
            insertQuery,
            [_id, productname, price, description, image, category_id]
          );
          return {
            status: 200,
            message: "Product added successfully",
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

  static getAllProduct = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const products = await Product.find();
        if (products.length !== 0) {
          return {
            productData: products,
            status: 200,
            message: "successfully fetch the products from database",
          };
        } else {
          return {
            status: 404,
            message: "product is not added by admin",
          };
        }
      } else {
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

        const insertQuery = "SELECT * FROM Product";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery
        );

        if (insertQuery.length === 0) {
          return { status: 404, message: "No products found" };
        } else {
          return {
            productData: insertResult,
            status: 200,
            message: "Successfully fetched the products from the sql database",
          };
        }
      }
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  };

  static ProductaddToUser = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);

        const product = await Product.findByIdAndUpdate(
          { _id: new_id },
          { enum: ProductStatus.ACTIVE }
        );

        if (product?.enum === "ACTIVE") {
          return {
            status: 400,
            message: "Product has already been added to user dashboard",
          };
        } else {
          return {
            status: 200,
            message: "Product Successfully added to user dashboard",
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
        const updateQuery = "UPDATE Product SET enum = ? WHERE _id = ?";
        const productStatus = "ACTIVE";
        const updateResult: any = await queryAsync(
          mysqlConnection,
          updateQuery,
          [productStatus, id]
        );
        if (updateResult.affectedRows !== 1) {
          return {
            status: 400,
            message: "Product has already been added to user dashboard",
          };
        } else {
          return {
            status: 200,
            message: "Product Successfully added to user dashboard",
          };
        }
      }
    } catch (error: any) {
      console.log("Error while findind the product", error);
      return {
        status: 500,
        message: "Error while findind the product",
      };
    }
  };

  static deleteProduct = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const product = await Product.deleteOne({ _id: new_id });
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

        const countQuery =
          "SELECT COUNT(*) as count FROM Product WHERE _id = ?";
        const countResult: any = await queryAsync(mysqlConnection, countQuery, [
          id,
        ]);

        const productExists = countResult[0].count > 0;

        if (!productExists) {
          return { status: 404, message: "Product not found" };
        }

        const deleteQuery = "DELETE FROM Product WHERE _id = ?";
        const deleteResult: any = await queryAsync(
          mysqlConnection,
          deleteQuery,
          [id]
        );

        if (deleteResult.affectedRows === 1) {
          return { status: 200, message: "Product deleted successfully." };
        } else {
          return { status: 500, message: "Error deleting product" };
        }
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: "Error in deleting product" };
    }
  };

  static undoProductService = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const product = await Product.findByIdAndUpdate(
          { _id: new_id },
          { enum: ProductStatus.INACTIVE }
        );
        if (product) {
          return {
            status: 200,
            message: "Product successfully removed from user dashboard",
          };
        } else {
          return {
            status: 404,
            message: "Product you want to add doesn't exist in admin pannel",
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

        const updateQuery = "UPDATE Product SET enum = ? WHERE _id = ?";
        const statusToUpdate = "INACTIVE";
        const updatedProducts: any = await queryAsync(
          mysqlConnection,
          updateQuery,
          [statusToUpdate, id]
        );

        if (updatedProducts.affectedRows === 1) {
          return {
            status: 200,
            message: "Product successfully removed from user dashboard",
          };
        } else {
          return {
            status: 404,
            message: "No products found with status ACTIVE",
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

  static addCategory = async (body: IAddCategory) => {
    const _id = uuidv4();
    const { category_name } = body;
    try {
      const categoryExist_mongo = await Category.findOne({
        category_name: category_name,
      });

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
        "SELECT COUNT(*) as count FROM categories WHERE category_name = ?";
      const countResult: RowDataPacket[] = await queryAsync(
        mysqlConnection,
        countQuery,
        [category_name]
      );
      const categoryExists_sql = countResult[0].count > 0;

      if (!categoryExist_mongo && !categoryExists_sql) {
        const data = new Category({
          ...body,
        });
        await data.save();

        const insertQuery =
          "INSERT INTO categories ( _id , category_name ) VALUES (?,?)";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [_id, category_name]
        );

        return {
          status: 200,
          message: "Category added successfully",
        };
      } else {
        return {
          status: 400,
          message: "Category already exist",
        };
      }
    } catch (error: any) {
      console.log(error);
      return {
        status: error.status || 500,
        message: error.message || "internal server error",
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

        if (insertQuery.length === 0) {
          return { status: 404, message: "No category found" };
        } else {
          return {
            data: insertResult,
            status: 200,
            message:
              "Successfully fetched the categories from the sql database",
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

  static getPaymentDetails = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const product = await Payment.aggregate([
          {
            $lookup: {
              from: "products",
              localField: "product_ids",
              foreignField: "_id",
              as: "productDetails",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          {
            $lookup: {
              from: "payments",
              localField: "_id",
              foreignField: "_id",
              as: "paymentDetails",
            },
          },
          {
            $project: {
              productDetails: 1,
              userDetails: 1,
              paymentDetails: 1,
            },
          },
        ]);
      console.log(product);
      
        if (product) {
          return {
            status: 200,
            data: product,
            message: "Payment details retrieved successfully",
          };
        } else {
          return {
            status: 400,
            message: "Error while fetching payment details",
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

        const selectQuery =
          "SELECT p.user_id as user_id, JSON_ARRAYAGG(JSON_OBJECT('transactionId',p.transactionId,'amount',p.amount,'products',JSON_OBJECT('price',prdct.price,'productname',prdct.productname))) AS Payment_Details FROM payments p JOIN payment_products pp ON p._id = pp.payment_id JOIN product prdct ON pp.product_id = prdct._id GROUP BY p.user_id ";
        const selectResult: any = await queryAsync(
          mysqlConnection,
          selectQuery
        );
        // console.log("ggg==", selectResult);
        const rows: any = selectResult;

        const data = selectResult.forEach((item: any) => {
          console.log("User ID:", item.user_id);

          item.Payment_Details.forEach((transactionId: string, index: any) => {
            console.log("Transaction ID:", transactionId);
          });
        });
        console.log("reading", data);
        selectResult.map((row: any) => {
          return {
            user_id: row.user_id,
            // user_firstName: row.user_firstName,
            // user_lastName: row.user_lastName,
            // user_email: row.user_email,
            transactions: JSON.parse(row.Payment_Details), 
          };
        });
        console.log(data,"mmmm")
      }
    } catch (error: any) {
      return {
        status: 500,
        message: error.message,
      };
    }
  };

  static db_Select = async (data: string) => {
    try {
      if (data !== "mongodb" && data !== "sql") {
        return {
          status: 400,
          message: "bad request",
        };
      }
      const update = { db_Type: data };
      await DatabaseType.findOneAndUpdate(
        {},
        { $set: update },
        { new: true, upsert: true }
      );
      return {
        status: 200,
        message: "db selected successfully",
      };
    } catch (error) {
      console.error("Error in db_Select:", error);
      throw new Error("Error selecting database");
    }
  };

  static getAllUser = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const resp = await User.find();
        if (resp && resp.length > 0) {
          return {
            status: 200,
            data: resp,
            message: "User data fetch successfully",
          };
        } else {
          return {
            status: 500,
            message: "failed to fetch user's data",
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "internal server error",
      };
    }
  };

  static deleteUser = async (prev_db: string, id: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const deletedUser = await User.deleteOne({ _id: new_id });
        if (deletedUser) {
          return {
            data: deletedUser,
            status: 200,
            message: "User successfully deleted",
          };
        } else {
          return {
            status: 404,
            message: "User not found",
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
}
