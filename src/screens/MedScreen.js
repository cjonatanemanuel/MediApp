import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useMedStore } from '../store/useMedStore';
import { programarNotificacion } from '../storage/notifications';
import { COLORS, RADIOS } from '../storage/theme';
import MedicationItem from '../components/MedicationItem';

export default function MedScreen({ navigation }) {
  // Lista leída del store global
  const medicaciones = useMedStore((s) => s.medicaciones);

  const handleNotificar = async (medicacion) => {
    await programarNotificacion(medicacion.name, 10);
  };

  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Medicaciones</Text>
        <Text style={styles.subtitulo}>{medicaciones.length} registrada{medicaciones.length !== 1 ? 's' : ''}</Text>
      </View>
      <View style={styles.contenedor}>
        {medicaciones.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>💊</Text>
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
            contentContainerStyle={{ paddingBottom: 80 }}
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
  titulo: { fontSize: 22, fontWeight: '700', color: COLORS.blanco },
  subtitulo: { fontSize: 13, color: COLORS.primarioClarito, marginTop: 2 },
  contenedor: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  vacio: { alignItems: 'center', marginTop: 80 },
  vacioEmoji: { fontSize: 48, marginBottom: 12 },
  vacioTexto: { fontSize: 18, fontWeight: '600', color: COLORS.textoPrincipal },
  vacioSub: { fontSize: 14, color: COLORS.textoSecundario, marginTop: 6 },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: COLORS.primario,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
  },
  fabTexto: { fontSize: 30, color: COLORS.blanco, fontWeight: '300', lineHeight: 34 },
});
