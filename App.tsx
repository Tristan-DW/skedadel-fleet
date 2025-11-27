import React, { useState, useMemo, useEffect } from 'react';

// Import services
import UserService from './services/userService';
import DriverService from './services/driverService';
import VehicleService from './services/vehicleService';
import TeamService from './services/teamService';
import HubService from './services/hubService';
import StoreService from './services/storeService';
import GeofenceService from './services/geofenceService';
import ExclusionZoneService from './services/exclusionZoneService';
import OrderService from './services/orderService';
import AlertService from './services/alertService';
import ChallengeService from './services/challengeService';
import WebhookService from './services/webhookService';
import InvoiceService from './services/invoiceService';

// Import types
import { ViewType, User, Order, Driver, Store, Team, Hub, Geofence, ExclusionZone, Challenge, DriverChallenge, Webhook, UserRole, OrderStatus, DriverStatus, Alert, Vehicle, Invoice } from './types';

// Layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Views
import Dashboard from './views/Dashboard';
import OrdersView from './views/OrdersView';
import DriversView from './views/Drivers';
import StoresView from './views/Stores';
import TeamsView from './views/TeamsView';
import HubsView from './views/HubsView';
import GeofencesView from './views/Geofences';
import ExclusionZonesView from './views/ExclusionZonesView';
import Analytics from './views/Analytics';
import ChallengesView from './views/ChallengesView';
import LiveChat from './views/LiveChat';
import SettingsView from './views/Settings';
import APIDocs from './views/APIDocs';
import APITester from './views/APITester';
import Integrations from './views/Integrations';
import FinancialsView from './views/FinancialsView';
import DriverDashboard from './views/DriverDashboard';
import DriverDetailView from './views/DriverDetailView';
import StoreDetailView from './views/StoreDetailView';
import TeamDetailView from './views/TeamDetailView';
import HubDetailView from './views/HubDetailView';
import HubAnalyticsDetailView from './views/analytics/HubAnalyticsDetailView';
import TeamAnalyticsDetailView from './views/analytics/TeamAnalyticsDetailView';
import DriverAnalyticsDetailView from './views/analytics/DriverAnalyticsDetailView';
import StoreAnalyticsDetailView from './views/analytics/StoreAnalyticsDetailView';


// Modals
import OrderModal from './components/orders/OrderModal';
import OrderDetailsDrawer from './components/orders/OrderDetailsDrawer';
import AddDriverModal from './components/drivers/AddDriverModal';
import EditDriverModal from './components/drivers/EditDriverModal';
import AddStoreModal from './components/stores/AddStoreModal';
import EditStoreModal from './components/stores/EditStoreModal';
import AddTeamModal from './components/teams/AddTeamModal';
import EditTeamModal from './components/teams/EditTeamModal';
import AddHubModal from './components/hubs/AddHubModal';
import EditHubModal from './components/hubs/EditHubModal';
import AddGeofenceModal from './components/geofences/AddGeofenceModal';
import EditGeofenceModal from './components/geofences/EditGeofenceModal';
import AddExclusionZoneModal from './components/exclusion-zones/AddExclusionZoneModal';
import EditExclusionZoneModal from './components/exclusion-zones/EditExclusionZoneModal';
import AddChallengeModal from './components/challenges/AddChallengeModal';
import EditChallengeModal from './components/challenges/EditChallengeModal';
import ManageTeamDriversModal from './components/teams/ManageTeamDriversModal';
import ManageHubStoresModal from './components/hubs/ManageHubStoresModal';
import ManageGeofenceHubsModal from './components/geofences/ManageGeofenceHubsModal';


