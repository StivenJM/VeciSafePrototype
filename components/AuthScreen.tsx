import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Shield, Phone, MessageSquare } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verification'>('phone');
  const { signInWithPhoneNumber, verifyCode, loading } = useAuth();

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu número de teléfono');
      return;
    }

    try {
      await signInWithPhoneNumber(phoneNumber);
      setStep('verification');
      Alert.alert(
        'Código Enviado',
        `Se ha enviado un código de verificación a ${phoneNumber}. Para la demo, usa el código: 123456`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el código de verificación');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Por favor ingresa el código de verificación');
      return;
    }

    try {
      await verifyCode(verificationCode);
    } catch (error) {
      Alert.alert('Error', 'Código de verificación inválido');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Shield size={48} color="#3B82F6" />
        </View>
        <Text style={styles.title}>VeciSafe</Text>
        <Text style={styles.subtitle}>
          Mantén tu comunidad segura con reportes anónimos y alertas en tiempo real
        </Text>
      </View>

      <View style={styles.formContainer}>
        {step === 'phone' ? (
          <>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="Número de teléfono"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Enviando...' : 'Enviar Código'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Recibirás un código de verificación por SMS para confirmar tu identidad de manera anónima.
            </Text>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <MessageSquare size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="Código de verificación"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verificando...' : 'Verificar Código'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep('phone')}
            >
              <Text style={styles.backButtonText}>Cambiar número</Text>
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Para la demo, usa el código: 123456
            </Text>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tu privacidad es importante. Solo usamos tu número para verificar tu identidad y enviar alertas de seguridad.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});