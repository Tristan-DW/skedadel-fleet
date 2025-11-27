import ApiService from './apiService';
import { Hub, LatLng } from '../types';

interface CreateHubData {
  name: string;
  location: LatLng;
  geofenceId?: string;
}

interface HubStatistics {
  teamCount: number;
  storeCount: number;
  driverCount: number;
  activeDrivers: number;
  onlineStores: number;
  orderCount: number;
  successfulOrders: number;
  failedOrders: number;
  pendingOrders: number;
  successRate: number;
}

class HubService {
  private static readonly BASE_URL = '/hubs';

  // Get all hubs
  static async getAllHubs(): Promise<Hub[]> {
    return ApiService.get<Hub[]>(this.BASE_URL);
  }

  // Get hub by ID
  static async getHubById(id: string): Promise<Hub> {
    return ApiService.get<Hub>(`${this.BASE_URL}/${id}`);
  }

  // Create a new hub
  static async createHub(hubData: CreateHubData): Promise<Hub> {
    return ApiService.post<Hub>(this.BASE_URL, hubData);
  }

  // Update hub
  static async updateHub(id: string, hubData: Partial<Hub>): Promise<Hub> {
    return ApiService.put<Hub>(`${this.BASE_URL}/${id}`, hubData);
  }

  // Delete hub
  static async deleteHub(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Get hubs by geofence
  static async getHubsByGeofence(geofenceId: string): Promise<Hub[]> {
    return ApiService.get<Hub[]>(`${this.BASE_URL}/geofence/${geofenceId}`);
  }

  // Get hub statistics
  static async getHubStats(id: string): Promise<HubStatistics> {
    return ApiService.get<HubStatistics>(`${this.BASE_URL}/${id}/stats`);
  }

  // Update hub stores (assign/unassign stores to/from hub)
  static async updateHubStores(hubId: string, storeIds: string[]): Promise<void> {
    return ApiService.post<void>(`${this.BASE_URL}/${hubId}/stores`, { storeIds });
  }
}

export default HubService;