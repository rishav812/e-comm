import { Request, Response } from "express";
import { PaymentServices } from "./services";

export const payment = async (req: Request, res: Response) => {
  const resp = await PaymentServices.payment(req.body);
  res.status(200).send(resp);
};

export const savePaymentDetails = async (req: Request, res: Response) => {
  const resp = await PaymentServices.savePayment(req.body,req.body.selectdb);
  res.status(200).send(resp);
};
