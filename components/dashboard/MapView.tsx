import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Driver, Order, ExclusionZone, LatLng, OrderStatus, DriverStatus } from '../../types';
import { ICONS } from '../../constants';

// FIX: Declare google namespace and used types to fix TypeScript errors for missing Google Maps API types.
declare namespace google {
  namespace maps {
    class Map {
      constructor(el: any, opts: any);
    }
    class Marker {
      constructor(opts?: any);
      setMap(map: any): void;
      setOptions(opts: any): void;
    }
    class Polygon {
      constructor(opts?: any);
      setMap(map: any): void;
      setOptions(opts: any): void;
    }
    class Polyline {
      constructor(opts?: any);
      setMap(map: any): void;
      setOptions(opts: any): void;
    }
    const SymbolPath: any;
  }
}

// Map Component
const MyMapComponent: React.FC<{
  center: LatLng;
  zoom: number;
  drivers: Driver[];
  orders: Order[];
  exclusionZones: ExclusionZone[];
}> = ({ center, zoom, drivers, orders, exclusionZones }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      // FIX: Use `google` directly, as it's declared globally for TypeScript. This resolves the error "Property 'google' does not exist on type 'Window & typeof globalThis'".
      setMap(new google.maps.Map(ref.current, {
        center,
        zoom,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#1f2937" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#111827" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#EF4444" }],
          },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#374151" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#4f5b6b" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2937" }],
          },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
        ]
      }));
    }
  }, [ref, map, center, zoom]);

  return (
    <>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
      {map && (
        <>
          {drivers.map(driver => <DriverMarker key={driver.id} map={map} driver={driver} />)}
          {exclusionZones.map(zone => <ExclusionZonePolygon key={zone.id} map={map} zone={zone} />)}
          {orders.filter(o => o.status === OrderStatus.IN_PROGRESS).map(order => <OrderRoute key={order.id} map={map} order={order} />)}
        </>
      )}
    </>
  );
};

// Driver Marker Component
const DriverMarker: React.FC<{ map: google.maps.Map, driver: Driver }> = ({ map, driver }) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    // FIX: Use `google` directly, as it's declared globally for TypeScript. This resolves the error "Property 'google' does not exist on type 'Window & typeof globalThis'".
    if (!marker) setMarker(new google.maps.Marker());
    return () => { if (marker) marker.setMap(null); };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions({
        map,
        position: { lat: driver.latitude || 0, lng: driver.longitude || 0 },
        title: `${driver.name} (${driver.status})`,
        icon: {
          // FIX: Use `google` directly, as it's declared globally for TypeScript. This resolves the error "Property 'google' does not exist on type 'Window & typeof globalThis'".
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: driver.status === DriverStatus.ON_DUTY ? "#EF4444" : "#10B981",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: 'white'
        }
      });
    }
  }, [marker, map, driver]);

  return null;
};

// Exclusion Zone Polygon
const ExclusionZonePolygon: React.FC<{ map: google.maps.Map, zone: ExclusionZone }> = ({ map, zone }) => {
  const [polygon, setPolygon] = useState<google.maps.Polygon>();

  useEffect(() => {
    // FIX: Use `google` directly, as it's declared globally for TypeScript. This resolves the error "Property 'google' does not exist on type 'Window & typeof globalThis'".
    if (!polygon) setPolygon(new google.maps.Polygon());
    return () => { if (polygon) polygon.setMap(null); };
  }, [polygon]);

  useEffect(() => {
    if (polygon) {
      polygon.setOptions({
        map,
        paths: zone.coordinates,
        strokeColor: '#EF4444',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#EF4444',
        fillOpacity: 0.35,
      });
    }
  }, [polygon, map, zone]);

  return null;
}

// Order Route Polyline
const OrderRoute: React.FC<{ map: google.maps.Map, order: Order }> = ({ map, order }) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline>();

  useEffect(() => {
    // FIX: Use `google` directly, as it's declared globally for TypeScript. This resolves the error "Property 'google' does not exist on type 'Window & typeof globalThis'".
    if (!polyline) setPolyline(new google.maps.Polyline());
    return () => { if (polyline) polyline.setMap(null); };
  }, [polyline]);

  useEffect(() => {
    if (polyline) {
      polyline.setOptions({
        map,
        path: [
          { lat: order.origin?.lat || 0, lng: order.origin?.lng || 0 },
          { lat: order.destination?.lat || 0, lng: order.destination?.lng || 0 }
        ],
        geodesic: true,
        strokeColor: '#F59E0B',
        strokeOpacity: 0.8,
        strokeWeight: 4,
      });
    }
  }, [polyline, map, order]);

  return null;
}

const FallbackMap: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f5b6b_1px,transparent_1px),linear-gradient(to_bottom,#4f5b6b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_40%,transparent_100%)] opacity-20"></div>
      </div>

      <div className="bg-surface/80 backdrop-blur-sm border border-danger rounded-lg p-6 text-center shadow-lg max-w-md z-10">
        <div className="mx-auto h-12 w-12 text-danger">{ICONS.alert}</div>
        <h3 className="mt-2 text-xl font-bold text-text-primary">Map Unavailable</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Google Maps could not load. This is usually caused by an invalid API key.
        </p>
        <p className="mt-4 text-xs text-text-secondary">
          Please ensure the <code>API_KEY</code> is correctly configured in your environment.
        </p>
      </div>
    </div>
  );
}

const render = (status: Status) => {
  if (status === Status.LOADING) return <div className="w-full h-full bg-gray-800 flex items-center justify-center"><p className="text-gray-500">Loading Map...</p></div>;
  if (status === Status.FAILURE) return <FallbackMap />;
  return null;
};

const MapView: React.FC<{
  drivers: Driver[];
  orders: Order[];
  exclusionZones: ExclusionZone[];
}> = (props) => {
  const center = { lat: -26.1076, lng: 28.0567 }; // Sandton
  const zoom = 12;

  // FIX: Hardcode the provided API key to ensure the map loads correctly.
  const apiKey = "AIzaSyCri5TmJCL4DNjYKzSpQyHuM4KRXn_BasQ";

  if (!apiKey) {
    return <FallbackMap />;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Wrapper apiKey={apiKey} render={render}>
        <MyMapComponent center={center} zoom={zoom} {...props} />
      </Wrapper>
    </div>
  );
};

export default MapView;