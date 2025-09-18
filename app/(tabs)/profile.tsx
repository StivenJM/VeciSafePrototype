import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { User, Shield, Bell, MapPin, Phone, LogOut, Settings, CircleHelp as HelpCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={showSwitch}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
          thumbColor={switchValue ? '#FFFFFF' : '#9CA3AF'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Configura tu cuenta y preferencias</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfoSection}>
        <View style={styles.userAvatar}>
          <User size={32} color="#3B82F6" />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>Usuario Anónimo</Text>
          <Text style={styles.userPhone}>
            {user?.phoneNumber ? `${user.phoneNumber}` : 'No verificado'}
          </Text>
          <View style={styles.verificationBadge}>
            <Shield size={14} color="#10B981" />
            <Text style={styles.verificationText}>Cuenta Verificada</Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Shield size={24} color="#EF4444" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Alertas Reportadas</Text>
        </View>
        <View style={styles.statCard}>
          <Bell size={24} color="#3B82F6" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Notificaciones Recibidas</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Configuración</Text>

        <SettingItem
          icon={<Bell size={20} color="#3B82F6" />}
          title="Notificaciones"
          subtitle="Recibir alertas de seguridad cercanas"
          showSwitch={true}
          switchValue={notificationsEnabled}
          onSwitchChange={setNotificationsEnabled}
        />

        <SettingItem
          icon={<MapPin size={20} color="#10B981" />}
          title="Ubicación"
          subtitle="Permitir acceso a la ubicación para reportes"
          showSwitch={true}
          switchValue={locationEnabled}
          onSwitchChange={setLocationEnabled}
        />

        <SettingItem
          icon={<Phone size={20} color="#F59E0B" />}
          title="Verificación de Teléfono"
          subtitle="Confirmar tu número de teléfono"
          onPress={() => {}}
        />
      </View>

      {/* Support Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Soporte</Text>

        <SettingItem
          icon={<HelpCircle size={20} color="#6366F1" />}
          title="Centro de Ayuda"
          subtitle="Preguntas frecuentes y soporte"
          onPress={() => {}}
        />

        <SettingItem
          icon={<Settings size={20} color="#8B5CF6" />}
          title="Configuración Avanzada"
          subtitle="Opciones adicionales de la app"
          onPress={() => {}}
        />
      </View>

      {/* Sign Out */}
      <View style={styles.signOutSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>VeciSafe v1.0.0</Text>
        <Text style={styles.appDescription}>
          Manteniendo tu comunidad segura
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
  userInfoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  userAvatar: {
    width: 64,
    height: 64,
    backgroundColor: '#EBF4FF',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
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
  settingsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  signOutSection: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  signOutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});