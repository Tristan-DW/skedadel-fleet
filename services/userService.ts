import ApiService from './apiService';
import { User, UserRole } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

class UserService {
  private static readonly BASE_URL = '/users';

  // Register a new user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>(`${this.BASE_URL}/register`, userData);
      // Store token in localStorage
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>(`${this.BASE_URL}/login`, credentials);
      // Store token in localStorage
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  }

  // Get current user from localStorage
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get all users
  static async getAllUsers(): Promise<User[]> {
    return ApiService.get<User[]>(this.BASE_URL);
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User> {
    return ApiService.get<User>(`${this.BASE_URL}/${id}`);
  }

  // Update user
  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return ApiService.put<User>(`${this.BASE_URL}/${id}`, userData);
  }

  // Delete user
  static async deleteUser(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }
}

export default UserService;