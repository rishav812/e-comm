import { Request, Response } from "express";
import { AuthServices } from "./services";

export const SignupApi= async (req:Request,res:Response)=>{
    try{
        const body=req.body;
        const data = await AuthServices.postSignup(body);
        res.status(200).json(data);
    }catch(error:any){
        res.status(500).json({message:error.message})
    }
}

export const LoginApi= async (req:Request,res:Response)=>{
    try{
        const body=req.body;
        const data = await AuthServices.postLogin(body);
        res.status(200).json(data);
    }catch(error:any){
        res.status(500).json({message:error.message})
    }
}