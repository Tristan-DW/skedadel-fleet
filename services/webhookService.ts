import ApiService from './apiService';
import { Webhook, WebhookEvent } from '../types';

interface CreateWebhookData {
  url: string;
  events: WebhookEvent[];
  description?: string;
  createdBy: string;
}

interface WebhookStats {
  totalWebhooks: number;
  activeWebhooks: number;
  inactiveWebhooks: number;
  failingWebhooks: number;
  webhooksByEvent: Record<string, number>;
  recentlyTriggered: {
    id: string;
    url: string;
    lastTriggered: string;
    isActive: boolean;
  }[];
}

interface TestWebhookResponse {
  success: boolean;
  message: string;
  testPayload: any;
  signature: string;
}

class WebhookService {
  private static readonly BASE_URL = '/webhooks';

  // Get all webhooks with optional filtering
  static async getAllWebhooks(isActive?: boolean, event?: WebhookEvent): Promise<Webhook[]> {
    let queryString = '';
    if (isActive !== undefined || event) {
      const params = new URLSearchParams();
      if (isActive !== undefined) params.append('isActive', isActive.toString());
      if (event) params.append('event', event);
      queryString = `?${params.toString()}`;
    }
    return ApiService.get<Webhook[]>(`${this.BASE_URL}${queryString}`);
  }

  // Get webhook by ID
  static async getWebhookById(id: string): Promise<Webhook> {
    return ApiService.get<Webhook>(`${this.BASE_URL}/${id}`);
  }

  // Create a new webhook
  static async createWebhook(webhookData: CreateWebhookData): Promise<Webhook & { secret: string }> {
    return ApiService.post<Webhook & { secret: string }>(this.BASE_URL, webhookData);
  }

  // Update webhook
  static async updateWebhook(id: string, webhookData: Partial<Webhook>): Promise<Webhook> {
    return ApiService.put<Webhook>(`${this.BASE_URL}/${id}`, webhookData);
  }

  // Delete webhook
  static async deleteWebhook(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Toggle webhook active status
  static async toggleWebhookActive(id: string): Promise<Webhook> {
    return ApiService.patch<Webhook>(`${this.BASE_URL}/${id}/toggle-active`, {});
  }

  // Reset webhook failure count
  static async resetWebhookFailures(id: string): Promise<Webhook> {
    return ApiService.patch<Webhook>(`${this.BASE_URL}/${id}/reset-failures`, {});
  }

  // Regenerate webhook secret
  static async regenerateWebhookSecret(id: string): Promise<Webhook & { secret: string }> {
    return ApiService.patch<Webhook & { secret: string }>(`${this.BASE_URL}/${id}/regenerate-secret`, {});
  }

  // Test webhook
  static async testWebhook(id: string): Promise<TestWebhookResponse> {
    return ApiService.post<TestWebhookResponse>(`${this.BASE_URL}/${id}/test`, {});
  }

  // Get webhooks by event
  static async getWebhooksByEvent(event: WebhookEvent): Promise<Webhook[]> {
    return ApiService.get<Webhook[]>(`${this.BASE_URL}/event/${event}`);
  }

  // Get webhook statistics
  static async getWebhookStats(): Promise<WebhookStats> {
    return ApiService.get<WebhookStats>(`${this.BASE_URL}/stats`);
  }

  // Trigger webhook for an event
  static async triggerWebhook(event: WebhookEvent, data: any): Promise<{ 
    success: boolean; 
    message: string;
    webhooksTriggered: number;
  }> {
    return ApiService.post<{ 
      success: boolean; 
      message: string;
      webhooksTriggered: number;
    }>(`${this.BASE_URL}/trigger`, { event, data });
  }
}

export default WebhookService;