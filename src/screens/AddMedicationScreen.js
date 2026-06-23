import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useMedStore } from '../store/useMedStore';
import { programarNotificacion } from '../storage/notifications';
import { esHoraValida, formatearCoordenada } from '../utils/validaciones';
import { tomarFoto, elegirDeGaleria, obtenerUbicacion, elegirContacto, agendarToma } from '../storage/dispositivo';
import { COLORS, RADIOS } from '../storage/theme';
import CustomButton from '../components/CustomButton';

export default function AddMedicationScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [dosis, setDosis] = useState('');
  const [hora, setHora] = useState('');
  const [notas, setNotas] = useState('');
  const [cargando, setCargando] = useState(false);

  // Recursos del dispositivo asociados a la medicación
  const [fotoUri, setFotoUri] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [contacto, setContacto] = useState(null);
  const [agendar, setAgendar] = useState(false);

  const agregar = useMedStore((s) => s.agregar);

  // ─── Handlers de recursos ───────────────────────────────────────────────
  const handleFoto = () => {
    Alert.alert('Foto del medicamento', '¿De dónde querés tomar la imagen?', [
      { text: 'Cámara', onPress: async () => { const uri = await tomarFoto(); if (uri) setFotoUri(uri); } },
      { text: 'Galería', onPress: async () => { const uri = await elegirDeGaleria(); if (uri) setFotoUri(uri); } },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleUbicacion = async () => {
    const ubic = await obtenerUbicacion();
    if (ubic) setUbicacion(ubic);
  };

  const handleContacto = async () => {
    const cont = await elegirContacto();
    if (cont) setContacto(cont);
  };

  // ─── Guardar ─────────────────────────────────────────────────────────────
  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Campo requerido', 'El nombre del medicamento es obligatorio.');
      return;
    }
    if (!hora.trim()) {
      Alert.alert('Campo requerido', 'La hora del recordatorio es obligatoria.');
      return;
    }
    if (!esHoraValida(hora)) {
      Alert.alert('Formato inválido', 'Ingresá la hora en formato HH:MM (ej: 08:30).');
      return;
    }
    setCargando(true);
    const nueva = await agregar({
      name: nombre.trim(),
      dose: dosis.trim(),
      time: hora.trim(),
      notes: notas.trim(),
      fotoUri,
      ubicacion,
      contacto,
    });
    try {
      await programarNotificacion(nombre.trim(), 10);
    } catch {}

    // Si el usuario lo pidió, creamos el evento en el calendario del dispositivo
    if (agendar) {
      await agendarToma(nueva);
    }

    setCargando(false);
    Alert.alert('✅ Guardado', `"${nombre.trim()}" fue agregado.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.base} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Text style={styles.titulo}>Nueva medicación</Text>
        </View>

        <View style={styles.formulario}>
          <Text style={styles.label}>Nombre del medicamento *</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej: Ibuprofeno 400mg" placeholderTextColor={COLORS.textoSuave} />

          <Text style={styles.label}>Dosis (opcional)</Text>
          <TextInput style={styles.input} value={dosis} onChangeText={setDosis} placeholder="Ej: 1 comprimido" placeholderTextColor={COLORS.textoSuave} />

          <Text style={styles.label}>Hora del recordatorio *</Text>
          <TextInput
            style={styles.input} value={hora} onChangeText={setHora}
            placeholder="Formato HH:MM (ej: 08:30)"
            placeholderTextColor={COLORS.textoSuave}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
          />

          <Text style={styles.label}>Notas (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notas} onChangeText={setNotas}
            placeholder="Ej: Tomar después de comer"
            placeholderTextColor={COLORS.textoSuave}
            multiline numberOfLines={3}
          />
        </View>

        {/* ─── Recursos del dispositivo ─────────────────────────────────── */}
        <Text style={styles.seccion}>Datos adicionales</Text>

        {/* Foto */}
        <TouchableOpacity style={styles.recurso} onPress={handleFoto} activeOpacity={0.8}>
          <Text style={styles.recursoIcono}>📷</Text>
          <View style={styles.recursoTexto}>
            <Text style={styles.recursoTitulo}>Foto del medicamento</Text>
            <Text style={styles.recursoDesc}>{fotoUri ? 'Imagen seleccionada ✓' : 'Cámara o galería'}</Text>
          </View>
        </TouchableOpacity>
        {fotoUri && <Image source={{ uri: fotoUri }} style={styles.preview} />}

        {/* Ubicación */}
        <TouchableOpacity style={styles.recurso} onPress={handleUbicacion} activeOpacity={0.8}>
          <Text style={styles.recursoIcono}>📍</Text>
          <View style={styles.recursoTexto}>
            <Text style={styles.recursoTitulo}>Ubicación de la farmacia</Text>
            <Text style={styles.recursoDesc}>
              {ubicacion
                ? (ubicacion.direccion || `${formatearCoordenada(ubicacion.latitude)}, ${formatearCoordenada(ubicacion.longitude)}`)
                : 'Usar mi ubicación actual'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Contacto */}
        <TouchableOpacity style={styles.recurso} onPress={handleContacto} activeOpacity={0.8}>
          <Text style={styles.recursoIcono}>👨‍⚕️</Text>
          <View style={styles.recursoTexto}>
            <Text style={styles.recursoTitulo}>Médico / familiar</Text>
            <Text style={styles.recursoDesc}>
              {contacto ? `${contacto.nombre}${contacto.telefono ? ` · ${contacto.telefono}` : ''}` : 'Elegir de contactos'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Agendar en calendario */}
        <TouchableOpacity style={[styles.recurso, agendar && styles.recursoActivo]} onPress={() => setAgendar(!agendar)} activeOpacity={0.8}>
          <Text style={styles.recursoIcono}>📅</Text>
          <View style={styles.recursoTexto}>
            <Text style={styles.recursoTitulo}>Agendar toma en el calendario</Text>
            <Text style={styles.recursoDesc}>{agendar ? 'Se creará un evento al guardar ✓' : 'Crear evento del día a la hora indicada'}</Text>
          </View>
          <Text style={styles.check}>{agendar ? '☑' : '☐'}</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 16 }}>
          <CustomButton titulo="💾 Guardar medicación" onPress={handleGuardar} cargando={cargando} />
          <CustomButton titulo="Cancelar" onPress={() => navigation.goBack()} variante="secundario" />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: COLORS.fondo },
  scroll: { flexGrow: 1, padding: 16 },
  header: { marginBottom: 12 },
  titulo: { fontSize: 24, fontWeight: '700', color: COLORS.textoPrincipal },
  formulario: {
    backgroundColor: COLORS.blanco, borderRadius: RADIOS.grande,
    padding: 20, borderWidth: 0.5, borderColor: COLORS.borde,
  },
  label: { fontSize: 13, color: COLORS.textoSecundario, fontWeight: '500', marginBottom: 5, marginTop: 8 },
  input: {
    borderWidth: 1, borderColor: COLORS.borde, borderRadius: RADIOS.chico,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: COLORS.textoPrincipal, marginBottom: 4,
    backgroundColor: COLORS.fondo,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  seccion: { fontSize: 12, fontWeight: '600', color: COLORS.textoSecundario, marginTop: 20, marginBottom: 10, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  recurso: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.blanco, borderRadius: RADIOS.medio, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: COLORS.borde },
  recursoActivo: { borderColor: COLORS.primario, borderWidth: 1.5 },
  recursoIcono: { fontSize: 22, marginRight: 12 },
  recursoTexto: { flex: 1 },
  recursoTitulo: { fontSize: 15, fontWeight: '600', color: COLORS.textoPrincipal },
  recursoDesc: { fontSize: 12, color: COLORS.textoSecundario, marginTop: 2 },
  check: { fontSize: 20, color: COLORS.primario },
  preview: { width: '100%', height: 160, borderRadius: RADIOS.medio, marginBottom: 10, resizeMode: 'cover' },
});
