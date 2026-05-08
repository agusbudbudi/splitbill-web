export interface SubscriptionPackage {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountType: "percentage" | "rupiah";
  discountValue: number;
  finalPrice: number;
  durationMonths: number;
  benefits: string[];
  isActive: boolean;
  showToCustomer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  orderId: string;
  type: "subscription" | string;
  status: "pending" | "paid" | "expired" | "failed";
  amount: number;
  snapshot: any;
  qrisData: {
    image?: string;
    url?: string;
    [key: string]: any;
  } | null;
  expiresAt: string;
  paymentMethod?: string;
  paidAt?: string;
  totalPayment?: number;
  createdAt?: string;
}
