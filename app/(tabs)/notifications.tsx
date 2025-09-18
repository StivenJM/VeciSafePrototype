import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, Shield, MapPin, Clock, Check, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useAlerts } from '@/contexts/AlertContext';

export default function NotificationsScreen() {
  const { alerts } = useAlerts();
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');

  // Simulate notification data based on alerts
  const notifications = alerts.map((alert, index) => ({
    id: index,
    type: 'security_alert',
    title: 'Alerta de Seguridad Cercana',
    message: `Se reportó un incidente a ${Math.floor(Math.random() * 200) + 50}m de tu ubicación`,
    timestamp: alert.timestamp,
    read: Math.random() > 0.5,
    location: alert.location,
    priority: Math.random() > 0.7 ? 'high' : 'medium',
  }));

  const filteredNotifications = selectedTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const NotificationItem = ({ notification }: { notification: any }) => (
    <TouchableOpacity style={[styles.notificationItem, !notification.read && styles.unreadNotification]}>
      <View style={styles.notificationHeader}>
        <View style={[styles.notificationIcon, notification.priority === 'high' && styles.highPriorityIcon]}>
          {notification.type === 'security_alert' ? (
            <Shield size={20} color={notification.priority === 'high' ? '#FFFFFF' : '#EF4444'} />
          ) : (
            <Bell size={20} color="#3B82F6" />
          )}
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationTitleRow}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            {notification.priority === 'high' && (
              <AlertTriangle size={16} color="#EF4444" />
            )}
          </View>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <View style={styles.notificationMeta}>
            <Text style={styles.notificationTime}>
              <Clock size={12} color="#6B7280" />
              {' '}{getTimeAgo(notification.timestamp)}
            </Text>
            <Text style={styles.notificationLocation}>
              <MapPin size={12} color="#6B7280" />
              {' '}{notification.location.latitude.toFixed(4)}, {notification.location.longitude.toFixed(4)}
            </Text>
          </View>
        </View>
        {!notification.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notificaciones</Text>
        <Text style={styles.subtitle}>Mantente informado de alertas cercanas</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            Todas ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'unread' && styles.activeTab]}
          onPress={() => setSelectedTab('unread')}
        >
          <Text style={[styles.tabText, selectedTab === 'unread' && styles.activeTabText]}>
            No leídas ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Bell size={24} color="#3B82F6" />
          <Text style={styles.statNumber}>{notifications.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <AlertTriangle size={24} color="#EF4444" />
          <Text style={styles.statNumber}>{notifications.filter(n => n.priority === 'high').length}</Text>
          <Text style={styles.statLabel}>Alta Prioridad</Text>
        </View>
        <View style={styles.statItem}>
          <Check size={24} color="#10B981" />
          <Text style={styles.statNumber}>{notifications.filter(n => n.read).length}</Text>
          <Text style={styles.statLabel}>Leídas</Text>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Bell size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>
              {selectedTab === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {selectedTab === 'unread' 
                ? 'Todas tus notificaciones están al día' 
                : 'Las alertas de seguridad aparecerán aquí'}
            </Text>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
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
  notificationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  notificationItem: {
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
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  highPriorityIcon: {
    backgroundColor: '#EF4444',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  notificationLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});