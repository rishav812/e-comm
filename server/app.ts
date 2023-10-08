import express, { Express } from "express";
import bodyParser from "body-parser";
import rootRouter from "./src/features/RootRouter";
import cors from "cors";
import dbConnect from "./src/db/mgdbConnection";
import { mysqlConnection } from "./src/db/sqldb_Connection";

const app: Express = express();
const PORT = 3001;

const corsOptions = {
  credentials: true,
};

dbConnect();

mysqlConnection.connect((err)=>{
  if(err){
      console.log("Error in db connection: "+JSON.stringify(err,undefined,2));
  }
  else{
      console.log("mysql-db Connected..."); 
  }
})

app.use(cors(corsOptions))


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());

app.use("/api/v1", rootRouter);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log("Running on the server ", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};
start();


