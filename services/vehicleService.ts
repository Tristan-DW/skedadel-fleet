import ApiService from './apiService';
import { Vehicle } from '../types';

interface CreateVehicleData {
  name: string;
  type: string;
  licensePlate: string;
  status?: 'Active' | 'Maintenance' | 'Decommissioned';
}

class VehicleService {
  private static readonly BASE_URL = '/vehicles';

  // Get all vehicles
  static async getAllVehicles(): Promise<Vehicle[]> {
    return ApiService.get<Vehicle[]>(this.BASE_URL);
  }

  // Get vehicle by ID
  static async getVehicleById(id: string): Promise<Vehicle> {
    return ApiService.get<Vehicle>(`${this.BASE_URL}/${id}`);
  }

  // Create a new vehicle
  static async createVehicle(vehicleData: CreateVehicleData): Promise<Vehicle> {
    return ApiService.post<Vehicle>(this.BASE_URL, vehicleData);
  }

  // Update vehicle
  static async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return ApiService.put<Vehicle>(`${this.BASE_URL}/${id}`, vehicleData);
  }

  // Delete vehicle
  static async deleteVehicle(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Update vehicle status
  static async updateVehicleStatus(
    id: string, 
    status: 'Active' | 'Maintenance' | 'Decommissioned'
  ): Promise<Vehicle> {
    return ApiService.patch<Vehicle>(`${this.BASE_URL}/${id}/status`, { status });
  }

  // Get vehicles by status
  static async getVehiclesByStatus(status: 'Active' | 'Maintenance' | 'Decommissioned'): Promise<Vehicle[]> {
    return ApiService.get<Vehicle[]>(`${this.BASE_URL}/status/${status}`);
  }
}

export default VehicleService;