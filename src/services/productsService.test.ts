import productsService from './productsService.js';
import { Product } from '../types';

// Eliminado jest.mock porque ahora existe un mock físico de NotificationSystem

describe('Servicio de productos - Growshop', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('debe registrar una semilla de cannabis correctamente', () => {
    const producto: Product = {
      id: '1',
      name: 'Semilla de Cannabis Sativa',
      price: 1200,
      description: 'Semilla feminizada de alta calidad',
      category: 'Semillas',
      stock: 10,
      createdAt: new Date(),
    };
    productsService.add(producto);
    const productos = productsService.getAll();
    expect(productos.length).toBe(1);
    expect(productos[0].name).toBe('Semilla de Cannabis Sativa');
  });

  it('no debe permitir registrar un producto sin nombre', () => {
    const producto: Product = {
      id: '2',
      name: '',
      price: 500,
      description: 'Fertilizante orgánico',
      category: 'Fertilizantes',
      stock: 20,
      createdAt: new Date(),
    };
    productsService.add(producto);
    const productos = productsService.getAll();
    // No debería agregarse el producto sin nombre
    expect(productos.find(p => p.id === '2' && p.name === '')).toBeUndefined();
  });

  it('debe listar productos como fertilizante y maceta', () => {
    const fertilizante: Product = {
      id: '3',
      name: 'Fertilizante Orgánico',
      price: 800,
      description: 'Aumenta el crecimiento',
      category: 'Fertilizantes',
      stock: 15,
      createdAt: new Date(),
    };
    const maceta: Product = {
      id: '4',
      name: 'Maceta 10L',
      price: 300,
      description: 'Maceta plástica resistente',
      category: 'Macetas',
      stock: 50,
      createdAt: new Date(),
    };
    productsService.add(fertilizante);
    productsService.add(maceta);
    const productos = productsService.getAll();
    expect(productos.map(p => p.name)).toEqual(
      expect.arrayContaining(['Fertilizante Orgánico', 'Maceta 10L'])
    );
  });

  it('debe editar el stock de un producto y reflejar el cambio', () => {
    const producto: Product = {
      id: '5',
      name: 'Sustrato Premium',
      price: 950,
      description: 'Sustrato para cultivo indoor',
      category: 'Sustratos',
      stock: 30,
      createdAt: new Date(),
    };
    productsService.add(producto);
    const actualizado: Product = { ...producto, stock: 10 };
    productsService.update(actualizado);
    const productos = productsService.getAll();
    expect(productos.find(p => p.id === '5')?.stock).toBe(10);
  });
}); 