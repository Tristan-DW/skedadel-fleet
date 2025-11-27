import ApiService from './apiService';
import { ExclusionZone, LatLng } from '../types';

interface CreateExclusionZoneData {
  name: string;
  type: 'No-go' | 'Slow-down';
  coordinates: LatLng[];
}

interface PointCheckResult {
  isInside: boolean;
  exclusionZones: ExclusionZone[];
}

interface DriverInZone {
  driver: {
    id: string;
    name: string;
    status: string;
    location: LatLng;
    team: string | null;
  };
  exclusionZone: {
    id: string;
    name: string;
    type: 'No-go' | 'Slow-down';
  };
}

interface ZoneAreaResult {
  id: string;
  name: string;
  type: 'No-go' | 'Slow-down';
  area: number; // in square kilometers
  areaFormatted: string;
}

class ExclusionZoneService {
  private static readonly BASE_URL = '/exclusion-zones';

  // Get all exclusion zones
  static async getAllExclusionZones(): Promise<ExclusionZone[]> {
    return ApiService.get<ExclusionZone[]>(this.BASE_URL);
  }

  // Get exclusion zone by ID
  static async getExclusionZoneById(id: string): Promise<ExclusionZone> {
    return ApiService.get<ExclusionZone>(`${this.BASE_URL}/${id}`);
  }

  // Create a new exclusion zone
  static async createExclusionZone(zoneData: CreateExclusionZoneData): Promise<ExclusionZone> {
    return ApiService.post<ExclusionZone>(this.BASE_URL, zoneData);
  }

  // Update exclusion zone
  static async updateExclusionZone(id: string, zoneData: Partial<ExclusionZone>): Promise<ExclusionZone> {
    return ApiService.put<ExclusionZone>(`${this.BASE_URL}/${id}`, zoneData);
  }

  // Delete exclusion zone
  static async deleteExclusionZone(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Get exclusion zones by type
  static async getExclusionZonesByType(type: 'No-go' | 'Slow-down'): Promise<ExclusionZone[]> {
    return ApiService.get<ExclusionZone[]>(`${this.BASE_URL}/type/${type}`);
  }

  // Check if a point is inside any exclusion zone
  static async checkPoint(point: { lat: number; lng: number }): Promise<PointCheckResult> {
    return ApiService.post<PointCheckResult>(`${this.BASE_URL}/check-point`, point);
  }

  // Get drivers inside exclusion zones
  static async getDriversInsideZones(): Promise<DriverInZone[]> {
    return ApiService.get<DriverInZone[]>(`${this.BASE_URL}/drivers-inside`);
  }

  // Calculate area of exclusion zone
  static async getExclusionZoneArea(id: string): Promise<ZoneAreaResult> {
    return ApiService.get<ZoneAreaResult>(`${this.BASE_URL}/${id}/area`);
  }
}

export default ExclusionZoneService;