const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Entity states
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [hubs, setHubs] = useState<Hub[]>([]);
    const [geofences, setGeofences] = useState<Geofence[]>([]);
    const [exclusionZones, setExclusionZones] = useState<ExclusionZone[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [driverChallenges, setDriverChallenges] = useState<DriverChallenge[]>([]);
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [detailViewId, setDetailViewId] = useState<string | null>(null);

    // Modal states
    const [isOrderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isAddDriverModalOpen, setAddDriverModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [isAddStoreModalOpen, setAddStoreModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [isAddTeamModalOpen, setAddTeamModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [isAddHubModalOpen, setAddHubModalOpen] = useState(false);
    const [editingHub, setEditingHub] = useState<Hub | null>(null);
    const [isAddGeofenceModalOpen, setAddGeofenceModalOpen] = useState(false);
    const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);
    const [isAddExclusionZoneModalOpen, setAddExclusionZoneModalOpen] = useState(false);
    const [editingExclusionZone, setEditingExclusionZone] = useState<ExclusionZone | null>(null);
    const [isAddChallengeModalOpen, setAddChallengeModalOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
    const [managingTeamDrivers, setManagingTeamDrivers] = useState<Team | null>(null);
    const [managingHubStores, setManagingHubStores] = useState<Hub | null>(null);
    const [managingGeofenceHubs, setManagingGeofenceHubs] = useState<Geofence | null>(null);

    // Fetch all data on component mount
    useEffect(() => {
        // Helper function to retry a failed API call
        const fetchWithRetry = async (fetchFn: () => Promise<any>, retries = 3, delay = 1000) => {
            try {
                return await fetchFn();
            } catch (error) {
                if (retries <= 0) throw error;

                console.log(`Retrying... Attempts left: ${retries}`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchWithRetry(fetchFn, retries - 1, delay * 1.5); // Exponential backoff
            }
        };

        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch each data type individually with retry
                // We run these in parallel for better performance, but handle errors individually if needed
                // For now, we'll fail if critical data fails

                const [
                    usersData,
                    ordersData,
                    driversData,
                    storesData,
                    teamsData,
                    hubsData,
                    geofencesData,
                    exclusionZonesData,
                    vehiclesData,
                    challengesData,
                    driverChallengesData,
                    webhooksData,
                    invoicesData,
                    alertsData
                ] = await Promise.all([
                    fetchWithRetry(() => UserService.getAllUsers()),
                    fetchWithRetry(() => OrderService.getAllOrders()),
                    fetchWithRetry(() => DriverService.getAllDrivers()),
                    fetchWithRetry(() => StoreService.getAllStores()),
                    fetchWithRetry(() => TeamService.getAllTeams()),
                    fetchWithRetry(() => HubService.getAllHubs()),
                    fetchWithRetry(() => GeofenceService.getAllGeofences()),
                    fetchWithRetry(() => ExclusionZoneService.getAllExclusionZones()),
                    fetchWithRetry(() => VehicleService.getAllVehicles()),
                    fetchWithRetry(() => ChallengeService.getAllChallenges()),
                    fetchWithRetry(() => ChallengeService.getAllDriverChallenges()),
                    fetchWithRetry(() => WebhookService.getAllWebhooks()),
                    fetchWithRetry(() => InvoiceService.getAllInvoices()),
                    fetchWithRetry(() => AlertService.getAllAlerts())
                ]);

                // Update state with fetched data (with fallbacks to prevent undefined errors)
                setUsers(usersData || []);
                // Transform orders to convert flattened lat/lng to nested origin/destination objects
                const transformedOrders = (ordersData || []).map((order: any) => ({
                    ...order,
                    origin: {
                        lat: order.originLat || 0,
                        lng: order.originLng || 0,
                        address: order.originAddress || ''
                    },
                    destination: {
                        lat: order.destinationLat || 0,
                        lng: order.destinationLng || 0,
                        address: order.destinationAddress || ''
                    }
                }));
                setOrders(transformedOrders);
                setDrivers(driversData || []);
                setStores(storesData || []);
                setTeams(teamsData || []);
                setHubs(hubsData || []);
                setGeofences(geofencesData || []);
                setExclusionZones(exclusionZonesData || []);
                setVehicles(vehiclesData || []);
                setChallenges(challengesData || []);
                setDriverChallenges(driverChallengesData || []);
                setWebhooks(webhooksData || []);
                setInvoices(invoicesData || []);
                setAlerts(alertsData || []);

                // Set the first user as the current user if available
                if (usersData && usersData.length > 0) {
                    setCurrentUser(usersData[0]);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data from the server. Please ensure the backend is running.');
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Live Alerts Polling with Mock Data
    useEffect(() => {
        const generateMockAlert = async () => {
            try {
                const { MOCK_ALERT_POOL } = await import('./mockData');

                // Create a mock alert from the pool
                if (MOCK_ALERT_POOL && MOCK_ALERT_POOL.length > 0) {
                    const mockAlertData = MOCK_ALERT_POOL[Math.floor(Math.random() * MOCK_ALERT_POOL.length)];
                    const mockAlert = {
                        ...mockAlertData,
                        id: `mock-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                    };

                    setAlerts(prevAlerts => {
                        return [mockAlert, ...prevAlerts].slice(0, 10);
                    });

                    console.log('Generated new mock alert');
                }
            } catch (mockError) {
                console.error('Failed to load mock alert data:', mockError);
            }
        };

        // Generate a mock alert immediately
        generateMockAlert();

        // Set up interval to generate mock alerts periodically
        const interval = setInterval(generateMockAlert, 15000); // Generate a new mock alert every 15 seconds

        return () => clearInterval(interval);
    }, []);

    // Listen for data refresh events (triggered by API Tester)
    useEffect(() => {
        const handleRefreshData = async () => {
            console.log('Refreshing data...');
            setLoading(true);

            try {
                const [
                    ordersData,
                    driversData,
                    storesData,
                    teamsData,
                    hubsData,
                    geofencesData,
                    vehiclesData
                ] = await Promise.all([
                    OrderService.getAllOrders(),
                    DriverService.getAllDrivers(),
                    StoreService.getAllStores(),
                    TeamService.getAllTeams(),
                    HubService.getAllHubs(),
                    GeofenceService.getAllGeofences(),
                    VehicleService.getAllVehicles()
                ]);

                const transformedOrders = (ordersData || []).map((order: any) => ({
                    ...order,
                    origin: order.origin || {
                        lat: order.originLat || 0,
                        lng: order.originLng || 0,
                        address: order.originAddress || ''
                    },
                    destination: order.destination || {
                        lat: order.destinationLat || 0,
                        lng: order.destinationLng || 0,
                        address: order.destinationAddress || ''
                    }
                }));

                setOrders(transformedOrders);
                setDrivers(driversData || []);
                setStores(storesData || []);
                setTeams(teamsData || []);
                setHubs(hubsData || []);
                setGeofences(geofencesData || []);
                setVehicles(vehiclesData || []);

                console.log('Data refreshed successfully!');
            } catch (error) {
                console.error('Error refreshing data:', error);
            } finally {
                setLoading(false);
            }
        };

        window.addEventListener('refreshData', handleRefreshData);
        return () => window.removeEventListener('refreshData', handleRefreshData);
    }, []);

    // --- COMPUTED DATA ---
    const selectedDriver = useMemo(() => drivers.find(d => d.id === selectedOrder?.driverId), [drivers, selectedOrder]);
    const selectedStore = useMemo(() => stores.find(s => s.id === selectedOrder?.storeId), [stores, selectedOrder]);

    // --- HANDLERS ---
    const handleSetView = (view: ViewType) => {
        setDetailViewId(null);
        setCurrentView(view);
    }

    const handleSelectOrder = (order: Order) => setSelectedOrder(order);

    const handleAddOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'activityLog'>) => {
        try {
            const newOrder = await OrderService.createOrder(order);
            setOrders(prev => [newOrder, ...prev]);
        } catch (error) {
            console.error('Error adding order:', error);
            setError('Failed to add order. Please try again.');
        }
    };

    const handleAssignDriver = async (orderId: string, driverId: string) => {
        try {
            await OrderService.assignDriver(orderId, driverId);

            // Refresh orders locally
            setOrders(prevOrders => prevOrders.map(o =>
                o.id === orderId ? { ...o, driverId: driverId, status: 'Assigned' as any } : o
            ));

            // Update selected order
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, driverId: driverId, status: 'Assigned' as any });
            }
        } catch (error) {
            console.error('Failed to assign driver:', error);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
        try {
            const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        } catch (error) {
            console.error('Error updating order status:', error);
            setError('Failed to update order status. Please try again.');
        }
    }

    const handleAddDriver = async (driver: Omit<Driver, 'id' | 'status' | 'location' | 'points' | 'rank'>) => {
        try {
            // Prepare driver data with default values
            const driverData = {
                ...driver,
                status: DriverStatus.OFFLINE,
                location: { lat: -26.10, lng: 28.05, address: "Offline" },
                points: 0,
                rank: drivers.length + 1,
            };

            const newDriver = await DriverService.createDriver(driverData);
            setDrivers(prev => [...prev, newDriver]);
        } catch (error) {
            console.error('Error adding driver:', error);
            setError('Failed to add driver. Please try again.');
        }
    };

    const handleUpdateDriver = async (updatedDriver: Driver) => {
        try {
            const result = await DriverService.updateDriver(updatedDriver.id, updatedDriver);
            setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? result : d));
        } catch (error) {
            console.error('Error updating driver:', error);
            setError('Failed to update driver. Please try again.');
        }
    }

    const handleAddStore = async (store: Omit<Store, 'id'>) => {
        try {
            const newStore = await StoreService.createStore(store);
            setStores(prev => [...prev, newStore]);
        } catch (error) {
            console.error('Error adding store:', error);
            setError('Failed to add store. Please try again.');
        }
    }

    const handleUpdateStore = async (updatedStore: Store) => {
        try {
            const result = await StoreService.updateStore(updatedStore.id, updatedStore);
            setStores(prev => prev.map(s => s.id === updatedStore.id ? result : s));
        } catch (error) {
            console.error('Error updating store:', error);
            setError('Failed to update store. Please try again.');
        }
    }

    const handleUpdateStoreStatus = async (storeId: string, status: 'ONLINE' | 'OFFLINE') => {
        try {
            const result = await StoreService.updateStoreStatus(storeId, status);
            setStores(prev => prev.map(s => s.id === storeId ? result : s));
        } catch (error) {
            console.error('Error updating store status:', error);
            setError('Failed to update store status. Please try again.');
        }
    }

    const handleAddTeam = async (team: Omit<Team, 'id'>) => {
        try {
            const newTeam = await TeamService.createTeam(team);
            setTeams(prev => [...prev, newTeam]);
        } catch (error) {
            console.error('Error adding team:', error);
            setError('Failed to add team. Please try again.');
        }
    }

    const handleUpdateTeam = async (updatedTeam: Team) => {
        try {
            const result = await TeamService.updateTeam(updatedTeam.id, updatedTeam);
            setTeams(prev => prev.map(t => t.id === updatedTeam.id ? result : t));
        } catch (error) {
            console.error('Error updating team:', error);
            setError('Failed to update team. Please try again.');
        }
    }

    const handleAddHub = async (hub: Omit<Hub, 'id'>) => {
        try {
            const newHub = await HubService.createHub(hub);
            setHubs(prev => [...prev, newHub]);
        } catch (error) {
            console.error('Error adding hub:', error);
            setError('Failed to add hub. Please try again.');
        }
    }

    const handleUpdateHub = async (updatedHub: Hub) => {
        try {
            const result = await HubService.updateHub(updatedHub.id, updatedHub);
            setHubs(prev => prev.map(h => h.id === updatedHub.id ? result : h));
        } catch (error) {
            console.error('Error updating hub:', error);
            setError('Failed to update hub. Please try again.');
        }
    }

    const handleAddGeofence = async (geofence: Omit<Geofence, 'id' | 'coordinates'>) => {
        try {
            // Default coordinates for a new geofence (can be adjusted as needed)
            const defaultCoordinates = [
                { lat: -26.09, lng: 28.04 },
                { lat: -26.09, lng: 28.07 },
                { lat: -26.12, lng: 28.07 },
                { lat: -26.12, lng: 28.04 }
            ];

            const geofenceData = {
                ...geofence,
                coordinates: defaultCoordinates
            };

            const newGeofence = await GeofenceService.createGeofence(geofenceData);
            setGeofences(prev => [...prev, newGeofence]);
        } catch (error) {
            console.error('Error adding geofence:', error);
            setError('Failed to add geofence. Please try again.');
        }
    };

    const handleUpdateGeofence = async (updatedGeofence: Geofence) => {
        try {
            const result = await GeofenceService.updateGeofence(updatedGeofence.id, updatedGeofence);
            setGeofences(prev => prev.map(g => g.id === updatedGeofence.id ? result : g));
        } catch (error) {
            console.error('Error updating geofence:', error);
            setError('Failed to update geofence. Please try again.');
        }
    };

    const handleDeleteGeofence = async (id: string) => {
        if (window.confirm('Are you sure? This will unassign any hubs.')) {
            try {
                await GeofenceService.deleteGeofence(id);
                setGeofences(prev => prev.filter(g => g.id !== id));
            } catch (error) {
                console.error('Error deleting geofence:', error);
                setError('Failed to delete geofence. Please try again.');
            }
        }
    };

    const handleAddExclusionZone = async (zone: Omit<ExclusionZone, 'id' | 'coordinates'>) => {
        try {
            // Default coordinates for a new exclusion zone (can be adjusted as needed)
            const defaultCoordinates = [
                { lat: -26.13, lng: 28.06 },
                { lat: -26.14, lng: 28.06 },
                { lat: -26.14, lng: 28.061 },
                { lat: -26.13, lng: 28.061 }
            ];

            const zoneData = {
                ...zone,
                coordinates: defaultCoordinates
            };

            const newZone = await ExclusionZoneService.createExclusionZone(zoneData);
            setExclusionZones(prev => [...prev, newZone]);
        } catch (error) {
            console.error('Error adding exclusion zone:', error);
            setError('Failed to add exclusion zone. Please try again.');
        }
    };

    const handleUpdateExclusionZone = async (updatedZone: ExclusionZone) => {
        try {
            const result = await ExclusionZoneService.updateExclusionZone(updatedZone.id, updatedZone);
            setExclusionZones(prev => prev.map(z => z.id === updatedZone.id ? result : z));
        } catch (error) {
            console.error('Error updating exclusion zone:', error);
            setError('Failed to update exclusion zone. Please try again.');
        }
    };

    const handleDeleteExclusionZone = async (id: string) => {
        if (window.confirm('Are you sure?')) {
            try {
                await ExclusionZoneService.deleteExclusionZone(id);
                setExclusionZones(prev => prev.filter(z => z.id !== id));
            } catch (error) {
                console.error('Error deleting exclusion zone:', error);
                setError('Failed to delete exclusion zone. Please try again.');
            }
        }
    };

    const handleAddChallenge = async (challenge: Omit<Challenge, 'id'>) => {
        try {
            const newChallenge = await ChallengeService.createChallenge(challenge);
            setChallenges(prev => [...prev, newChallenge]);
        } catch (error) {
            console.error('Error adding challenge:', error);
            setError('Failed to add challenge. Please try again.');
        }
    };

    const handleUpdateChallenge = async (updatedChallenge: Challenge) => {
        try {
            const result = await ChallengeService.updateChallenge(updatedChallenge.id, updatedChallenge);
            setChallenges(prev => prev.map(c => c.id === updatedChallenge.id ? result : c));
        } catch (error) {
            console.error('Error updating challenge:', error);
            setError('Failed to update challenge. Please try again.');
        }
    };

    const handleDeleteChallenge = async (id: string) => {
        if (window.confirm('Are you sure?')) {
            try {
                await ChallengeService.deleteChallenge(id);
                setChallenges(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                console.error('Error deleting challenge:', error);
                setError('Failed to delete challenge. Please try again.');
            }
        }
    };

    const handleUpdateTeamDrivers = async (teamId: string, driverIds: string[]) => {
        try {
            // Call the API to update team drivers
            await TeamService.updateTeamDrivers(teamId, driverIds);

            // Update local state to reflect changes
            setDrivers(prev => prev.map(d => {
                if (driverIds.includes(d.id)) return { ...d, teamId: teamId };
                if (d.teamId === teamId) return { ...d, teamId: '' }; // Or some default
                return d;
            }));
        } catch (error) {
            console.error('Error updating team drivers:', error);
            setError('Failed to update team drivers. Please try again.');
        }
    }

    const handleUpdateHubStores = async (hubId: string, storeIds: string[]) => {
        try {
            // Call the API to update hub stores
            await HubService.updateHubStores(hubId, storeIds);

            // Update local state to reflect changes
            setStores(prev => prev.map(s => {
                if (storeIds.includes(s.id)) return { ...s, hubId: hubId };
                if (s.hubId === hubId) return { ...s, hubId: '' };
                return s;
            }));
        } catch (error) {
            console.error('Error updating hub stores:', error);
            setError('Failed to update hub stores. Please try again.');
        }
    }

    const handleUpdateGeofenceHubs = async (geofenceId: string, hubIds: string[]) => {
        try {
            // Call the API to update geofence hubs
            await GeofenceService.updateGeofenceHubs(geofenceId, hubIds);

            // Update local state to reflect changes
            setHubs(prev => prev.map(h => {
                if (hubIds.includes(h.id)) return { ...h, geofenceId: geofenceId };
                if (h.geofenceId === geofenceId) return { ...h, geofenceId: '' };
                return h;
            }));
        } catch (error) {
            console.error('Error updating geofence hubs:', error);
            setError('Failed to update geofence hubs. Please try again.');
        }
    }

    const handleSetWebhooks = async (newWebhooks: Webhook[] | ((prev: Webhook[]) => Webhook[])) => {
        try {
            if (typeof newWebhooks === 'function') {
                // Get current webhooks to apply the function
                const currentWebhooks = [...webhooks];
                const updatedWebhooks = newWebhooks(currentWebhooks);

                // Update webhooks in the database
                await Promise.all(updatedWebhooks.map(webhook =>
                    webhook.id
                        ? WebhookService.updateWebhook(webhook.id, webhook)
                        : WebhookService.createWebhook(webhook)
                ));

                // Update local state
                setWebhooks(updatedWebhooks);
            } else {
                // Update webhooks in the database
                await Promise.all(newWebhooks.map(webhook =>
                    webhook.id
                        ? WebhookService.updateWebhook(webhook.id, webhook)
                        : WebhookService.createWebhook(webhook)
                ));

                // Update local state
                setWebhooks(newWebhooks);
            }
        } catch (error) {
            console.error('Error updating webhooks:', error);
            setError('Failed to update webhooks. Please try again.');
        }
    }

    const selectAndGoTo = (view: ViewType, id: string) => {
        setDetailViewId(id);
        setCurrentView(view);
    };

    // --- VIEW RENDERING LOGIC ---
    const renderView = () => {
        // Handle loading state
        if (loading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-lg">Loading data...</p>
                    </div>
                </div>
            );
        }

        // Handle error state
        if (error) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-red-100 p-6 rounded-lg max-w-md">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold mb-2">Error</h2>
                        <p className="mb-4">{error}</p>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        // Make sure we have a current user
        if (!currentUser && users.length > 0) {
            setCurrentUser(users[0]);
            return null;
        }

        // Driver dashboard view
        const driverForDashboard = currentUser ? drivers.find(d => d.id === currentUser.id) : null;
        if (currentUser?.role === UserRole.DRIVER && driverForDashboard) {
            return <DriverDashboard
                driver={driverForDashboard}
                orders={orders.filter(o => o.driverId === driverForDashboard.id)}
                onUpdateStatus={handleUpdateOrderStatus}
                onSwitchUser={setCurrentUser}
                allUsers={users}
            />;
        }

        switch (currentView) {
            case 'dashboard': return <Dashboard orders={orders} drivers={drivers} stores={stores} alerts={alerts} exclusionZones={exclusionZones} onSelectOrder={handleSelectOrder} />;
            case 'orders': return <OrdersView orders={orders} drivers={drivers} stores={stores} exclusionZones={exclusionZones} onSelectOrder={handleSelectOrder} />;
            case 'drivers': return <DriversView drivers={drivers} teams={teams} vehicles={vehicles} onSelectDriver={(id) => selectAndGoTo('driver_detail', id)} onAddDriver={() => setAddDriverModalOpen(true)} onEditDriver={setEditingDriver} />;
            case 'stores': return <StoresView stores={stores} hubs={hubs} onSelectStore={(id) => selectAndGoTo('store_detail', id)} onUpdateStatus={handleUpdateStoreStatus} onAddStore={() => setAddStoreModalOpen(true)} onEditStore={setEditingStore} />;
            case 'teams': return <TeamsView teams={teams} hubs={hubs} users={users} drivers={drivers} onSelectTeam={(id) => selectAndGoTo('team_detail', id)} onAddTeam={() => setAddTeamModalOpen(true)} onEditTeam={setEditingTeam} />;
            case 'hubs': return <HubsView hubs={hubs} geofences={geofences} onSelectHub={(id) => selectAndGoTo('hub_detail', id)} onAddHub={() => setAddHubModalOpen(true)} onEditHub={setEditingHub} />;
            case 'geofences': return <GeofencesView geofences={geofences} hubs={hubs} onAddGeofence={() => setAddGeofenceModalOpen(true)} onEditGeofence={setEditingGeofence} onDeleteGeofence={handleDeleteGeofence} onManageHubs={setManagingGeofenceHubs} />;
            case 'exclusion_zones': return <ExclusionZonesView zones={exclusionZones} onAddZone={() => setAddExclusionZoneModalOpen(true)} onEditZone={setEditingExclusionZone} onDeleteZone={handleDeleteExclusionZone} />;
            case 'analytics': return <Analytics orders={orders} drivers={drivers} stores={stores} hubs={hubs} teams={teams} onSelectHub={(id) => selectAndGoTo('analytics_hub_detail', id)} onSelectTeam={(id) => selectAndGoTo('analytics_team_detail', id)} onSelectDriver={(id) => selectAndGoTo('analytics_driver_detail', id)} onSelectStore={(id) => selectAndGoTo('analytics_store_detail', id)} />;
            case 'challenges': return <ChallengesView challenges={challenges} drivers={drivers} onAddChallenge={() => setAddChallengeModalOpen(true)} onEditChallenge={setEditingChallenge} onDeleteChallenge={handleDeleteChallenge} />;
            case 'live_chat': return <LiveChat drivers={drivers} />;
            case 'settings': return <SettingsView users={users} currentUser={currentUser} setCurrentUser={setCurrentUser} webhooks={webhooks} setWebhooks={handleSetWebhooks} />;
            case 'api_docs': return <APIDocs />;
            case 'api_tester': return <APITester />;
            case 'integrations': return <Integrations />;
            case 'financials': return <FinancialsView invoices={invoices} />;

            // Detail Views
            case 'driver_detail': {
                const driver = drivers.find(d => d.id === detailViewId);
                const vehicle = vehicles.find(v => v.id === driver?.vehicleId);
                const team = teams.find(t => t.id === driver?.teamId);
                if (!driver || !vehicle) return <p>Driver not found</p>;
                return <DriverDetailView driver={driver} orders={orders.filter(o => o.driverId === driver.id)} vehicle={vehicle} team={team} onBack={() => handleSetView('drivers')} onEditDriver={setEditingDriver} onSelectTeam={(id) => selectAndGoTo('team_detail', id)} allChallenges={challenges} driverChallenges={driverChallenges.filter(dc => dc.driverId === driver.id)} />;
            }
            case 'store_detail': {
                const store = stores.find(s => s.id === detailViewId);
                const hub = hubs.find(h => h.id === store?.hubId);
                if (!store || !hub) return <p>Store not found</p>;
                return <StoreDetailView store={store} orders={orders.filter(o => o.storeId === store.id)} drivers={drivers} hub={hub} onBack={() => handleSetView('stores')} onEditStore={setEditingStore} onUpdateStatus={handleUpdateStoreStatus} onSelectHub={(id) => selectAndGoTo('hub_detail', id)} />;
            }
            case 'team_detail': {
                const team = teams.find(t => t.id === detailViewId);
                const hub = hubs.find(h => h.id === team?.hubId);
                const teamLead = users.find(u => u.id === team?.teamLeadId);
                const teamDrivers = drivers.filter(d => d.teamId === team?.id);
                const teamDriverIds = teamDrivers.map(d => d.id);
                const teamOrders = orders.filter(o => o.driverId && teamDriverIds.includes(o.driverId));
                if (!team) return <p>Team not found</p>;
                return <TeamDetailView team={team} drivers={teamDrivers} orders={teamOrders} hub={hub} teamLead={teamLead} onBack={() => handleSetView('teams')} onSelectHub={(id) => selectAndGoTo('hub_detail', id)} onManageDrivers={() => setManagingTeamDrivers(team)} onEditTeam={setEditingTeam} />;
            }
            case 'hub_detail': {
                const hub = hubs.find(h => h.id === detailViewId);
                if (!hub) return <p>Hub not found</p>;
                return <HubDetailView hub={hub} stores={stores.filter(s => s.hubId === hub.id)} teams={teams.filter(t => t.hubId === hub.id)} onBack={() => handleSetView('hubs')} onSelectStore={(id) => selectAndGoTo('store_detail', id)} onSelectTeam={(id) => selectAndGoTo('team_detail', id)} onManageStores={() => setManagingHubStores(hub)} onEditHub={setEditingHub} />;
            }

            // Analytics Detail Views
            case 'analytics_hub_detail': {
                const hub = hubs.find(h => h.id === detailViewId);
                if (!hub) return <p>Hub not found</p>;
                return <HubAnalyticsDetailView hub={hub} allOrders={orders} allStores={stores} allTeams={teams} onBack={() => handleSetView('analytics')} />;
            }
            case 'analytics_team_detail': {
                const team = teams.find(t => t.id === detailViewId);
                if (!team) return <p>Team not found</p>;
                return <TeamAnalyticsDetailView team={team} allOrders={orders} allDrivers={drivers} onBack={() => handleSetView('analytics')} />;
            }
            case 'analytics_driver_detail': {
                const driver = drivers.find(d => d.id === detailViewId);
                if (!driver) return <p>Driver not found</p>;
                return <DriverAnalyticsDetailView driver={driver} allOrders={orders} onBack={() => handleSetView('analytics')} />;
            }
            case 'analytics_store_detail': {
                const store = stores.find(s => s.id === detailViewId);
                if (!store) return <p>Store not found</p>;
                return <StoreAnalyticsDetailView store={store} allOrders={orders} onBack={() => handleSetView('analytics')} />;
            }

            default: return <Dashboard orders={orders} drivers={drivers} stores={stores} alerts={alerts} exclusionZones={exclusionZones} onSelectOrder={handleSelectOrder} />;
        }
    };

    // If currentUser is null, show a loading state
    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-text-primary">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg">Loading application...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-text-primary">
            {currentUser.role !== UserRole.DRIVER && (
                <Sidebar
                    currentView={currentView}
                    setCurrentView={handleSetView}
                    currentUser={currentUser}
                    allUsers={users}
                    setCurrentUser={setCurrentUser}
                />
            )}
            <div className="flex-1 flex flex-col overflow-hidden">
                {currentUser.role !== UserRole.DRIVER && (
                    <Header
                        onAddOrderClick={() => setOrderModalOpen(true)}
                        setCurrentView={handleSetView}
                        alerts={alerts}
                        user={currentUser}
                    />
                )}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {renderView()}
                </main>
            </div>

            {/* Modals & Drawers */}
            <OrderDetailsDrawer isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} driver={selectedDriver} store={selectedStore} drivers={drivers} onUpdateStatus={handleUpdateOrderStatus} onAssignDriver={handleAssignDriver} />
            <OrderModal isOpen={isOrderModalOpen} onClose={() => setOrderModalOpen(false)} onAddOrder={handleAddOrder} drivers={drivers} stores={stores} teams={teams} />
            <AddDriverModal isOpen={isAddDriverModalOpen} onClose={() => setAddDriverModalOpen(false)} onAddDriver={handleAddDriver} vehicles={vehicles} teams={teams} />
            <EditDriverModal isOpen={!!editingDriver} onClose={() => setEditingDriver(null)} onUpdateDriver={handleUpdateDriver} driver={editingDriver} vehicles={vehicles} teams={teams} />
            <AddStoreModal isOpen={isAddStoreModalOpen} onClose={() => setAddStoreModalOpen(false)} onAddStore={handleAddStore} hubs={hubs} />
            <EditStoreModal isOpen={!!editingStore} onClose={() => setEditingStore(null)} onUpdateStore={handleUpdateStore} store={editingStore} hubs={hubs} />
            <AddTeamModal isOpen={isAddTeamModalOpen} onClose={() => setAddTeamModalOpen(false)} onAddTeam={handleAddTeam} hubs={hubs} users={users} />
            <EditTeamModal isOpen={!!editingTeam} onClose={() => setEditingTeam(null)} onUpdateTeam={handleUpdateTeam} team={editingTeam} hubs={hubs} users={users} />
            <AddHubModal isOpen={isAddHubModalOpen} onClose={() => setAddHubModalOpen(false)} onAddHub={handleAddHub} geofences={geofences} />
            <EditHubModal isOpen={!!editingHub} onClose={() => setEditingHub(null)} onUpdateHub={handleUpdateHub} hub={editingHub} geofences={geofences} />
            <AddGeofenceModal isOpen={isAddGeofenceModalOpen} onClose={() => setAddGeofenceModalOpen(false)} onAddGeofence={handleAddGeofence} />
            <EditGeofenceModal isOpen={!!editingGeofence} onClose={() => setEditingGeofence(null)} onUpdateGeofence={handleUpdateGeofence} geofence={editingGeofence} />
            <AddExclusionZoneModal isOpen={isAddExclusionZoneModalOpen} onClose={() => setAddExclusionZoneModalOpen(false)} onAddZone={handleAddExclusionZone} />
            <EditExclusionZoneModal isOpen={!!editingExclusionZone} onClose={() => setEditingExclusionZone(null)} onUpdateZone={handleUpdateExclusionZone} zone={editingExclusionZone} />
            <AddChallengeModal isOpen={isAddChallengeModalOpen} onClose={() => setAddChallengeModalOpen(false)} onAddChallenge={handleAddChallenge} />
            <EditChallengeModal isOpen={!!editingChallenge} onClose={() => setEditingChallenge(null)} onUpdateChallenge={handleUpdateChallenge} challenge={editingChallenge} />
            <ManageTeamDriversModal isOpen={!!managingTeamDrivers} onClose={() => setManagingTeamDrivers(null)} team={managingTeamDrivers} allDrivers={drivers} onUpdateDrivers={handleUpdateTeamDrivers} />
            <ManageHubStoresModal isOpen={!!managingHubStores} onClose={() => setManagingHubStores(null)} hub={managingHubStores} allStores={stores} onUpdateStores={handleUpdateHubStores} />
            <ManageGeofenceHubsModal isOpen={!!managingGeofenceHubs} onClose={() => setManagingGeofenceHubs(null)} geofence={managingGeofenceHubs} allHubs={hubs} onUpdateHubs={handleUpdateGeofenceHubs} />
        </div>
    );
};

export default App;