import React from 'react';
import { Invoice } from '../types';
import { ICONS } from '../constants';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';

interface FinancialsViewProps {
    invoices: Invoice[];
}

const InvoiceStatusBadge: React.FC<{ status: Invoice['status'] }> = ({ status }) => {
    const statusStyles: Record<Invoice['status'], string> = {
        'Paid': 'bg-success/20 text-success',
        'Pending': 'bg-warning/20 text-warning',
        'Overdue': 'bg-danger/20 text-danger',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>
}


const FinancialsView: React.FC<FinancialsViewProps> = ({ invoices }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">Financials &amp; Accounting</h2>
        <div className="flex items-center space-x-3 p-2 bg-surface rounded-lg border border-border">
            <img src="https://developer.xero.com/static/images/xero-logo.svg" alt="Xero" className="h-6"/>
            <span className="text-sm font-semibold text-success">Connected</span>
            <Button variant="secondary" size-sm>Manage</Button>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue (Month)" value="R125,800" icon={ICONS.analytics} iconBgColor="bg-green-500/20 text-green-400" />
            <StatCard title="Total Expenses (Month)" value="R42,300" icon={ICONS.alert} iconBgColor="bg-red-500/20 text-red-400" />
            <StatCard title="Net Profit (Month)" value="R83,500" icon={ICONS.challenges} iconBgColor="bg-blue-500/20 text-blue-400" />
            <StatCard title="Avg. Cost Per Delivery" value="R12.50" icon={ICONS.drivers} iconBgColor="bg-yellow-500/20 text-yellow-400" />
        </div>

        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-semibold text-text-primary">Recent Invoices</h3>
                <Button>Create Invoice</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-text-secondary">
                    <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                    <tr>
                        <th scope="col" className="px-6 py-3">Invoice ID</th>
                        <th scope="col" className="px-6 py-3">Client</th>
                        <th scope="col" className="px-6 py-3">Amount</th>
                        <th scope="col" className="px-6 py-3">Due Date</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary">
                        <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{invoice.id}</th>
                        <td className="px-6 py-4">{invoice.clientName}</td>
                        <td className="px-6 py-4">R{invoice.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4"><InvoiceStatusBadge status={invoice.status} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div className="bg-surface border border-border rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-text-primary">Sync Settings</h3>
            <p className="text-sm text-text-secondary mt-1">Configure what data is automatically synced with Xero.</p>
            <div className="mt-4 space-y-2">
                <label className="flex items-center"><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-500 bg-surface text-primary focus:ring-primary" /> <span className="ml-2 text-text-primary">Sync new invoices automatically</span></label>
                <label className="flex items-center"><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-500 bg-surface text-primary focus:ring-primary" /> <span className="ml-2 text-text-primary">Sync driver payout records</span></label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-500 bg-surface text-primary focus:ring-primary" /> <span className="ml-2 text-text-primary">Sync expense receipts</span></label>
            </div>
        </div>
    </div>
  );
};

export default FinancialsView;