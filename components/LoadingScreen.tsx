import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Shield } from 'lucide-react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Shield size={48} color="#3B82F6" />
      </View>
      <Text style={styles.title}>VeciSafe</Text>
      <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
      <Text style={styles.subtitle}>Cargando tu comunidad segura...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#EBF4FF',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 32,
  },
  loader: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});