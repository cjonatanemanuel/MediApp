import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert, Modal, TextInput, Image, Linking } from 'react-native';
import { COLORS, RADIOS } from '../storage/theme';
import { useMedStore } from '../store/useMedStore';
import { agendarToma } from '../storage/dispositivo';
import { formatearCoordenada } from '../utils/validaciones';

/**
 * Componente reutilizable que representa una medicación en la lista.
 * Lee y modifica el estado a través del store global (useMedStore),
 * en lugar de recibir callbacks por props como en el Parcial 1.
 */
export default function MedicationItem({ medicacion, onNotificar }) {
  const opacidad = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [nombreEditado, setNombreEditado] = useState(medicacion.name);

  // Acciones del store
  const eliminar = useMedStore((s) => s.eliminar);
  const actualizar = useMedStore((s) => s.actualizar);
  const toggleTomada = useMedStore((s) => s.toggleTomada);

  const animarEliminar = () => {
    Animated.timing(opacidad, { toValue: 0, duration: 250, useNativeDriver: true })
      .start(() => eliminar(medicacion.id));
  };

  const confirmarEliminar = () => {
    setModalVisible(false);
    setTimeout(() => {
      Alert.alert('Eliminar medicación', `¿Eliminar "${medicacion.name}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: animarEliminar },
      ]);
    }, 300);
  };

  const guardarEdicion = async () => {
    if (!nombreEditado.trim()) {
      Alert.alert('Campo vacío', 'El nombre no puede estar vacío.');
      return;
    }
    await actualizar(medicacion.id, { name: nombreEditado.trim() });
    setEditando(false);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setEditando(false);
    setNombreEditado(medicacion.name);
  };

  const handleAgendar = async () => {
    const ok = await agendarToma(medicacion);
    if (ok) Alert.alert('📅 Agendado', 'Se creó el evento de la toma en tu calendario.');
  };

  const ubic = medicacion.ubicacion;

  return (
    <>
      <Animated.View style={[styles.card, { opacity: opacidad }]}>
        {/* Foto del medicamento (o ícono por defecto) */}
        <View style={styles.iconoContenedor}>
          {medicacion.fotoUri ? (
            <Image source={{ uri: medicacion.fotoUri }} style={styles.fotoMini} />
          ) : (
            <Text style={styles.icono}>💊</Text>
          )}
        </View>
        <TouchableOpacity style={styles.textoContenedor} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <Text style={styles.nombre} numberOfLines={1}>{medicacion.name}</Text>
          <Text style={styles.detalle}>🕐 {medicacion.time}{medicacion.dose ? ` · ${medicacion.dose}` : ''}</Text>
          <Text style={styles.verMas}>Ver detalles →</Text>
        </TouchableOpacity>
        <View style={styles.acciones}>
          {/* Marcar como tomada / pendiente */}
          <TouchableOpacity
            style={[styles.btnAccion, medicacion.tomada && styles.btnTomada]}
            onPress={() => toggleTomada(medicacion.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.btnIcono}>{medicacion.tomada ? '✅' : '⭕'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAccion} onPress={() => onNotificar(medicacion)} activeOpacity={0.7}>
            <Text style={styles.btnIcono}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnAccion, styles.btnRojo]} onPress={confirmarEliminar} activeOpacity={0.7}>
            <Text style={styles.btnIcono}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={cerrarModal}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Detalle de medicación</Text>
              <TouchableOpacity onPress={cerrarModal}>
                <Text style={styles.cerrarBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Foto grande */}
            {medicacion.fotoUri && (
              <Image source={{ uri: medicacion.fotoUri }} style={styles.fotoGrande} />
            )}

            <TouchableOpacity
              style={[styles.badge, medicacion.tomada ? styles.badgeTomada : styles.badgePendiente]}
              onPress={() => toggleTomada(medicacion.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.badgeTexto, medicacion.tomada ? styles.textoTomada : styles.textoPendiente]}>
                {medicacion.tomada ? '✓ Tomada (tocá para desmarcar)' : '⏳ Pendiente (tocá para marcar)'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.campoLabel}>Nombre</Text>
            {editando ? (
              <View>
                <TextInput style={styles.editarInput} value={nombreEditado} onChangeText={setNombreEditado} autoFocus />
                <View style={styles.editarBtns}>
                  <TouchableOpacity style={styles.btnGuardar} onPress={guardarEdicion}>
                    <Text style={styles.btnGuardarTexto}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnCancelar} onPress={() => { setEditando(false); setNombreEditado(medicacion.name); }}>
                    <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.campoEditable} onPress={() => setEditando(true)}>
                <Text style={styles.campoValor}>{medicacion.name}</Text>
                <Text style={{ fontSize: 16 }}>✏️</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.campoLabel}>Hora</Text>
            <Text style={styles.campoValor}>{medicacion.time}</Text>

            {medicacion.dose ? (<><Text style={styles.campoLabel}>Dosis</Text><Text style={styles.campoValor}>{medicacion.dose}</Text></>) : null}
            {medicacion.notes ? (<><Text style={styles.campoLabel}>Notas</Text><Text style={styles.campoValor}>{medicacion.notes}</Text></>) : null}

            {/* Ubicación de la farmacia */}
            {ubic ? (
              <>
                <Text style={styles.campoLabel}>📍 Farmacia</Text>
                <Text style={styles.campoValor}>
                  {ubic.direccion ? ubic.direccion + '\n' : ''}
                  {formatearCoordenada(ubic.latitude)}, {formatearCoordenada(ubic.longitude)}
                </Text>
              </>
            ) : null}

            {/* Contacto médico / familiar */}
            {medicacion.contacto ? (
              <>
                <Text style={styles.campoLabel}>👨‍⚕️ Médico / familiar</Text>
                <TouchableOpacity
                  onPress={() => medicacion.contacto.telefono && Linking.openURL(`tel:${medicacion.contacto.telefono}`)}
                >
                  <Text style={styles.campoValor}>
                    {medicacion.contacto.nombre}
                    {medicacion.contacto.telefono ? `  ·  ${medicacion.contacto.telefono}` : ''}
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            {/* Agendar en calendario */}
            <TouchableOpacity style={styles.btnCalendario} onPress={handleAgendar}>
              <Text style={styles.btnCalendarioTexto}>📅 Agendar toma en el calendario</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnEliminarModal} onPress={confirmarEliminar}>
              <Text style={styles.btnEliminarTexto}>🗑️ Eliminar medicación</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.fondoCard, borderRadius: RADIOS.medio, padding: 12, marginBottom: 10, borderWidth: 0.5, borderColor: COLORS.borde },
  iconoContenedor: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.verdeClaro, alignItems: 'center', justifyContent: 'center', marginRight: 10, overflow: 'hidden' },
  icono: { fontSize: 20 },
  fotoMini: { width: 40, height: 40 },
  textoContenedor: { flex: 1 },
  nombre: { fontSize: 15, fontWeight: '600', color: COLORS.textoPrincipal },
  detalle: { fontSize: 12, color: COLORS.textoSecundario, marginTop: 2 },
  verMas: { fontSize: 11, color: COLORS.primario, marginTop: 3 },
  acciones: { flexDirection: 'row', gap: 6 },
  btnAccion: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.verdeClaro, alignItems: 'center', justifyContent: 'center' },
  btnTomada: { backgroundColor: '#D4EDDA' },
  btnRojo: { backgroundColor: '#FFF0F0' },
  btnIcono: { fontSize: 16 },
  modalFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContenido: { backgroundColor: COLORS.blanco, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitulo: { fontSize: 18, fontWeight: '600', color: COLORS.textoPrincipal },
  cerrarBtn: { fontSize: 18, color: COLORS.textoSecundario, padding: 4 },
  fotoGrande: { width: '100%', height: 180, borderRadius: RADIOS.medio, marginBottom: 16, resizeMode: 'cover' },
  badge: { alignSelf: 'flex-start', borderRadius: RADIOS.redondo, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 16 },
  badgeTomada: { backgroundColor: '#D4EDDA' },
  badgePendiente: { backgroundColor: '#FFF3CD' },
  badgeTexto: { fontSize: 13, fontWeight: '500' },
  textoTomada: { color: '#155724' },
  textoPendiente: { color: '#856404' },
  campoLabel: { fontSize: 12, color: COLORS.textoSecundario, fontWeight: '500', marginBottom: 4, marginTop: 12 },
  campoValor: { fontSize: 15, color: COLORS.textoPrincipal},
  campoEditable: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.fondo, borderRadius: RADIOS.chico, padding: 10 },
  editarInput: { borderWidth: 1, borderColor: COLORS.primario, borderRadius: RADIOS.chico, padding: 10, fontSize: 15, color: COLORS.textoPrincipal },
  editarBtns: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btnGuardar: { flex: 1, backgroundColor: COLORS.primario, borderRadius: RADIOS.chico, padding: 10, alignItems: 'center' },
  btnGuardarTexto: { color: COLORS.blanco, fontWeight: '500' },
  btnCancelar: { flex: 1, borderWidth: 1, borderColor: COLORS.borde, borderRadius: RADIOS.chico, padding: 10, alignItems: 'center' },
  btnCancelarTexto: { color: COLORS.textoSecundario },
  btnCalendario: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, borderWidth: 1, borderColor: COLORS.primario, borderRadius: RADIOS.medio, padding: 14, backgroundColor: COLORS.verdeClaro },
  btnCalendarioTexto: { color: COLORS.primarioOscuro, fontWeight: '600', fontSize: 15 },
  btnEliminarModal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, borderWidth: 1, borderColor: '#F5C6CB', borderRadius: RADIOS.medio, padding: 14, backgroundColor: '#FFF5F5' },
  btnEliminarTexto: { color: COLORS.rojo, fontWeight: '500', fontSize: 15 },
});
