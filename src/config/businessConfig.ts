export interface BusinessConfig {
  name: string;
  type: 'growshop' | 'restaurant' | 'retail' | 'pharmacy' | 'custom';
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  categories: string[];
  paymentMethods: string[];
  features: {
    stockControl: boolean;
    customerManagement: boolean;
    supplierManagement: boolean;
    reports: boolean;
    exportData: boolean;
    notifications: boolean;
  };
  fields: {
    products: {
      name: boolean;
      price: boolean;
      stock: boolean;
      category: boolean;
      description: boolean;
      supplier: boolean;
      barcode: boolean;
    };
    sales: {
      customer: boolean;
      items: boolean;
      paymentMethod: boolean;
      notes: boolean;
      discount: boolean;
    };
  };
}

// Configuraciones predefinidas para diferentes tipos de comercio
export const businessConfigs: Record<string, BusinessConfig> = {
  growshop: {
    name: 'Growshop',
    type: 'growshop',
    theme: {
      primaryColor: '#223A5E',
      secondaryColor: '#6EC6FF',
      accentColor: '#FFA000',
    },
    categories: [
      'Sustratos',
      'Fertilizantes',
      'Iluminación',
      'Accesorios',
      'Semillas',
      'Otro',
    ],
    paymentMethods: [
      'efectivo',
      'tarjeta',
      'transferencia',
      'otro',
    ],
    features: {
      stockControl: true,
      customerManagement: false,
      supplierManagement: false,
      reports: true,
      exportData: true,
      notifications: true,
    },
    fields: {
      products: {
        name: true,
        price: true,
        stock: true,
        category: true,
        description: true,
        supplier: false,
        barcode: false,
      },
      sales: {
        customer: false,
        items: true,
        paymentMethod: true,
        notes: true,
        discount: false,
      },
    },
  },
  restaurant: {
    name: 'Restaurante',
    type: 'restaurant',
    theme: {
      primaryColor: '#D32F2F',
      secondaryColor: '#FFCDD2',
      accentColor: '#FFA000',
    },
    categories: [
      'Entradas',
      'Platos Principales',
      'Postres',
      'Bebidas',
      'Especialidades',
      'Otro',
    ],
    paymentMethods: [
      'efectivo',
      'tarjeta',
      'transferencia',
      'delivery',
      'otro',
    ],
    features: {
      stockControl: true,
      customerManagement: true,
      supplierManagement: true,
      reports: true,
      exportData: true,
      notifications: true,
    },
    fields: {
      products: {
        name: true,
        price: true,
        stock: true,
        category: true,
        description: true,
        supplier: true,
        barcode: false,
      },
      sales: {
        customer: true,
        items: true,
        paymentMethod: true,
        notes: true,
        discount: true,
      },
    },
  },
  retail: {
    name: 'Comercio Minorista',
    type: 'retail',
    theme: {
      primaryColor: '#1976D2',
      secondaryColor: '#BBDEFB',
      accentColor: '#4CAF50',
    },
    categories: [
      'Electrónicos',
      'Ropa',
      'Hogar',
      'Deportes',
      'Juguetes',
      'Otro',
    ],
    paymentMethods: [
      'efectivo',
      'tarjeta',
      'transferencia',
      'cuotas',
      'otro',
    ],
    features: {
      stockControl: true,
      customerManagement: true,
      supplierManagement: true,
      reports: true,
      exportData: true,
      notifications: true,
    },
    fields: {
      products: {
        name: true,
        price: true,
        stock: true,
        category: true,
        description: true,
        supplier: true,
        barcode: true,
      },
      sales: {
        customer: true,
        items: true,
        paymentMethod: true,
        notes: true,
        discount: true,
      },
    },
  },
};

// Función para obtener la configuración actual
export const getCurrentConfig = (): BusinessConfig => {
  const savedConfig = localStorage.getItem('business_config');
  if (savedConfig) {
    return JSON.parse(savedConfig);
  }
  return businessConfigs.growshop; // Configuración por defecto
};

// Función para cambiar la configuración
export const setBusinessConfig = (config: BusinessConfig): void => {
  localStorage.setItem('business_config', JSON.stringify(config));
};

// Función para cambiar el tipo de comercio
export const changeBusinessType = (type: string): void => {
  const config = businessConfigs[type] || businessConfigs.growshop;
  setBusinessConfig(config);
};

export default businessConfigs; 