import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { pedirPermisos } from '../storage/notifications';
import { COLORS, RADIOS } from '../storage/theme';
import CustomButton from '../components/CustomButton';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(true);

  // Acciones del store global de autenticación
  const restaurarSesion = useAuthStore((s) => s.restaurarSesion);
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion);

  useEffect(() => {
    (async () => {
      await pedirPermisos();
      const usuarioSesion = await restaurarSesion();
      if (usuarioSesion) {
        navigation.replace('Main');
      } else {
        setCargando(false);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!usuario.trim() || !contrasena.trim()) {
      Alert.alert('Campos vacíos', 'Completá usuario y contraseña.');
      return;
    }
    setCargando(true);
    const resultado = await iniciarSesion(usuario.trim(), contrasena);
    setCargando(false);
    if (resultado.ok) {
      navigation.replace('Main');
    } else {
      Alert.alert('Error', resultado.mensaje);
    }
  };

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color={COLORS.primario} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.base} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoCirculo}>
            <Text style={styles.logoTexto}>M</Text>
          </View>
          <Text style={styles.appNombre}>Medi.</Text>
          <Text style={styles.appSlogan}>Bienvenido de vuelta</Text>
        </View>
        <View style={styles.formulario}>
          <Text style={styles.titulo}>Iniciar sesión</Text>
          <Text style={styles.label}>Usuario</Text>
          <TextInput style={styles.input} value={usuario} onChangeText={setUsuario} placeholder="Tu nombre de usuario" placeholderTextColor={COLORS.textoSuave} autoCapitalize="none" />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput style={styles.input} value={contrasena} onChangeText={setContrasena} placeholder="Tu contraseña" placeholderTextColor={COLORS.textoSuave} secureTextEntry />
          <CustomButton titulo="Ingresar" onPress={handleLogin} cargando={cargando} estilo={{ marginTop: 8 }} />
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContenedor}>
            <Text style={styles.link}>¿No tenés cuenta? <Text style={styles.linkVerde}>Registrate</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: COLORS.fondo },
  cargando: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.fondo },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoCirculo: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primario, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  logoTexto: { fontSize: 36, fontWeight: '700', color: COLORS.blanco },
  appNombre: { fontSize: 30, fontWeight: '700', color: COLORS.textoPrincipal },
  appSlogan: { fontSize: 14, color: COLORS.textoSecundario, marginTop: 2 },
  formulario: { backgroundColor: COLORS.blanco, borderRadius: RADIOS.grande, padding: 24, borderWidth: 0.5, borderColor: COLORS.borde },
  titulo: { fontSize: 20, fontWeight: '600', color: COLORS.textoPrincipal, marginBottom: 18 },
  label: { fontSize: 13, color: COLORS.textoSecundario, fontWeight: '500', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: COLORS.borde, borderRadius: RADIOS.chico, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: COLORS.textoPrincipal, marginBottom: 14, backgroundColor: COLORS.fondo },
  linkContenedor: { alignItems: 'center', marginTop: 14 },
  link: { fontSize: 14, color: COLORS.textoSecundario },
  linkVerde: { color: COLORS.primario, fontWeight: '600' },
});
