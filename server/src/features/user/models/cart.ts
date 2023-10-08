import { Schema, model } from "mongoose";

interface Cart{
    user_id:string,
    product_id:Schema.Types.ObjectId;
}

const cartSchema=new Schema<Cart>({
    user_id: {
        type: String,
        required: true,
      },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    }
})

const cartModel=model<Cart>("cart",cartSchema);
export default cartModel;