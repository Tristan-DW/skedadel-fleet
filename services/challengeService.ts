import ApiService from './apiService';
import { Challenge, ChallengeType, Driver, DriverChallenge } from '../types';

interface CreateChallengeData {
  name: string;
  description: string;
  type: ChallengeType;
  goal: number;
  points: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

interface ChallengeStats {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  inProgressChallenges: number;
  completionRate: number;
  challengesByType: Record<string, number>;
  popularChallenges: {
    id: string;
    name: string;
    participantCount: number;
  }[];
  topDrivers: {
    id: string;
    name: string;
    completedChallenges: number;
  }[];
}

class ChallengeService {
  private static readonly BASE_URL = '/challenges';

  // Get all challenges with optional filtering
  static async getAllChallenges(isActive?: boolean, type?: ChallengeType): Promise<Challenge[]> {
    let queryString = '';
    if (isActive !== undefined || type) {
      const params = new URLSearchParams();
      if (isActive !== undefined) params.append('isActive', isActive.toString());
      if (type) params.append('type', type);
      queryString = `?${params.toString()}`;
    }
    return ApiService.get<Challenge[]>(`${this.BASE_URL}${queryString}`);
  }

  // Get challenge by ID
  static async getChallengeById(id: string): Promise<Challenge> {
    return ApiService.get<Challenge>(`${this.BASE_URL}/${id}`);
  }

  // Create a new challenge
  static async createChallenge(challengeData: CreateChallengeData): Promise<Challenge> {
    return ApiService.post<Challenge>(this.BASE_URL, challengeData);
  }

  // Update challenge
  static async updateChallenge(id: string, challengeData: Partial<Challenge>): Promise<Challenge> {
    return ApiService.put<Challenge>(`${this.BASE_URL}/${id}`, challengeData);
  }

  // Delete challenge
  static async deleteChallenge(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Toggle challenge active status
  static async toggleChallengeActive(id: string): Promise<Challenge> {
    return ApiService.patch<Challenge>(`${this.BASE_URL}/${id}/toggle-active`, {});
  }

  // Get challenges by type
  static async getChallengesByType(type: ChallengeType): Promise<Challenge[]> {
    return ApiService.get<Challenge[]>(`${this.BASE_URL}/type/${type}`);
  }

  // Get active challenges
  static async getActiveChallenges(): Promise<Challenge[]> {
    return ApiService.get<Challenge[]>(`${this.BASE_URL}/active`);
  }

  // Get challenge statistics
  static async getChallengeStats(): Promise<ChallengeStats> {
    return ApiService.get<ChallengeStats>(`${this.BASE_URL}/stats`);
  }

  // Assign challenge to drivers
  static async assignChallengeToDrivers(challengeId: string, driverIds: string[]): Promise<void> {
    return ApiService.post<void>(`${this.BASE_URL}/${challengeId}/assign`, { driverIds });
  }

  // Get drivers participating in a challenge
  static async getDriversInChallenge(challengeId: string): Promise<Driver[]> {
    return ApiService.get<Driver[]>(`${this.BASE_URL}/${challengeId}/drivers`);
  }

  // Get all driver challenges
  static async getAllDriverChallenges(): Promise<DriverChallenge[]> {
    return ApiService.get<DriverChallenge[]>('/driver-challenges');
  }

  // Get driver challenges by driver ID
  static async getDriverChallengesByDriver(driverId: string): Promise<DriverChallenge[]> {
    return ApiService.get<DriverChallenge[]>(`/driver-challenges/driver/${driverId}`);
  }

  // Get driver challenges by challenge ID
  static async getDriverChallengesByChallenge(challengeId: string): Promise<DriverChallenge[]> {
    return ApiService.get<DriverChallenge[]>(`/driver-challenges/challenge/${challengeId}`);
  }
}

export default ChallengeService;