import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, RADIOS } from '../storage/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.contenido}>
        <View style={styles.logoContenedor}>
          <View style={styles.logoCirculo}>
            <Text style={styles.logoTexto}>M</Text>
          </View>
          <Text style={styles.appNombre}>Medi.</Text>
          <Text style={styles.appSlogan}>Tu salud, bajo control</Text>
        </View>
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcono}><Text style={styles.featureEmoji}>🔔</Text></View>
            <View style={styles.featureTexto}>
              <Text style={styles.featureTitulo}>Recordatorios</Text>
              <Text style={styles.featureDesc}>Nunca olvides tus medicamentos</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcono}><Text style={styles.featureEmoji}>❤️</Text></View>
            <View style={styles.featureTexto}>
              <Text style={styles.featureTitulo}>Salud</Text>
              <Text style={styles.featureDesc}>Registrá tu presión y temperatura</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcono}><Text style={styles.featureEmoji}>📊</Text></View>
            <View style={styles.featureTexto}>
              <Text style={styles.featureTitulo}>Progreso</Text>
              <Text style={styles.featureDesc}>Seguí tu historial de medicación</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.botones}>
        <TouchableOpacity style={styles.btnPrimario} onPress={() => navigation.navigate('Register')} activeOpacity={0.85}>
          <Text style={styles.btnPrimarioTexto}>Crear cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecundario} onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
          <Text style={styles.btnSecundarioTexto}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: COLORS.fondo },
  contenido: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  logoContenedor: { alignItems: 'center', marginBottom: 48 },
  logoCirculo: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primario, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoTexto: { fontSize: 36, fontWeight: '700', color: COLORS.blanco },
  appNombre: { fontSize: 38, fontWeight: '700', color: COLORS.textoPrincipal },
  appSlogan: { fontSize: 15, color: COLORS.textoSecundario, marginTop: 4 },
  features: { width: '100%', gap: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcono: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.verdeClaro, alignItems: 'center', justifyContent: 'center' },
  featureEmoji: { fontSize: 22 },
  featureTexto: { flex: 1 },
  featureTitulo: { fontSize: 15, fontWeight: '600', color: COLORS.textoPrincipal },
  featureDesc: { fontSize: 13, color: COLORS.textoSecundario, marginTop: 1 },
  botones: { paddingHorizontal: 28, paddingBottom: 32, gap: 10 },
  btnPrimario: { backgroundColor: COLORS.primario, borderRadius: RADIOS.medio, paddingVertical: 15, alignItems: 'center' },
  btnPrimarioTexto: { color: COLORS.blanco, fontSize: 16, fontWeight: '600' },
  btnSecundario: { borderWidth: 1.5, borderColor: COLORS.primario, borderRadius: RADIOS.medio, paddingVertical: 15, alignItems: 'center' },
  btnSecundarioTexto: { color: COLORS.primario, fontSize: 16, fontWeight: '600' },
});
