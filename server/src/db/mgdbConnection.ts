import mongoose,{ConnectOptions, connect} from 'mongoose';

const dbConnect=async ()=>{
    return await mongoose.connect("mongodb+srv://rishav_123:rishavdatabase887@cluster0.nsowagn.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true} as ConnectOptions).
    then(()=>console.log("mongo-db Connected...")).
    catch((error:any)=>console.log(error))
}

export default dbConnect;
