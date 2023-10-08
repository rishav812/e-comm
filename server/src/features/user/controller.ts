import { Request, Response } from "express";
import { AuthServices } from "./services";

export const FetchFromAdmin = async (req: Request, res: Response) => {
  try {
    const skip = req.query.skip as string;
    // console.log(skip,"controllll")
    const response = await AuthServices.getAllProducts(req.body.selectdb,skip);
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

export const getProductByCategory = async (req: Request, res: Response) => {
    try {
      const response = await AuthServices.productByCategory(req.params.id,req.body.selectdb);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const addToCartApi = async (req: Request, res: Response) => {
    try {
      const response = await AuthServices.addToCartService(req.body,req.body.selectdb);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const addToFavApi = async (req: Request, res: Response) => {
    try {
      const response = await AuthServices.addToFavService(req.body,req.body.selectdb);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getCartData = async (req: Request, res: Response) => {
    try {
      const response = await AuthServices.getCartDataService(req.body.user_id,req.body.selectdb);
      // console.log(response,"connnnn")
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const deleteCartData = async (req: Request, res: Response) => {
    console.log(req.params.id)
    try {
      const response = await AuthServices.deleteCartService(req.params.id,req.body.selectdb);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const clearCart = async (req: Request, res: Response) => {
    try {
      const response = await AuthServices.clearCartService(req.body.selectdb);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getWishList = async (req: Request, res: Response) => {
    try {
      const response = await AuthServices.getWishlistService(req.body.user_id,req.body.selectdb);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const updateUserApi = async (req: Request, res: Response) => {
    try {
      const response = await AuthServices.updateUserData(req.body,req.body.selectdb);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const deleteWishlist = async (req: Request, res: Response) => {
    try {
      const response = await AuthServices.deleteWishlistService(req.params.id,req.body.selectdb);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // export const stripePayment = async (req: Request, res: Response) => {
  //   try {
  //     const response = await AuthServices.paymentService(req.body,req.body.selectdb);
  //     res.status(200).json(response);
  //   } catch (error: any) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };
