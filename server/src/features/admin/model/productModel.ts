import { Schema, model } from "mongoose";

export enum ProductStatus{
  ACTIVE='ACTIVE',
  INACTIVE='INACTIVE'
}

interface Product {
    title?: string
    price: number
    productname:string
    description: string
    image: string
    category_id: Schema.Types.ObjectId,
    enum:ProductStatus
}

const productSchema = new Schema<Product>({
  title: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  productname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  category_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  enum:{
    type:String,
    enum:Object.values(ProductStatus),   //ensures only valid enums are used
    default:ProductStatus.INACTIVE
  }
});


const productModel=model<Product>("product",productSchema);
export default productModel;
