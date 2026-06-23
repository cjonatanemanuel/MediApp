import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useMedStore } from '../store/useMedStore';
import { calcularAdherencia } from '../utils/validaciones';
import { COLORS, RADIOS } from '../storage/theme';

export default function ProgresoScreen() {
  // Lee del store global; ahora que "tomada" se puede cambiar, este % se actualiza de verdad.
  const medicaciones = useMedStore((s) => s.medicaciones);

  const tomadas = medicaciones.filter((m) => m.tomada).length;
  const pendientes = medicaciones.filter((m) => !m.tomada).length;
  const porcentaje = calcularAdherencia(medicaciones);

  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Progreso</Text>
        <Text style={styles.subtitulo}>Tu historial de hoy</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statNum}>{tomadas}</Text><Text style={styles.statLabel}>Tomadas</Text></View>
        <View style={styles.statBox}><Text style={[styles.statNum, { color: COLORS.amarillo }]}>{pendientes}</Text><Text style={styles.statLabel}>Pendientes</Text></View>
        <View style={[styles.statBox, styles.statBoxDestacado]}><Text style={[styles.statNum, { color: COLORS.blanco }]}>{porcentaje}%</Text><Text style={[styles.statLabel, { color: COLORS.primarioClarito }]}>Adherencia</Text></View>
      </View>
      <View style={styles.listaContenedor}>
        <Text style={styles.seccionLabel}>Detalle</Text>
        {medicaciones.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>📊</Text>
            <Text style={styles.vacioTexto}>Sin datos todavía</Text>
            <Text style={styles.vacioSub}>Agregá medicaciones para ver tu progreso</Text>
          </View>
        ) : (
          <FlatList
            data={medicaciones}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemProgreso}>
                <View style={[styles.itemIcono, item.tomada ? styles.iconoTomada : styles.iconoPendiente]}>
                  <Text style={styles.itemEmoji}>{item.tomada ? '✓' : '⏳'}</Text>
                </View>
                <View style={styles.itemTexto}>
                  <Text style={styles.itemNombre}>{item.name}</Text>
                  <Text style={styles.itemDetalle}>{item.tomada ? `Tomada · ${item.time}` : `Pendiente · ${item.time}`}</Text>
                </View>
                <View style={[styles.itemBadge, item.tomada ? styles.badgeTomada : styles.badgePendiente]}>
                  <Text style={[styles.itemBadgeTexto, item.tomada ? styles.textoTomada : styles.textoPendiente]}>
                    {item.tomada ? 'Tomada' : 'Pendiente'}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: COLORS.fondo },
  header: { backgroundColor: COLORS.primario, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  titulo: { fontSize: 22, fontWeight: '700', color: COLORS.blanco },
  subtitulo: { fontSize: 13, color: COLORS.primarioClarito, marginTop: 2 },
  statsRow: { flexDirection: 'row', margin: 16, gap: 10 },
  statBox: { flex: 1, backgroundColor: COLORS.verdeClaro, borderRadius: RADIOS.medio, padding: 12, alignItems: 'center' },
  statBoxDestacado: { backgroundColor: COLORS.primario },
  statNum: { fontSize: 22, fontWeight: '700', color: COLORS.primario },
  statLabel: { fontSize: 11, color: COLORS.textoSecundario, marginTop: 2 },
  listaContenedor: { flex: 1, paddingHorizontal: 16 },
  seccionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textoSecundario, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  vacio: { alignItems: 'center', marginTop: 50 },
  vacioEmoji: { fontSize: 48, marginBottom: 12 },
  vacioTexto: { fontSize: 18, fontWeight: '600', color: COLORS.textoPrincipal },
  vacioSub: { fontSize: 14, color: COLORS.textoSecundario, marginTop: 6, textAlign: 'center' },
  itemProgreso: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.blanco, borderRadius: RADIOS.medio, padding: 12, marginBottom: 8, borderWidth: 0.5, borderColor: COLORS.borde },
  itemIcono: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  iconoTomada: { backgroundColor: COLORS.verdeClaro },
  iconoPendiente: { backgroundColor: '#FFF8E1' },
  itemEmoji: { fontSize: 14 },
  itemTexto: { flex: 1 },
  itemNombre: { fontSize: 14, fontWeight: '600', color: COLORS.textoPrincipal },
  itemDetalle: { fontSize: 12, color: COLORS.textoSecundario, marginTop: 1 },
  itemBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeTomada: { backgroundColor: '#D4EDDA' },
  badgePendiente: { backgroundColor: '#FFF3CD' },
  itemBadgeTexto: { fontSize: 11, fontWeight: '500' },
  textoTomada: { color: '#155724' },
  textoPendiente: { color: '#856404' },
});
