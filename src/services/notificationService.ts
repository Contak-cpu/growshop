import { Notification } from '../components/NotificationSystem';

const NOTIFICATIONS_KEY = 'growshop_notifications';

class NotificationService {
  private notifications: Notification[] = [];

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      this.notifications = [];
    }
  }

  private saveNotifications(): void {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  getAll(): Notification[] {
    return [...this.notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getUnread(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    return newNotification;
  }

  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  delete(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
  }

  clearAll(): void {
    this.notifications = [];
    this.saveNotifications();
  }

  // Métodos de conveniencia para crear notificaciones específicas
  addStockWarning(productName: string, currentStock: number): Notification {
    return this.add({
      type: 'warning',
      title: 'Stock Bajo',
      message: `El producto "${productName}" tiene solo ${currentStock} unidades en stock.`,
      action: {
        label: 'Ver Productos',
        onClick: () => {
          // Navegar a productos
          window.location.hash = '#/products';
        },
      },
    });
  }

  addOutOfStock(productName: string): Notification {
    return this.add({
      type: 'error',
      title: 'Sin Stock',
      message: `El producto "${productName}" se ha quedado sin stock.`,
      action: {
        label: 'Reabastecer',
        onClick: () => {
          // Navegar a productos
          window.location.hash = '#/products';
        },
      },
    });
  }

  addSaleSuccess(amount: number): Notification {
    return this.add({
      type: 'success',
      title: 'Venta Registrada',
      message: `Se registró una venta por $${amount.toLocaleString()}.`,
      action: {
        label: 'Ver Historial',
        onClick: () => {
          // Navegar a historial
          window.location.hash = '#/history';
        },
      },
    });
  }

  addProductAdded(productName: string): Notification {
    return this.add({
      type: 'info',
      title: 'Producto Agregado',
      message: `Se agregó el producto "${productName}" al inventario.`,
      action: {
        label: 'Ver Productos',
        onClick: () => {
          // Navegar a productos
          window.location.hash = '#/products';
        },
      },
    });
  }

  addBackupSuccess(): Notification {
    return this.add({
      type: 'success',
      title: 'Backup Completado',
      message: 'Los datos se han respaldado correctamente.',
    });
  }

  addBackupError(): Notification {
    return this.add({
      type: 'error',
      title: 'Error en Backup',
      message: 'Hubo un problema al respaldar los datos.',
    });
  }

  // Limpiar notificaciones antiguas (más de 30 días)
  cleanupOldNotifications(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    this.notifications = this.notifications.filter(
      n => n.timestamp > thirtyDaysAgo
    );
    this.saveNotifications();
  }
}

const notificationService = new NotificationService();
export default notificationService; 