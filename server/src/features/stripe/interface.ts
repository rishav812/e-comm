export interface IPaymentData {
  amount: number;
  product_ids: [];
  type: "Buying";
}

export interface ISavePayment{
  user_id:string;
  product_ids:[];
  transactionId:string;
  amount:number;
}
