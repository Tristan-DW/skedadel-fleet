import ApiService from './apiService';
import { Store, LatLng } from '../types';

interface CreateStoreData {
  name: string;
  location: LatLng;
  manager: string;
  hubId: string;
  status?: 'ONLINE' | 'OFFLINE';
}

interface StorePerformanceMetrics {
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  pendingOrders: number;
  successRate: number;
  avgPrepTimeMinutes: number;
  ordersByPriority: Record<string, number>;
  status: 'ONLINE' | 'OFFLINE';
}

class StoreService {
  private static readonly BASE_URL = '/stores';

  // Get all stores
  static async getAllStores(): Promise<Store[]> {
    return ApiService.get<Store[]>(this.BASE_URL);
  }

  // Get store by ID
  static async getStoreById(id: string): Promise<Store> {
    return ApiService.get<Store>(`${this.BASE_URL}/${id}`);
  }

  // Create a new store
  static async createStore(storeData: CreateStoreData): Promise<Store> {
    return ApiService.post<Store>(this.BASE_URL, storeData);
  }

  // Update store
  static async updateStore(id: string, storeData: Partial<Store>): Promise<Store> {
    return ApiService.put<Store>(`${this.BASE_URL}/${id}`, storeData);
  }

  // Delete store
  static async deleteStore(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Update store status
  static async updateStoreStatus(id: string, status: 'ONLINE' | 'OFFLINE'): Promise<Store> {
    return ApiService.patch<Store>(`${this.BASE_URL}/${id}/status`, { status });
  }

  // Get stores by hub
  static async getStoresByHub(hubId: string): Promise<Store[]> {
    return ApiService.get<Store[]>(`${this.BASE_URL}/hub/${hubId}`);
  }

  // Get stores by status
  static async getStoresByStatus(status: 'ONLINE' | 'OFFLINE'): Promise<Store[]> {
    return ApiService.get<Store[]>(`${this.BASE_URL}/status/${status}`);
  }

  // Get store performance metrics
  static async getStorePerformance(id: string): Promise<StorePerformanceMetrics> {
    return ApiService.get<StorePerformanceMetrics>(`${this.BASE_URL}/${id}/performance`);
  }
}

export default StoreService;