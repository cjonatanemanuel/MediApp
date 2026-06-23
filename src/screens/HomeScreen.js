import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useMedStore } from '../store/useMedStore';
import { programarNotificacion } from '../storage/notifications';
import { COLORS, RADIOS } from '../storage/theme';
import MedicationItem from '../components/MedicationItem';

export default function HomeScreen({ navigation }) {
  // Datos leídos del store global (ya no se consulta AsyncStorage acá).
  const usuario = useAuthStore((s) => s.usuario) || 'vos';
  const medicaciones = useMedStore((s) => s.medicaciones);

  const handleNotificar = async (medicacion) => {
    await programarNotificacion(medicacion.name, 10);
  };

  const pendientes = medicaciones.filter((m) => !m.tomada).length;
  const tomadas = medicaciones.filter((m) => m.tomada).length;

  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appNombre}>Medi.</Text>
          <Text style={styles.saludo}>Hola, {usuario} 👋</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statNum}>{medicaciones.length}</Text><Text style={styles.statLabel}>Total</Text></View>
        <View style={styles.statBox}><Text style={[styles.statNum, { color: COLORS.amarillo }]}>{pendientes}</Text><Text style={styles.statLabel}>Pendientes</Text></View>
        <View style={styles.statBox}><Text style={[styles.statNum, { color: COLORS.primario }]}>{tomadas}</Text><Text style={styles.statLabel}>Tomadas</Text></View>
      </View>
      <View style={styles.listaContenedor}>
        <Text style={styles.seccionLabel}>Mis medicaciones</Text>
        {medicaciones.length === 0 ? (
          <View style={styles.vacio}>
          <Text style={styles.vacioTexto}>Sin medicaciones</Text>
          <Text style={styles.vacioSub}>Tocá el botón + para agregar una</Text>
          </View>
        ) : (
          <FlatList
            data={medicaciones}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MedicationItem medicacion={item} onNotificar={handleNotificar} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AgregarMedicacion')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: COLORS.fondo },
  header: { backgroundColor: COLORS.primario, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  appNombre: { fontSize: 22, fontWeight: '700', color: COLORS.blanco },
  saludo: { fontSize: 13, color: COLORS.primarioClarito, marginTop: 2 },
  statsRow: { flexDirection: 'row', margin: 16, gap: 10 },
  statBox: { flex: 1, backgroundColor: COLORS.verdeClaro, borderRadius: RADIOS.medio, padding: 12, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '700', color: COLORS.primario },
  statLabel: { fontSize: 11, color: COLORS.textoSecundario, marginTop: 2 },
  listaContenedor: { flex: 1, paddingHorizontal: 16 },
  seccionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textoSecundario, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  vacio: { alignItems: 'center', marginTop: 50 },
  vacioEmoji: { fontSize: 48, marginBottom: 12 },
  vacioTexto: { fontSize: 18, fontWeight: '600', color: COLORS.textoPrincipal },
  vacioSub: { fontSize: 14, color: COLORS.textoSecundario, marginTop: 6 },
  fab: {
  position: 'absolute', bottom: 20, right: 20,
  width: 58, height: 58, borderRadius: 29,
  backgroundColor: COLORS.primario,
  alignItems: 'center', justifyContent: 'center',
  elevation: 6,},
fabTexto: { fontSize: 30, color: COLORS.blanco, fontWeight: '300', lineHeight: 34 },
});
