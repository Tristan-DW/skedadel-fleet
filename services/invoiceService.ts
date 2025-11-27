import ApiService from './apiService';
import { Invoice } from '../types';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface CreateInvoiceData {
  invoiceNumber: string;
  clientName: string;
  storeId?: string;
  amount: number;
  tax?: number;
  totalAmount?: number;
  lineItems?: LineItem[];
  issueDate?: string;
  dueDate: string;
  notes?: string;
  createdBy: string;
}

interface InvoiceFilters {
  status?: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';
  clientName?: string;
  storeId?: string;
  startDate?: string;
  endDate?: string;
  dueDateStart?: string;
  dueDateEnd?: string;
  page?: number;
  limit?: number;
}

interface InvoiceStats {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  counts: {
    totalInvoices: number;
    paidInvoices: number;
    pendingInvoices: number;
    overdueInvoices: number;
    cancelledInvoices: number;
  };
  amounts: {
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    paymentRate: number;
  };
  byMonth: Record<string, {
    count: number;
    amount: number;
    paid: number;
    pending: number;
    overdue: number;
  }>;
}

class InvoiceService {
  private static readonly BASE_URL = '/invoices';

  // Get all invoices without filtering (for compatibility with other services)
  static async getAllInvoices(): Promise<Invoice[]> {
    const response = await this.getInvoices();
    return response.data;
  }

  // Get all invoices with optional filtering and pagination
  static async getInvoices(filters?: InvoiceFilters): Promise<{
    data: Invoice[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Build query string from filters
    let queryString = '';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.clientName) params.append('clientName', filters.clientName);
      if (filters.storeId) params.append('storeId', filters.storeId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.dueDateStart) params.append('dueDateStart', filters.dueDateStart);
      if (filters.dueDateEnd) params.append('dueDateEnd', filters.dueDateEnd);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      queryString = params.toString() ? `?${params.toString()}` : '';
    }

    return ApiService.get<{
      data: Invoice[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`${this.BASE_URL}${queryString}`);
  }

  // Get invoice by ID
  static async getInvoiceById(id: string): Promise<Invoice> {
    return ApiService.get<Invoice>(`${this.BASE_URL}/${id}`);
  }

  // Create a new invoice
  static async createInvoice(invoiceData: CreateInvoiceData): Promise<Invoice> {
    return ApiService.post<Invoice>(this.BASE_URL, invoiceData);
  }

  // Update invoice
  static async updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
    return ApiService.put<Invoice>(`${this.BASE_URL}/${id}`, invoiceData);
  }

  // Delete invoice
  static async deleteInvoice(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Mark invoice as paid
  static async markInvoiceAsPaid(id: string): Promise<Invoice> {
    return ApiService.patch<Invoice>(`${this.BASE_URL}/${id}/mark-paid`, {});
  }

  // Cancel invoice
  static async cancelInvoice(id: string): Promise<Invoice> {
    return ApiService.patch<Invoice>(`${this.BASE_URL}/${id}/cancel`, {});
  }

  // Get invoices by store
  static async getInvoicesByStore(storeId: string): Promise<Invoice[]> {
    return ApiService.get<Invoice[]>(`${this.BASE_URL}/store/${storeId}`);
  }

  // Get invoices by status
  static async getInvoicesByStatus(status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled'): Promise<Invoice[]> {
    return ApiService.get<Invoice[]>(`${this.BASE_URL}/status/${status}`);
  }

  // Get overdue invoices
  static async getOverdueInvoices(): Promise<Invoice[]> {
    return ApiService.get<Invoice[]>(`${this.BASE_URL}/overdue`);
  }

  // Get invoice statistics
  static async getInvoiceStats(startDate?: string, endDate?: string): Promise<InvoiceStats> {
    let queryString = '';
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      queryString = `?${params.toString()}`;
    }
    return ApiService.get<InvoiceStats>(`${this.BASE_URL}/stats${queryString}`);
  }

  // Generate invoice PDF
  static async generateInvoicePDF(id: string): Promise<{ 
    success: boolean; 
    message: string;
    invoiceData: Invoice;
  }> {
    return ApiService.get<{ 
      success: boolean; 
      message: string;
      invoiceData: Invoice;
    }>(`${this.BASE_URL}/${id}/pdf`);
  }
}

export default InvoiceService;