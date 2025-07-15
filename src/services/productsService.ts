import { Product } from '../types';
import notificationService from './notificationService';

const STORAGE_KEY = 'growshop_products';

function getAll(): Product[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function add(product: Product): void {
  const products = getAll();
  products.push(product);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  
  // Notificar producto agregado
  notificationService.addProductAdded(product.name);
  
  // Verificar stock bajo
  if (product.stock <= 5 && product.stock > 0) {
    notificationService.addStockWarning(product.name, product.stock);
  }
  
  // Verificar sin stock
  if (product.stock === 0) {
    notificationService.addOutOfStock(product.name);
  }
}

function update(product: Product): void {
  const products = getAll().map(p => (p.id === product.id ? product : p));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  
  // Verificar stock bajo después de actualizar
  if (product.stock <= 5 && product.stock > 0) {
    notificationService.addStockWarning(product.name, product.stock);
  }
  
  // Verificar sin stock después de actualizar
  if (product.stock === 0) {
    notificationService.addOutOfStock(product.name);
  }
}

function remove(id: string): void {
  const products = getAll().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export default { getAll, add, update, remove }; 