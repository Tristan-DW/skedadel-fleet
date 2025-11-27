import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Base API URL - Use environment variable if available, otherwise default to localhost
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout configuration (120 seconds) for remote database operations
  timeout: 120000,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to retry a failed API call
const retryRequest = async (
  error: AxiosError,
  maxRetries = 3,
  retryDelay = 1000,
  retryCount = 0
): Promise<any> => {
  const { config } = error;

  // Only retry on network errors, 5xx responses, or specific timeout errors
  const shouldRetry = (
    !error.response ||
    (error.response && error.response.status >= 500) ||
    error.code === 'ECONNABORTED' ||
    error.message.includes('timeout')
  );

  if (shouldRetry && retryCount < maxRetries && config) {
    retryCount++;
    console.log(`API call failed. Retrying (${retryCount}/${maxRetries})...`);

    // Wait with exponential backoff before retrying
    await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(1.5, retryCount - 1)));

    // Create a new Axios instance for the retry to avoid interceptor loops
    const retryClient = axios.create({
      timeout: config.timeout,
      headers: config.headers
    });

    try {
      return await retryClient(config);
    } catch (retryError) {
      // Continue retrying if there are retries left
      return retryRequest(retryError as AxiosError, maxRetries, retryDelay, retryCount);
    }
  }

  // If we shouldn't retry or have exhausted retries, reject with the original error
  return Promise.reject(error);
};

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;

    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page or dispatch logout action
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Attempt to retry the request if it's a network error, 5xx response, or timeout
    return retryRequest(error);
  }
);

// Generic API service class
class ApiService {
  // GET request
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<{ success: boolean; data: T }> = await apiClient.get(url, config);
      return response.data.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  // POST request
  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<{ success: boolean; data: T }> = await apiClient.post(url, data, config);
      return response.data.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  // PUT request
  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<{ success: boolean; data: T }> = await apiClient.put(url, data, config);
      return response.data.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  // PATCH request
  static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<{ success: boolean; data: T }> = await apiClient.patch(url, data, config);
      return response.data.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  // DELETE request
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<{ success: boolean; data: T }> = await apiClient.delete(url, config);
      return response.data.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  // Error handler
  private static handleError(error: AxiosError): void {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
    }
  }
}

export default ApiService;