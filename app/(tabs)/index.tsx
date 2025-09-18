import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Shield, MapPin, Clock, Users } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useAlerts } from '@/contexts/AlertContext';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const { user } = useAuth();
  const { alerts, reportAlert, loading } = useAlerts();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita acceso a la ubicación para reportar alertas');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleEmergencyReport = async () => {
    if (!location) {
      Alert.alert('Error', 'No se pudo obtener la ubicación. Intenta nuevamente.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para reportar una alerta');
      return;
    }

    setIsReporting(true);
    
    try {
      await reportAlert({
        userId: user.uid,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        timestamp: new Date(),
        details: 'Reporte de emergencia',
        classification: 'general',
      });

      Alert.alert(
        'Alerta Enviada',
        'Tu reporte ha sido enviado. Se ha notificado a usuarios cercanos.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la alerta. Intenta nuevamente.');
    } finally {
      setIsReporting(false);
    }
  };

  const recentAlerts = alerts.slice(0, 3);
  const todayAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.timestamp);
    const today = new Date();
    return alertDate.toDateString() === today.toDateString();
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>VeciSafe</Text>
        <Text style={styles.subtitle}>Mantente seguro en tu comunidad</Text>
      </View>

      {/* Emergency Button */}
      <View style={styles.emergencySection}>
        <TouchableOpacity
          style={[styles.emergencyButton, isReporting && styles.emergencyButtonDisabled]}
          onPress={handleEmergencyReport}
          disabled={isReporting || !location}
        >
          <Shield size={48} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.emergencyButtonText}>
            {isReporting ? 'ENVIANDO...' : 'ALERTA DE ROBO'}
          </Text>
          <Text style={styles.emergencySubtext}>
            Toca para reportar un incidente
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={24} color="#3B82F6" />
          <Text style={styles.statNumber}>{alerts.length}</Text>
          <Text style={styles.statLabel}>Reportes Totales</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={24} color="#10B981" />
          <Text style={styles.statNumber}>{todayAlerts.length}</Text>
          <Text style={styles.statLabel}>Hoy</Text>
        </View>
      </View>

      {/* Recent Alerts */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Alertas Recientes</Text>
        {recentAlerts.length > 0 ? (
          recentAlerts.map((alert, index) => (
            <View key={index} style={styles.alertCard}>
              <View style={styles.alertIcon}>
                <Shield size={20} color="#EF4444" />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertType}>Reporte de Seguridad</Text>
                <Text style={styles.alertLocation}>
                  <MapPin size={14} color="#6B7280" />
                  {' '}Ubicación: {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                </Text>
                <Text style={styles.alertTime}>
                  {new Date(alert.timestamp).toLocaleString('es-ES')}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noAlertsCard}>
            <Shield size={32} color="#9CA3AF" />
            <Text style={styles.noAlertsText}>No hay alertas recientes</Text>
            <Text style={styles.noAlertsSubtext}>Tu comunidad está segura</Text>
          </View>
        )}
      </View>

      {/* Location Status */}
      <View style={styles.locationStatus}>
        <MapPin size={16} color={location ? '#10B981' : '#EF4444'} />
        <Text style={[styles.locationText, { color: location ? '#10B981' : '#EF4444' }]}>
          {location ? 'Ubicación disponible' : 'Obteniendo ubicación...'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emergencySection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  emergencyButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },
  emergencySubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  alertIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  noAlertsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  noAlertsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});