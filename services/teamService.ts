import ApiService from './apiService';
import { Team } from '../types';

interface CreateTeamData {
  name: string;
  hubId: string;
  teamLeadId: string;
}

interface TeamPerformanceMetrics {
  totalDrivers: number;
  activeDrivers: number;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  successRate: number;
  averageOrdersPerDriver: number;
}

class TeamService {
  private static readonly BASE_URL = '/teams';

  // Get all teams
  static async getAllTeams(): Promise<Team[]> {
    return ApiService.get<Team[]>(this.BASE_URL);
  }

  // Get team by ID
  static async getTeamById(id: string): Promise<Team> {
    return ApiService.get<Team>(`${this.BASE_URL}/${id}`);
  }

  // Create a new team
  static async createTeam(teamData: CreateTeamData): Promise<Team> {
    return ApiService.post<Team>(this.BASE_URL, teamData);
  }

  // Update team
  static async updateTeam(id: string, teamData: Partial<Team>): Promise<Team> {
    return ApiService.put<Team>(`${this.BASE_URL}/${id}`, teamData);
  }

  // Delete team
  static async deleteTeam(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Get teams by hub
  static async getTeamsByHub(hubId: string): Promise<Team[]> {
    return ApiService.get<Team[]>(`${this.BASE_URL}/hub/${hubId}`);
  }

  // Get teams by team lead
  static async getTeamsByTeamLead(teamLeadId: string): Promise<Team[]> {
    return ApiService.get<Team[]>(`${this.BASE_URL}/lead/${teamLeadId}`);
  }

  // Get team performance metrics
  static async getTeamPerformance(id: string): Promise<TeamPerformanceMetrics> {
    return ApiService.get<TeamPerformanceMetrics>(`${this.BASE_URL}/${id}/performance`);
  }

  // Update team drivers (assign/unassign drivers to/from team)
  static async updateTeamDrivers(teamId: string, driverIds: string[]): Promise<void> {
    return ApiService.post<void>(`${this.BASE_URL}/${teamId}/drivers`, { driverIds });
  }
}

export default TeamService;