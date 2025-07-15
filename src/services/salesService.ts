import { Sale } from '../types';
import notificationService from './notificationService';

const STORAGE_KEY = 'growshop_sales';

function getAll(): Sale[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function add(sale: Sale): void {
  const sales = getAll();
  sales.push(sale);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  
  // Notificar venta exitosa
  notificationService.addSaleSuccess(sale.totalAmount);
}

function update(sale: Sale): void {
  const sales = getAll().map(s => (s.id === sale.id ? sale : s));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}

function remove(id: string): void {
  const sales = getAll().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}

export default { getAll, add, update, remove }; 