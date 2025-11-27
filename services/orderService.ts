import ApiService from './apiService';
import { Order, OrderStatus, OrderPriority, LatLng, OrderItem } from '../types';

interface CreateOrderData {
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  origin: LatLng;
  destination: LatLng;
  status?: OrderStatus;
  priority?: OrderPriority;
  orderType?: 'PICKUP' | 'DELIVERY';
  driverId?: string | null;
  vehicleId?: string | null;
  storeId: string;
  orderItems?: OrderItem[];
}

interface OrderFilters {
  status?: OrderStatus;
  priority?: OrderPriority;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface OrderStats {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  pendingOrders: number;
  successRate: number;
  ordersByPriority: Record<string, number>;
  ordersByStatus: Record<string, number>;
  avgDeliveryTimeMinutes: number;
}

class OrderService {
  private static readonly BASE_URL = '/orders';

  // Get all orders without filtering (for compatibility with other services)
  static async getAllOrders(): Promise<Order[]> {
    // getOrders now returns the array directly
    return await this.getOrders();
  }

  // Get all orders with optional filtering and pagination
  static async getOrders(filters?: OrderFilters): Promise<any> {
    // Build query string from filters
    let queryString = '';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      queryString = params.toString() ? `?${params.toString()}` : '';
    }

    return ApiService.get<Order[]>(`${this.BASE_URL}${queryString}`);
  }

  // Get order by ID
  static async getOrderById(id: string): Promise<Order> {
    return ApiService.get<Order>(`${this.BASE_URL}/${id}`);
  }

  // Create a new order
  static async createOrder(orderData: CreateOrderData): Promise<Order> {
    return ApiService.post<Order>(this.BASE_URL, orderData);
  }

  // Update order
  static async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    return ApiService.put<Order>(`${this.BASE_URL}/${id}`, orderData);
  }

  // Delete order
  static async deleteOrder(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Update order status
  static async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return ApiService.patch<Order>(`${this.BASE_URL}/${id}/status`, { status });
  }

  // Assign driver to order
  static async assignDriver(id: string, driverId: string, vehicleId?: string): Promise<Order> {
    return ApiService.patch<Order>(`${this.BASE_URL}/${id}/assign`, { driverId, vehicleId });
  }

  // Get orders by driver
  static async getOrdersByDriver(driverId: string): Promise<Order[]> {
    return ApiService.get<Order[]>(`${this.BASE_URL}/driver/${driverId}`);
  }

  // Get orders by store
  static async getOrdersByStore(storeId: string): Promise<Order[]> {
    return ApiService.get<Order[]>(`${this.BASE_URL}/store/${storeId}`);
  }

  // Get orders by status
  static async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return ApiService.get<Order[]>(`${this.BASE_URL}/status/${status}`);
  }

  // Get orders by priority
  static async getOrdersByPriority(priority: OrderPriority): Promise<Order[]> {
    return ApiService.get<Order[]>(`${this.BASE_URL}/priority/${priority}`);
  }

  // Get order statistics
  static async getOrderStats(startDate?: string, endDate?: string): Promise<OrderStats> {
    let queryString = '';
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      queryString = `?${params.toString()}`;
    }
    return ApiService.get<OrderStats>(`${this.BASE_URL}/stats${queryString}`);
  }
}

export default OrderService;