import ApiService from './apiService';
import { Geofence, LatLng } from '../types';

interface CreateGeofenceData {
  name: string;
  coordinates: LatLng[];
  color?: string;
}

interface PointCheckResult {
  isInside: boolean;
  geofences: Geofence[];
}

interface GeofenceStatistics {
  hubCount: number;
  teamCount: number;
  storeCount: number;
  driverCount: number;
  activeDrivers: number;
  onlineStores: number;
  area: number; // in square kilometers
}

class GeofenceService {
  private static readonly BASE_URL = '/geofences';

  // Get all geofences
  static async getAllGeofences(): Promise<Geofence[]> {
    return ApiService.get<Geofence[]>(this.BASE_URL);
  }

  // Get geofence by ID
  static async getGeofenceById(id: string): Promise<Geofence> {
    return ApiService.get<Geofence>(`${this.BASE_URL}/${id}`);
  }

  // Create a new geofence
  static async createGeofence(geofenceData: CreateGeofenceData): Promise<Geofence> {
    return ApiService.post<Geofence>(this.BASE_URL, geofenceData);
  }

  // Update geofence
  static async updateGeofence(id: string, geofenceData: Partial<Geofence>): Promise<Geofence> {
    return ApiService.put<Geofence>(`${this.BASE_URL}/${id}`, geofenceData);
  }

  // Delete geofence
  static async deleteGeofence(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Check if a point is inside any geofence
  static async checkPoint(point: { lat: number; lng: number }): Promise<PointCheckResult> {
    return ApiService.post<PointCheckResult>(`${this.BASE_URL}/check-point`, point);
  }

  // Get hubs within a geofence
  static async getGeofenceHubs(id: string): Promise<any[]> {
    return ApiService.get<any[]>(`${this.BASE_URL}/${id}/hubs`);
  }

  // Get geofence statistics
  static async getGeofenceStats(id: string): Promise<GeofenceStatistics> {
    return ApiService.get<GeofenceStatistics>(`${this.BASE_URL}/${id}/stats`);
  }

  // Update geofence hubs (assign/unassign hubs to/from geofence)
  static async updateGeofenceHubs(geofenceId: string, hubIds: string[]): Promise<void> {
    return ApiService.post<void>(`${this.BASE_URL}/${geofenceId}/hubs`, { hubIds });
  }
}

export default GeofenceService;