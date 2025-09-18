import React, { createContext, useContext, useState, useEffect } from 'react';

interface Alert {
  id: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  details: string;
  classification: 'general' | 'robbery' | 'assault' | 'suspicious' | 'other';
  photos?: string[];
  videos?: string[];
}

interface AlertContextType {
  alerts: Alert[];
  loading: boolean;
  reportAlert: (alertData: Omit<Alert, 'id'>) => Promise<void>;
  updateAlert: (alertId: string, updates: Partial<Alert>) => Promise<void>;
  getNearbyAlerts: (location: { latitude: number; longitude: number }, radius: number) => Alert[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate some demo alerts
  useEffect(() => {
    const generateDemoAlerts = () => {
      const demoAlerts: Alert[] = [
        {
          id: 'alert_1',
          userId: 'user_1',
          location: { latitude: 40.7128, longitude: -74.0060 },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          details: 'Intento de robo en la esquina de la calle principal',
          classification: 'robbery',
        },
        {
          id: 'alert_2',
          userId: 'user_2',
          location: { latitude: 40.7589, longitude: -73.9851 },
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          details: 'Actividad sospechosa reportada en el parque',
          classification: 'suspicious',
        },
        {
          id: 'alert_3',
          userId: 'user_3',
          location: { latitude: 40.7282, longitude: -73.7949 },
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          details: 'Robo de vehículo en el estacionamiento',
          classification: 'robbery',
        },
      ];
      
      setAlerts(demoAlerts);
    };

    generateDemoAlerts();
  }, []);

  const reportAlert = async (alertData: Omit<Alert, 'id'>) => {
    setLoading(true);
    try {
      // Simulate Firebase Firestore write
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAlert: Alert = {
        ...alertData,
        id: `alert_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };
      
      setAlerts(prev => [newAlert, ...prev]);
      
      // Simulate sending push notifications to nearby users
      simulatePushNotifications(newAlert);
      
    } catch (error) {
      console.error('Error reporting alert:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAlert = async (alertId: string, updates: Partial<Alert>) => {
    setLoading(true);
    try {
      // Simulate Firebase Firestore update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, ...updates } : alert
        )
      );
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getNearbyAlerts = (
    location: { latitude: number; longitude: number },
    radius: number
  ) => {
    // Simple distance calculation (in real app, use proper geospatial queries)
    return alerts.filter(alert => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        alert.location.latitude,
        alert.location.longitude
      );
      return distance <= radius;
    });
  };

  // Simulate push notification logic
  const simulatePushNotifications = (alert: Alert) => {
    console.log('🔔 Sending push notifications for new alert:', {
      location: alert.location,
      timestamp: alert.timestamp,
      details: alert.details,
    });
    
    // In real implementation, this would:
    // 1. Query Firestore for users within 100m radius
    // 2. Send FCM notifications to those users
    // 3. Handle notification delivery status
  };

  // Calculate distance between two points in meters
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const value = {
    alerts,
    loading,
    reportAlert,
    updateAlert,
    getNearbyAlerts,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}