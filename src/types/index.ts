export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock: number;
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
  customerName?: string;
  notes?: string;
  createdAt: Date;
}

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'otro'; 