import { Schema, model } from "mongoose";

interface dbType{
    db_Type:String,
}

const dbSchema=new Schema<dbType>({
    db_Type:{
        type:String,
        default: "mongodb"
    }
})

const dbModel=model<dbType>('databaseType',dbSchema);
export default dbModel;
