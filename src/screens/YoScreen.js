import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useMedStore } from '../store/useMedStore';
import { COLORS, RADIOS } from '../storage/theme';

export default function YoScreen({ navigation }) {
  // Usuario y total leídos de los stores globales.
  const usuario = useAuthStore((s) => s.usuario) || 'Usuario';
  const cerrarSesion = useAuthStore((s) => s.cerrarSesion);
  const limpiar = useMedStore((s) => s.limpiar);
  const totalMedicaciones = useMedStore((s) => s.medicaciones.length);

  const handleCerrarSesion = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await cerrarSesion();
          limpiar();
          navigation.getParent()?.replace('Login');
        },
      },
    ]);
  };

  const iniciales = usuario.substring(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Mi perfil</Text>
      </View>
      <View style={styles.scroll}>
        <View style={styles.avatarContenedor}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{iniciales}</Text>
          </View>
          <Text style={styles.nombre}>{usuario}</Text>
          <Text style={styles.rol}>Usuario registrado</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoFila}>
            <Text style={styles.infoEmoji}>💊</Text>
            <Text style={styles.infoTexto}>{totalMedicaciones} medicación{totalMedicaciones !== 1 ? 'es' : ''} registrada{totalMedicaciones !== 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.infoFila}>
            <Text style={styles.infoEmoji}>🔒</Text>
            <Text style={styles.infoTexto}>Datos guardados localmente</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.infoFila}>
            <Text style={styles.infoEmoji}>📱</Text>
            <Text style={styles.infoTexto}>Sin conexión a internet</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.btnCerrar} onPress={handleCerrarSesion} activeOpacity={0.8}>
          <Text style={styles.btnCerrarTexto}>🚪 Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: COLORS.fondo },
  header: { backgroundColor: COLORS.primario, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  titulo: { fontSize: 22, fontWeight: '700', color: COLORS.blanco },
  scroll: { padding: 20 },
  avatarContenedor: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primario, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarTexto: { fontSize: 28, fontWeight: '700', color: COLORS.blanco },
  nombre: { fontSize: 20, fontWeight: '700', color: COLORS.textoPrincipal },
  rol: { fontSize: 14, color: COLORS.textoSecundario, marginTop: 2 },
  infoCard: { backgroundColor: COLORS.blanco, borderRadius: RADIOS.medio, padding: 4, borderWidth: 0.5, borderColor: COLORS.borde, marginBottom: 20 },
  infoFila: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  infoEmoji: { fontSize: 20 },
  infoTexto: { fontSize: 15, color: COLORS.textoPrincipal },
  separador: { height: 0.5, backgroundColor: COLORS.borde, marginHorizontal: 14 },
  btnCerrar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#F5C6CB', borderRadius: RADIOS.medio, padding: 15 },
  btnCerrarTexto: { color: COLORS.rojo, fontWeight: '600', fontSize: 15 },
});
