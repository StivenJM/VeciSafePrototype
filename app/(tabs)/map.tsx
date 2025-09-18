import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, Filter, Clock, Shield } from 'lucide-react-native';
import { useAlerts } from '@/contexts/AlertContext';

export default function MapScreen() {
  const { alerts } = useAlerts();
  const [selectedFilter, setSelectedFilter] = useState<'24h' | '1week' | 'all'>('24h');
  const [filteredAlerts, setFilteredAlerts] = useState(alerts);

  useEffect(() => {
    filterAlerts();
  }, [alerts, selectedFilter]);

  const filterAlerts = () => {
    const now = new Date();
    let filtered = alerts;

    switch (selectedFilter) {
      case '24h':
        filtered = alerts.filter(alert => {
          const alertTime = new Date(alert.timestamp);
          const diffHours = (now.getTime() - alertTime.getTime()) / (1000 * 60 * 60);
          return diffHours <= 24;
        });
        break;
      case '1week':
        filtered = alerts.filter(alert => {
          const alertTime = new Date(alert.timestamp);
          const diffDays = (now.getTime() - alertTime.getTime()) / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        });
        break;
      default:
        filtered = alerts;
    }

    setFilteredAlerts(filtered);
  };

  const getAlertDistance = (alert: any) => {
    // Simulate distance calculation - in real app, use user's location
    return Math.floor(Math.random() * 500) + 50;
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ago`;
    }
    return `${minutes}m ago`;
  };

  const FilterButton = ({ filter, label }: { filter: typeof selectedFilter; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mapa de Alertas</Text>
        <Text style={styles.subtitle}>Visualiza incidentes en tu área</Text>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterContainer}>
          <Filter size={20} color="#6B7280" />
          <Text style={styles.filterLabel}>Filtrar por tiempo:</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <FilterButton filter="24h" label="24 horas" />
          <FilterButton filter="1week" label="1 semana" />
          <FilterButton filter="all" label="Todos" />
        </ScrollView>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <MapPin size={48} color="#9CA3AF" />
        <Text style={styles.mapPlaceholderText}>Mapa Interactivo</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          En la versión final, aquí se mostrará un mapa con marcadores de alertas
        </Text>
        <View style={styles.mapStats}>
          <Text style={styles.mapStatsText}>
            {filteredAlerts.length} alertas mostradas
          </Text>
        </View>
      </View>

      {/* Alert List */}
      <ScrollView style={styles.alertsList}>
        <View style={styles.alertsHeader}>
          <Shield size={20} color="#EF4444" />
          <Text style={styles.alertsTitle}>Alertas en el Área</Text>
        </View>

        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, index) => (
            <View key={index} style={styles.alertItem}>
              <View style={styles.alertItemHeader}>
                <View style={styles.alertItemIcon}>
                  <Shield size={16} color="#EF4444" />
                </View>
                <View style={styles.alertItemInfo}>
                  <Text style={styles.alertItemType}>Alerta de Seguridad</Text>
                  <Text style={styles.alertItemTime}>
                    <Clock size={12} color="#6B7280" />
                    {' '}{getTimeAgo(alert.timestamp)}
                  </Text>
                </View>
                <View style={styles.alertItemDistance}>
                  <Text style={styles.distanceText}>{getAlertDistance(alert)}m</Text>
                </View>
              </View>
              <Text style={styles.alertItemLocation}>
                <MapPin size={12} color="#6B7280" />
                {' '}{alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
              </Text>
              {alert.details && (
                <Text style={styles.alertItemDetails}>{alert.details}</Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.noAlertsContainer}>
            <Shield size={32} color="#9CA3AF" />
            <Text style={styles.noAlertsText}>No hay alertas en este período</Text>
            <Text style={styles.noAlertsSubtext}>Cambia el filtro de tiempo para ver más reportes</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  mapPlaceholder: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  mapStats: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  mapStatsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  alertsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 8,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  alertItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertItemIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertItemInfo: {
    flex: 1,
  },
  alertItemType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  alertItemTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertItemDistance: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  alertItemLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  alertItemDetails: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  noAlertsContainer: {
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
    textAlign: 'center',
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
});