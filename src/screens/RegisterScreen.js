import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS, RADIOS } from '../storage/theme';
import CustomButton from '../components/CustomButton';

export default function RegisterScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [cargando, setCargando] = useState(false);

  const registrar = useAuthStore((s) => s.registrar);

  const handleRegistro = async () => {
    if (!usuario.trim() || !contrasena.trim() || !confirmar.trim()) {
      Alert.alert('Campos vacíos', 'Completá todos los campos.');
      return;
    }
    if (usuario.trim().length < 3) {
      Alert.alert('Usuario inválido', 'El usuario debe tener al menos 3 caracteres.');
      return;
    }
    if (contrasena.length < 4) {
      Alert.alert('Contraseña corta', 'La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (contrasena !== confirmar) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    setCargando(true);
    const resultado = await registrar(usuario.trim(), contrasena);
    setCargando(false);
    if (resultado.ok) {
      Alert.alert('¡Listo!', 'Cuenta creada correctamente.', [
        { text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      Alert.alert('Error', resultado.mensaje);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.base} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.volver}>
          <Text style={styles.volverTexto}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.subtitulo}>Registrate para usar Medi.</Text>

        <View style={styles.formulario}>
          <Text style={styles.label}>Usuario *</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Mínimo 3 caracteres"
            placeholderTextColor={COLORS.textoSuave}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña *</Text>
          <TextInput
            style={styles.input}
            value={contrasena}
            onChangeText={setContrasena}
            placeholder="Mínimo 4 caracteres"
            placeholderTextColor={COLORS.textoSuave}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar contraseña *</Text>
          <TextInput
            style={styles.input}
            value={confirmar}
            onChangeText={setConfirmar}
            placeholder="Repetí la contraseña"
            placeholderTextColor={COLORS.textoSuave}
            secureTextEntry
          />

          <CustomButton titulo="Registrarme" onPress={handleRegistro} cargando={cargando} estilo={{ marginTop: 8 }} />
          <CustomButton titulo="Ya tengo cuenta" onPress={() => navigation.navigate('Login')} variante="secundario" />

          <Text style={styles.aviso}>Los datos se guardan solo en tu dispositivo.</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: COLORS.fondo },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  volver: { marginBottom: 16 },
  volverTexto: { fontSize: 14, color: COLORS.primario, fontWeight: '500' },
  titulo: { fontSize: 28, fontWeight: '700', color: COLORS.textoPrincipal },
  subtitulo: { fontSize: 14, color: COLORS.textoSecundario, marginTop: 4, marginBottom: 24 },
  formulario: {
    backgroundColor: COLORS.blanco, borderRadius: RADIOS.grande,
    padding: 24, borderWidth: 0.5, borderColor: COLORS.borde,
  },
  label: { fontSize: 13, color: COLORS.textoSecundario, fontWeight: '500', marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: COLORS.borde, borderRadius: RADIOS.chico,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: COLORS.textoPrincipal, marginBottom: 14,
    backgroundColor: COLORS.fondo,
  },
  aviso: { fontSize: 12, color: COLORS.textoSuave, textAlign: 'center', marginTop: 12 },
});
