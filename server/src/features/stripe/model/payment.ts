import mongoose, { Schema, model } from "mongoose";

interface Payment {
  user_id: mongoose.Types.ObjectId;
  product_ids: mongoose.Types.ObjectId[];
  transactionId: string;
  amount: number;
}

const paymentSchema = new Schema<Payment>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  product_ids: [{ 
    type: mongoose.Types.ObjectId,
    ref:'Product',
    required: true 
  }],
  transactionId:{
    type:String,
    required:true
  },
  amount:{
    type:Number,
    required:true
  }
});

const paymentModel=model<Payment>("payment",paymentSchema);
export default paymentModel;
