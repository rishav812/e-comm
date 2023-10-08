import { IPaymentData, ISavePayment } from "./interface";
import { mysqlConnection } from "../../db/sqldb_Connection";
import { OkPacket, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import Payment from "./model/payment";
import mongoose from "mongoose";

const stripe = require("stripe")(
  "sk_test_51Nacd5Ij1cuyHlAe8kDGzBiA0VNmcEArjQTJ4HxC8hVOtCuahfokHPhlK6aYkiPD7H5Rz9RiO8qTCv37I2d5frYD00Wcz2UXDG"
);

export class PaymentServices {
  static payment = async (data: IPaymentData) => {
    let { amount } = data;
    try {
      let paymentIntentConfig: {
        amount: number;
        currency: string;
      } = {
        amount,
        currency: "usd",
      };

      const paymentIntent = await stripe.paymentIntents.create(
        paymentIntentConfig
      );

      if (paymentIntent) {
        return {
          success: true,
          message: "payment_successfully",
          client_secret: paymentIntent.client_secret,
        };
      } else {
        return {
          success: false,
          message: "payment_unsuccessfully",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  };

  static savePayment = async (body: ISavePayment, prev_db: string) => {
    const { user_id, product_ids, transactionId, amount } = body;
    try {
      if (prev_db === "mongodb") {
        const user_id = new mongoose.Types.ObjectId(body.user_id);
        const id_List = body.product_ids;

        const product_ids = <any>[];
        id_List.map((item) => {
          const product_id = new mongoose.Types.ObjectId(item);
          product_ids.push(product_id);
        });

        const data = new Payment({
          ...body,
          user_id: user_id,
          product_ids: product_ids,
        });

        const resp = await data.save();
        if (resp) {
          return {
            status: 200,
            data: data,
            message: "Payment details saved successfully",
          };
        }
      } else if (prev_db === "sql") {
        const _id = uuidv4();
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
          "INSERT INTO payments (_id, user_id, transactionId, amount) VALUES (?, ?, ?, ?)";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [_id, user_id, transactionId, amount]
        );

        if (insertResult.affectedRows === 1) {
          const selectQuery = "SELECT _id FROM payments WHERE transactionId=?";
          const get_id: any = await queryAsync(mysqlConnection, selectQuery, [
            transactionId,
          ]);

          const payment_id = get_id[0]._id;

          const productInsertQuery = "INSERT INTO payment_products (payment_id, product_id) VALUES (?, ?)";
          product_ids.map(async (id) => {
            const result = await queryAsync(
              mysqlConnection,
              productInsertQuery,
              [payment_id, id]
            );
          });

          return {
            status: 200,
            message: "Payment details saved successfully",
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
