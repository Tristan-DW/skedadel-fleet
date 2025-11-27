import ApiService from './apiService';
import { Driver, DriverStatus } from '../types';

interface DriverLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface CreateDriverData {
  name: string;
  phone: string;
  email: string;
  vehicleId?: string;
  teamId?: string;
  user?: string; // Optional user ID if driver already has a user account
}

class DriverService {
  private static readonly BASE_URL = '/drivers';

  // Get all drivers
  static async getAllDrivers(): Promise<Driver[]> {
    return ApiService.get<Driver[]>(this.BASE_URL);
  }

  // Get driver by ID
  static async getDriverById(id: string): Promise<Driver> {
    return ApiService.get<Driver>(`${this.BASE_URL}/${id}`);
  }

  // Create a new driver
  static async createDriver(driverData: CreateDriverData): Promise<Driver> {
    return ApiService.post<Driver>(this.BASE_URL, driverData);
  }

  // Update driver
  static async updateDriver(id: string, driverData: Partial<Driver>): Promise<Driver> {
    return ApiService.put<Driver>(`${this.BASE_URL}/${id}`, driverData);
  }

  // Delete driver
  static async deleteDriver(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Update driver location
  static async updateDriverLocation(id: string, location: DriverLocation): Promise<Driver> {
    return ApiService.patch<Driver>(`${this.BASE_URL}/${id}/location`, location);
  }

  // Update driver status
  static async updateDriverStatus(id: string, status: DriverStatus): Promise<Driver> {
    return ApiService.patch<Driver>(`${this.BASE_URL}/${id}/status`, { status });
  }

  // Get drivers by team
  static async getDriversByTeam(teamId: string): Promise<Driver[]> {
    return ApiService.get<Driver[]>(`${this.BASE_URL}/team/${teamId}`);
  }

  // Get available drivers
  static async getAvailableDrivers(): Promise<Driver[]> {
    return ApiService.get<Driver[]>(`${this.BASE_URL}/status/available`);
  }
}

export default DriverService;