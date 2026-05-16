export type TransactionKind =
  | "funding"
  | "transfer"
  | "airtime"
  | "bill_payment";

export type TransactionDirection = "credit" | "debit";
export type TransactionStatus = "successful" | "failed" | "pending";

export type Transaction = {
  id: string;
  reference: string;
  sender_id?: string | null;
  receiver_id?: string | null;
  amount: number;
  transaction_type: TransactionKind;
  direction: TransactionDirection;
  status: TransactionStatus;
  description?: string | null;
  created_at: string;
};

export type Beneficiary = {
  id: string;
  user_id: string;
  beneficiary_name: string;
  account_number: string;
  phone_number?: string | null;
  bank_name?: string | null;
  created_at: string;
};
