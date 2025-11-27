import ApiService from './apiService';
import { Alert, AlertType } from '../types';

interface CreateAlertData {
  type: AlertType;
  message: string;
  priority?: 'high' | 'medium' | 'low';
  relatedEntityType?: 'Driver' | 'Order' | 'Store' | 'Team' | 'Hub' | 'Challenge';
  relatedEntityId?: string;
}

interface AlertFilters {
  priority?: 'high' | 'medium' | 'low';
  type?: AlertType;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface AlertStats {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  totalAlerts: number;
  readAlerts: number;
  unreadAlerts: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byType: Record<string, number>;
  byDay: Record<string, number>;
}

class AlertService {
  private static readonly BASE_URL = '/alerts';

  // Get all alerts without filtering (for compatibility with other services)
  static async getAllAlerts(): Promise<Alert[]> {
    const response = await this.getAlerts();
    return response.data;
  }

  // Get all alerts with optional filtering and pagination
  static async getAlerts(filters?: AlertFilters): Promise<{
    data: Alert[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Build query string from filters
    let queryString = '';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.type) params.append('type', filters.type);
      if (filters.isRead !== undefined) params.append('isRead', filters.isRead.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      queryString = params.toString() ? `?${params.toString()}` : '';
    }

    return ApiService.get<{
      data: Alert[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`${this.BASE_URL}${queryString}`);
  }

  // Get alert by ID
  static async getAlertById(id: string): Promise<Alert> {
    return ApiService.get<Alert>(`${this.BASE_URL}/${id}`);
  }

  // Create a new alert
  static async createAlert(alertData: CreateAlertData): Promise<Alert> {
    return ApiService.post<Alert>(this.BASE_URL, alertData);
  }

  // Delete alert
  static async deleteAlert(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Mark alert as read
  static async markAlertAsRead(id: string): Promise<Alert> {
    return ApiService.patch<Alert>(`${this.BASE_URL}/${id}/read`, {});
  }

  // Mark all alerts as read
  static async markAllAlertsAsRead(): Promise<{ success: boolean; message: string }> {
    return ApiService.patch<{ success: boolean; message: string }>(`${this.BASE_URL}/read-all`, {});
  }

  // Delete all read alerts
  static async deleteReadAlerts(): Promise<{ success: boolean; message: string }> {
    return ApiService.delete<{ success: boolean; message: string }>(`${this.BASE_URL}/read`);
  }

  // Get alerts by priority
  static async getAlertsByPriority(priority: 'high' | 'medium' | 'low'): Promise<Alert[]> {
    return ApiService.get<Alert[]>(`${this.BASE_URL}/priority/${priority}`);
  }

  // Get alerts by type
  static async getAlertsByType(type: AlertType): Promise<Alert[]> {
    return ApiService.get<Alert[]>(`${this.BASE_URL}/type/${type}`);
  }

  // Get alerts by related entity
  static async getAlertsByEntity(
    type: 'Driver' | 'Order' | 'Store' | 'Team' | 'Hub' | 'Challenge',
    id: string
  ): Promise<Alert[]> {
    return ApiService.get<Alert[]>(`${this.BASE_URL}/entity/${type}/${id}`);
  }

  // Get alert statistics
  static async getAlertStats(startDate?: string, endDate?: string): Promise<AlertStats> {
    let queryString = '';
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      queryString = `?${params.toString()}`;
    }
    return ApiService.get<AlertStats>(`${this.BASE_URL}/stats${queryString}`);
  }
}

export default AlertService;