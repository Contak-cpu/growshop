import productsService from './productsService';
import salesService from './salesService';
import notificationService from './notificationService';

export interface BackupData {
  version: string;
  timestamp: string;
  products: any[];
  sales: any[];
  notifications: any[];
  metadata: {
    totalProducts: number;
    totalSales: number;
    totalNotifications: number;
  };
}

class BackupService {
  private readonly BACKUP_KEY = 'growshop_backup';
  private readonly VERSION = '1.0.0';
  private autoBackupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startAutoBackup();
  }

  // Crear backup completo
  createBackup(): BackupData {
    const products = productsService.getAll();
    const sales = salesService.getAll();
    const notifications = notificationService.getAll();

    const backup: BackupData = {
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      products,
      sales,
      notifications,
      metadata: {
        totalProducts: products.length,
        totalSales: sales.length,
        totalNotifications: notifications.length,
      },
    };

    return backup;
  }

  // Guardar backup localmente
  saveBackup(backup: BackupData): void {
    try {
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
      console.log('Backup guardado localmente');
    } catch (error) {
      console.error('Error al guardar backup:', error);
      throw new Error('No se pudo guardar el backup');
    }
  }

  // Cargar backup local
  loadBackup(): BackupData | null {
    try {
      const stored = localStorage.getItem(this.BACKUP_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('Error al cargar backup:', error);
      return null;
    }
  }

  // Restaurar datos desde backup
  restoreFromBackup(backup: BackupData): void {
    try {
      // Validar versión
      if (backup.version !== this.VERSION) {
        throw new Error('Versión de backup incompatible');
      }

      // Restaurar productos
      if (backup.products && Array.isArray(backup.products)) {
        localStorage.setItem('growshop_products', JSON.stringify(backup.products));
      }

      // Restaurar ventas
      if (backup.sales && Array.isArray(backup.sales)) {
        localStorage.setItem('growshop_sales', JSON.stringify(backup.sales));
      }

      // Restaurar notificaciones
      if (backup.notifications && Array.isArray(backup.notifications)) {
        localStorage.setItem('growshop_notifications', JSON.stringify(backup.notifications));
      }

      console.log('Datos restaurados correctamente');
    } catch (error) {
      console.error('Error al restaurar backup:', error);
      throw new Error('No se pudo restaurar el backup');
    }
  }

  // Exportar backup como archivo
  exportBackup(): void {
    try {
      const backup = this.createBackup();
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `growshop_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      notificationService.addBackupSuccess();
    } catch (error) {
      console.error('Error al exportar backup:', error);
      notificationService.addBackupError();
    }
  }

  // Importar backup desde archivo
  async importBackup(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const backup: BackupData = JSON.parse(e.target?.result as string);
          
          // Validar estructura del backup
          if (!backup.version || !backup.products || !backup.sales) {
            throw new Error('Formato de backup inválido');
          }

          this.restoreFromBackup(backup);
          this.saveBackup(backup);
          
          notificationService.add({
            type: 'success',
            title: 'Backup Importado',
            message: `Se importaron ${backup.metadata.totalProducts} productos y ${backup.metadata.totalSales} ventas.`,
          });

          resolve();
        } catch (error) {
          console.error('Error al importar backup:', error);
          notificationService.addBackupError();
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsText(file);
    });
  }

  // Backup automático cada 30 minutos
  startAutoBackup(): void {
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
    }

    this.autoBackupInterval = setInterval(() => {
      try {
        const backup = this.createBackup();
        this.saveBackup(backup);
        console.log('Backup automático completado');
      } catch (error) {
        console.error('Error en backup automático:', error);
      }
    }, 30 * 60 * 1000); // 30 minutos
  }

  // Detener backup automático
  stopAutoBackup(): void {
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
      this.autoBackupInterval = null;
    }
  }

  // Obtener información del último backup
  getLastBackupInfo(): { timestamp: string; metadata: any } | null {
    const backup = this.loadBackup();
    if (backup) {
      return {
        timestamp: backup.timestamp,
        metadata: backup.metadata,
      };
    }
    return null;
  }

  // Verificar si hay datos para respaldar
  hasDataToBackup(): boolean {
    const products = productsService.getAll();
    const sales = salesService.getAll();
    return products.length > 0 || sales.length > 0;
  }

  // Limpiar backups antiguos (mantener solo el último)
  cleanupOldBackups(): void {
    // En esta implementación local, solo mantenemos el último backup
    // En una implementación más avanzada, podríamos mantener múltiples versiones
    console.log('Limpieza de backups completada');
  }
}

const backupService = new BackupService();
export default backupService; 