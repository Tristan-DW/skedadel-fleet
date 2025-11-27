import React from 'react';
import Button from '../components/ui/Button';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="bg-background rounded-md p-4 overflow-x-auto text-sm text-gray-300 border border-border">
    <code>{children}</code>
  </pre>
);

const Endpoint: React.FC<{
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  children?: React.ReactNode;
}> = ({ method, path, description, children }) => {
  const methodColors = {
    GET: 'text-blue-400',
    POST: 'text-green-400',
    PUT: 'text-yellow-400',
    DELETE: 'text-red-400',
  };
  return (
    <div className="space-y-3 border-l-2 border-border pl-4 py-2">
      <h5 className="font-medium font-mono text-lg">
        <span className={`font-bold ${methodColors[method]}`}>{method}</span> {path}
      </h5>
      <p className="text-text-secondary text-sm">{description}</p>
      {children}
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-surface border border-border rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="space-y-8">{children}</div>
  </div>
);


const APIDocs: React.FC = () => {
  return (
    <div className="p-6">
      <div className="space-y-8 text-text-primary max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold mb-2">Skedadel Developer API</h2>
          <p className="text-text-secondary">
            Leverage our powerful REST API to connect Skedadel with your existing systems, build custom solutions, and automate your delivery workflows.
          </p>
        </div>

        <Section title="Authentication">
          <p className="text-text-secondary">
            Authenticate your API requests by providing your secret API key in the `Authorization` header. All API requests must be made over HTTPS.
          </p>
          <CodeBlock>{`Authorization: Bearer YOUR_SECRET_API_KEY`}</CodeBlock>
        </Section>

        <Section title="API Keys">
          <p className="text-text-secondary">
            Manage your API keys from this section. Keep your keys confidential and secure. Do not share them in publicly accessible areas such as GitHub or client-side code.
          </p>
          <div className="bg-background p-4 rounded-lg border border-border flex justify-between items-center">
            <div>
              <p className="font-mono text-text-primary">sk_live_******************-DEMO</p>
              <p className="text-xs text-text-secondary">Default Key (Read/Write)</p>
            </div>
            <Button variant="secondary" onClick={() => alert('API key management is not available in this demo.')}>Generate New Key</Button>
          </div>
        </Section>

        <Section title="Tasks API (Orders)">
          <Endpoint method="POST" path="/api/orders" description="Create a new delivery or pickup task.">
            <CodeBlock>{`// Request Body for a single task
{
  "title": "Order #KF-1234",
  "description": "Deliver package to customer",
  "customerName": "Acme Corp",
  "customerPhone": "+27821234567",
  "origin": {
    "lat": -26.2041,
    "lng": 28.0473,
    "address": "123 Pickup St, Johannesburg"
  },
  "destination": {
    "lat": -26.1952,
    "lng": 28.0340,
    "address": "456 Delivery Ave, Johannesburg"
  },
  "storeId": "S001",
  "priority": "High",
  "orderType": "DELIVERY"
}`}</CodeBlock>
          </Endpoint>
          <Endpoint method="GET" path="/api/orders" description="View all tasks with optional filters." />
          <Endpoint method="GET" path="/api/orders/{id}" description="Get details for a specific task." />
          <Endpoint method="PUT" path="/api/orders/{id}" description="Edit the details of an existing task." />
          <Endpoint method="DELETE" path="/api/orders/{id}" description="Delete a task." />
          <Endpoint method="PATCH" path="/api/orders/{id}/status" description="Update task status." />
          <Endpoint method="PATCH" path="/api/orders/{id}/assign" description="Assign a task to a driver." />
          <Endpoint method="GET" path="/api/orders/stats" description="Get statistics about tasks." />
        </Section>

        <Section title="Agents API (Drivers)">
          <Endpoint method="POST" path="/api/drivers" description="Add a new agent to the fleet." >
            <CodeBlock>{`// Request Body for a new driver
{
  "name": "John Doe",
  "phone": "+27829876543",
  "email": "john@example.com",
  "status": "Available",
  "location": {
    "lat": -26.2041,
    "lng": 28.0473,
    "address": "Current Location"
  },
  "teamId": "T001",
  "vehicleId": "V001"
}`}</CodeBlock>
          </Endpoint>
          <Endpoint method="GET" path="/api/drivers" description="Get a list of all agents." />
          <Endpoint method="GET" path="/api/drivers/{id}" description="View an agent's profile and details." />
          <Endpoint method="PUT" path="/api/drivers/{id}" description="Edit an agent's details." />
          <Endpoint method="DELETE" path="/api/drivers/{id}" description="Delete an agent from the fleet." />
          <Endpoint method="PATCH" path="/api/drivers/{id}/location" description="Update agent location." />
          <Endpoint method="PATCH" path="/api/drivers/{id}/status" description="Update agent status." />
        </Section>

        <Section title="Teams API">
          <Endpoint method="POST" path="/api/v1/teams" description="Create a new team." />
          <Endpoint method="GET" path="/api/v1/teams" description="Get a list of all teams." />
          <Endpoint method="GET" path="/api/v1/teams/{teamId}" description="Get details for a specific team." />
          <Endpoint method="PUT" path="/api/v1/teams/{teamId}" description="Update a team's name, lead, or hub." />
          <Endpoint method="DELETE" path="/api/v1/teams/{teamId}" description="Delete a team." />
        </Section>

        <Section title="Customers API">
          <Endpoint method="POST" path="/api/v1/customers" description="Add a new customer." />
          <Endpoint method="GET" path="/api/v1/customers" description="Get a list of all customers." />
          <Endpoint method="GET" path="/api/v1/customers/{customerId}" description="View a customer's profile." />
          <Endpoint method="PUT" path="/api/v1/customers/{customerId}" description="Edit a customer's details." />
          <Endpoint method="DELETE" path="/api/v1/customers/{customerId}" description="Delete a customer." />
        </Section>

        <Section title="Webhooks">
          <p className="text-text-secondary">
            Use webhooks to be notified about events that happen in your Skedadel account. Create a webhook endpoint on your server, and we'll send a POST request with event details to that URL.
          </p>
          <h4 className="font-semibold text-md mt-4">Events</h4>
          <ul className="list-disc list-inside text-text-secondary space-y-1">
            <li><span className="font-mono text-text-primary">task.created</span> - Fired whenever a new task is created.</li>
            <li><span className="font-mono text-text-primary">task.status_changed</span> - Fired when a task's status is updated.</li>
            <li><span className="font-mono text-text-primary">agent.location_updated</span> - Fired when an agent's location changes significantly.</li>
            <li><span className="font-mono text-text-primary">team.updated</span> - Fired when a team's details are updated.</li>
          </ul>
        </Section>
      </div>
    </div>
  );
};

export default APIDocs;