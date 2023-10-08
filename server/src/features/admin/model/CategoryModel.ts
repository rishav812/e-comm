import { Schema, model } from "mongoose";

interface Category{
  category_name:string
}

const categorySchema=new Schema<Category>({
    category_name:{
        type:String,
        required:true
    }
})

const categoryModel=model<Category>("category",categorySchema);
export default categoryModel;