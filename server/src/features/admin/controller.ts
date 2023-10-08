import { Request, Response } from "express";
import { AuthServices } from "./services";

export const productAddApi = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const response = await AuthServices.addProduct(data,req.body.selectdb);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersData = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const response = await AuthServices.getAllUser(req.body.selectdb);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const ProductDeleteApi = async (req: Request, res: Response) => {
  try {
    const response = await AuthServices.deleteProduct(req.params.id,req.body.selectdb);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const UserDeleteApi = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id)
    const response = await AuthServices.deleteUser(req.params.id,req.body.selectdb,);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const ProductGetApi = async (req: Request, res: Response) => {
  try {
    const response = await AuthServices.getAllProduct(req.body.selectdb);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const ProductDispatchToUser = async (req: Request, res: Response) => {
  try {
    const response = await AuthServices.ProductaddToUser(req.params.id,req.body.selectdb);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const undoProductAction = async (req: Request, res: Response) => {
  try {
    const response = await AuthServices.undoProductService(req.params.id,req.body.selectdb);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addCategoryApi = async (req: Request, res: Response) => {
  try {
    const response = await AuthServices.addCategory(req.body);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } 
};  

export const getAllCategory = async (req: Request, res: Response) => {   
  try {
    const response = await AuthServices.getAllCategoryService(req.body.selectdb);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const paymentDetails = async (req: Request, res: Response) => {   
  try {
    const response = await AuthServices.getPaymentDetails(req.body.selectdb);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const dbType_Select = async (req: Request, res: Response) => {
  try {
    const data=Object.keys(req.body)[0];
    const response=await AuthServices.db_Select(data);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
