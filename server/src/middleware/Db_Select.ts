import { Request, Response, NextFunction } from "express";
import DatabaseType from "../features/admin/model/Db_model";

export const DbType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try{
        const db = await DatabaseType.find();
        req.body.selectdb=db[0].db_Type
        next(); 
    }catch(error){
       console.log(error) 
       return res.status(401).json({"error":"error occur"})     
    }
}; 
