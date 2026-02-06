// Invoice Types
export interface InvoiceItem {
  id: string;
  name: string;
  description: string; // HTML from rich text editor
  qty: number;
  rate: number;
  amount: number;
}

export interface BilledEntity {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone: string;
  avatar?: string; // DiceBear URL
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "bank" | "ewallet";
  accountNumber?: string;
  bankName?: string;
  phone?: string;
  logo?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  logo?: string; // base64 or URL

  billedBy: BilledEntity | null;
  billedTo: BilledEntity | null;

  items: InvoiceItem[];

  discountType: "amount" | "percent";
  discountValue: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  totalInWords: string;

  paymentMethods: PaymentMethod[];

  tnc: string; // HTML
  footer: string;

  status: "draft" | "finalized" | "paid" | "unpaid";
  createdAt: string;
  finalizedAt?: string;
  updatedAt?: string;
}

export type InvoiceFormData = Partial<Invoice>;
