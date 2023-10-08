import {Schema,model} from "mongoose";

interface User{
    name:string,
    image:string,
    email:string,
    phone:string,
    password:string
    isAdmin:boolean
}

const userSchema = new Schema<User>({
    name:{
      type:String,
      required:true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

const userModel=model<User>('user',userSchema);
export default userModel;

