import { Schema, model } from "mongoose";

interface Wishlist{
    user_id:string,
    product_id:Schema.Types.ObjectId;
}

const wishlistSchema=new Schema<Wishlist>({
    user_id: {
        type: String,
        required: true,
      },
    product_id: {
        type: Schema.Types.ObjectId,
        ref:"Product",
        required: true,
    }
})

const wishlistModel=model<Wishlist>("wishlist",wishlistSchema);
export default wishlistModel;
