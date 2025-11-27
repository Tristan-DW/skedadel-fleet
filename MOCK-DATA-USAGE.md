# Using Mock Data in Skedadel Fleet Management System

This document explains how the frontend is configured to use mock data instead of making API calls to the backend server.

## Current Configuration

The frontend is currently configured to **always use mock data** instead of making API calls to the backend. This is useful for:

- Development without a running backend server
- Demonstration purposes
- Testing UI components with consistent data
- Avoiding backend connection issues

## How Mock Data is Implemented

The mock data implementation consists of two main parts:

1. **Mock Data Source**: All mock data is defined in `mockData.ts`, which exports:
   - `MOCK_DATA`: An object containing arrays of mock entities (users, drivers, orders, etc.)
   - `MOCK_ALERT_POOL`: An array of mock alerts used for generating random alerts

2. **Data Fetching Logic**: The data fetching logic in `App.tsx` has been modified to:
   - Skip API calls and use mock data directly in the `fetchWithFallback` function
   - Generate mock alerts periodically instead of polling the API for new alerts

## Reverting to API Calls

To revert back to using real API calls instead of mock data, make the following changes to `App.tsx`:

1. **Restore the original `fetchWithFallback` function**:

```typescript
// Helper function to fetch data with fallback to mock data
const fetchWithFallback = async (fetchFn: () => Promise<any>, mockData: any) => {
    try {
        return await fetchWithRetry(fetchFn);
    } catch (error) {
        console.warn(`Using mock data fallback due to error: ${error.message}`);
        return mockData;
    }
};
```

2. **Restore the original live alerts polling mechanism**:

```typescript
// Live Alerts Polling
useEffect(() => {
    // Helper function to retry a failed API call
    const fetchWithRetry = async (fetchFn: () => Promise<any>, retries = 2, delay = 500) => {
        try {
            return await fetchFn();
        } catch (error) {
            if (retries <= 0) throw error;
            
            console.log(`Retrying alert fetch... Attempts left: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(fetchFn, retries - 1, delay * 1.5); // Exponential backoff
        }
    };

    // Counter to track consecutive failures
    let consecutiveFailures = 0;
    const MAX_CONSECUTIVE_FAILURES = 5;
    
    const fetchNewAlerts = async () => {
        try {
            // Use retry logic for fetching alerts
            const latestAlerts = await fetchWithRetry(() => AlertService.getAllAlerts());
            
            setAlerts(prevAlerts => {
                // Merge new alerts with existing ones, avoiding duplicates
                const existingIds = new Set(prevAlerts.map(a => a.id));
                const newAlerts = latestAlerts.filter(a => !existingIds.has(a.id));
                
                // Add new alerts to the top and keep the list from growing too large
                return [...newAlerts, ...prevAlerts].slice(0, 10);
            });
            
            // Reset consecutive failures counter on success
            consecutiveFailures = 0;
        } catch (err) {
            console.error('Error fetching alerts:', err);
            
            // Increment consecutive failures counter
            consecutiveFailures++;
            
            // If too many consecutive failures, try to use mock data
            if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
                console.warn(`${MAX_CONSECUTIVE_FAILURES} consecutive alert fetch failures. Attempting to use mock data.`);
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
                        
                        console.log('Using mock alert data as fallback');
                    }
                } catch (mockError) {
                    console.error('Failed to load mock alert data:', mockError);
                }
            }
        }
    };

    const interval = setInterval(fetchNewAlerts, 7000); // Poll for new alerts every 7 seconds

    return () => clearInterval(interval);
}, []);
```

## Hybrid Approach

If you want a hybrid approach where the frontend tries to use the API but falls back to mock data when the API is unavailable, you can use the original implementation which is already designed to do this.

## Testing with Mock Data

### Verifying Mock Data Usage

To verify that the frontend is correctly using mock data instead of making API calls:

1. Start the application with `npm run dev`
2. Open the browser's developer console (F12 or right-click > Inspect > Console)
3. Look for the following console messages:
   - `Using mock data instead of making API calls` - This confirms the initial data load is using mock data
   - `Generated new mock alert` - This confirms the alerts are being generated from mock data
4. Verify that there are no API error messages like `API call failed` or `Error fetching data`
5. The application should load and display data without connecting to a backend server

### Testing Different Scenarios

When using mock data, you can modify the mock data in `mockData.ts` to test different scenarios:

- Add more entities to test pagination
- Modify entity properties to test UI rendering
- Add edge cases to test error handling

## Considerations

- Mock data doesn't reflect real-time changes from other users
- Mock data may not cover all edge cases that might occur in a real environment
- The mock data implementation doesn't simulate network latency or other real-world conditions

## Conclusion

Using mock data is a convenient way to develop and test the frontend without relying on a backend server. However, it's important to test with the real API before deploying to production to ensure that all functionality works correctly with the actual backend implementation.