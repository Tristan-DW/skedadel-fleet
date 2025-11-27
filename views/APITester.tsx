import React, { useState } from 'react';
import Button from '../components/ui/Button';

const APITester: React.FC = () => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
  const [endpoint, setEndpoint] = useState('/api/geofences');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const examplePayloads: Record<string, string> = {
    '/api/geofences': JSON.stringify({
      name: "Johannesburg Central",
      color: "#3b82f6",
      coordinates: [
        { lat: -26.2, lng: 28.0 },
        { lat: -26.21, lng: 28.0 },
        { lat: -26.21, lng: 28.01 },
        { lat: -26.2, lng: 28.01 }
      ]
    }, null, 2),
    '/api/vehicles': JSON.stringify({
      name: "Van 002",
      type: "Delivery Van",
      licensePlate: "XYZ789GP",
      status: "Active"
    }, null, 2),
    '/api/challenges': JSON.stringify({
      name: "Weekend Warrior",
      description: "Complete 20 deliveries over the weekend",
      type: "COMPLETE_ORDERS",
      goal: 20,
      points: 200,
      isActive: true
    }, null, 2),
    '/api/teams': JSON.stringify({
      name: "Team Beta",
      hubId: "H002"
    }, null, 2),
    '/api/hubs': JSON.stringify({
      name: "Sandton Hub",
      location: { lat: -26.1076, lng: 28.0567, address: "Sandton, JHB" },
      geofenceId: "G002"
    }, null, 2),
    '/api/stores': JSON.stringify({
      name: "Woolworths - Rosebank",
      manager: "Jane Manager",
      status: "ONLINE",
      location: { lat: -26.1447, lng: 28.0416, address: "Rosebank Mall, JHB" },
      hubId: "H002"
    }, null, 2),
    '/api/drivers': JSON.stringify({
      name: "Mike Driver",
      phone: "+27821112222",
      email: "mike@skedadel.com",
      status: "Available",
      location: { lat: -26.2041, lng: 28.0473, address: "Depot" },
      teamId: "T002",
      vehicleId: "V001"
    }, null, 2),
    '/api/orders': JSON.stringify({
      title: "Order #999",
      description: "Deliver groceries",
      customerName: "Sarah Customer",
      customerPhone: "+27823334444",
      origin: { lat: -26.1447, lng: 28.0416, address: "Rosebank" },
      destination: { lat: -26.1076, lng: 28.0567, address: "Sandton" },
      storeId: "S001",
      priority: "High",
      orderType: "DELIVERY"
    }, null, 2),
  };

  const handleSend = async (customMethod?: string, customEndpoint?: string, customBody?: string) => {
    const useMethod = customMethod || method;
    const useEndpoint = customEndpoint || endpoint;
    const useBody = customBody || body;

    setLoading(true);
    setResponse(null);

    try {
      const options: RequestInit = {
        method: useMethod,
        headers: { 'Content-Type': 'application/json' },
      };

      if (useMethod !== 'GET' && useBody) {
        options.body = useBody;
      }

      const res = await fetch(useEndpoint, options);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data
      });

      // Trigger data refresh after successful POST (no page reload!)
      if (useMethod === 'POST' && res.status >= 200 && res.status < 300) {
        setTimeout(() => {
          window.dispatchEvent(new Event('refreshData'));
        }, 500);
      }
    } catch (error: any) {
      setResponse({
        status: 'Error',
        statusText: error.message,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const quickGet = (path: string) => {
    setEndpoint(path);
    setMethod('GET');
    handleSend('GET', path);
  };

  const quickPost = (path: string) => {
    const example = examplePayloads[path];
    if (example) {
      setEndpoint(path);
      setMethod('POST');
      setBody(example);
      handleSend('POST', path, example);
    }
  };

  const loadExample = () => {
    const example = examplePayloads[endpoint];
    if (example) {
      setBody(example);
      setMethod('POST');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">API Tester</h2>
        <p className="text-text-secondary mt-1">Test all API endpoints - data auto-refreshes after creation!</p>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="flex gap-4">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="bg-background border border-border rounded px-4 py-2 text-text-primary"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/api/endpoint"
            className="flex-1 bg-background border border-border rounded px-4 py-2 text-text-primary font-mono"
          />

          <Button onClick={() => handleSend()} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>

          <Button variant="secondary" onClick={loadExample}>
            Load Example
          </Button>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 text-text-secondary">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(examplePayloads).map((path) => (
              <div key={path} className="flex gap-2">
                <button
                  onClick={() => quickGet(path)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-green-500/20 border border-green-500/50 rounded text-sm hover:bg-green-500/30 transition-colors text-left disabled:opacity-50"
                >
                  <span className="text-green-400 font-mono text-xs font-bold">GET</span> <span className="text-text-primary">{path}</span>
                </button>
                <button
                  onClick={() => quickPost(path)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                >
                  <span className="text-blue-400 font-mono text-xs font-bold">POST</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {method !== 'GET' && (
          <div>
            <label className="block text-sm font-medium mb-2">Request Body (JSON)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full bg-background border border-border rounded px-4 py-2 text-text-primary font-mono text-sm"
              placeholder='{"key": "value"}'
            />
          </div>
        )}

        {response && (
          <div>
            <div className="flex items-center gap-4 mb-2">
              <label className="text-sm font-medium">Response</label>
              <span className={`px-2 py-1 rounded text-xs font-mono ${response.status >= 200 && response.status < 300
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
                }`}>
                {response.status} {response.statusText}
              </span>
            </div>
            <pre className="bg-background border border-border rounded px-4 py-3 text-text-primary font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 bg-surface border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">How to Use</h3>
        <div className="space-y-3 text-sm text-text-secondary">
          <p><strong className="text-text-primary">All payloads use real IDs from the seeded database</strong> - just click POST and it works!</p>
          <p>Green GET buttons fetch data, Blue POST buttons create new resources.</p>
          <p>Database pre-populated with: Geofences (G002), Vehicles (V001), Hubs (H002), Teams (T002), Stores (S001), Drivers (D001).</p>
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
            <p className="text-green-400 font-medium">Data automatically refreshes after POST - no page reload needed!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITester;
