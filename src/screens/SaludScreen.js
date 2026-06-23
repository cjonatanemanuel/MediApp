import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { leerSalud, escribirSalud } from '../storage/storage';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS, RADIOS } from '../storage/theme';

export default function SaludScreen() {
  // El usuario logueado se lee del store; los datos de salud son por usuario.
  const usuario = useAuthStore((s) => s.usuario);

  const [presion, setPresion] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [agua, setAgua] = useState('0');
  const [editandoPresion, setEditandoPresion] = useState(false);
  const [editandoTemp, setEditandoTemp] = useState(false);

  useFocusEffect(useCallback(() => { cargar(); }, [usuario]));

  const cargar = async () => {
    if (!usuario) return;
    const datos = await leerSalud(usuario);
    setPresion(datos.presion || '');
    setTemperatura(datos.temperatura || '');
    setAgua(datos.agua || '0');
  };

  const guardar = async (nuevosDatos) => {
    if (usuario) await escribirSalud(usuario, nuevosDatos);
  };

  const guardarPresion = async () => { setEditandoPresion(false); await guardar({ presion, temperatura, agua }); };
  const guardarTemperatura = async () => { setEditandoTemp(false); await guardar({ presion, temperatura, agua }); };

  const incrementarAgua = async () => {
    const nuevo = String(parseInt(agua || '0') + 1);
    setAgua(nuevo);
    await guardar({ presion, temperatura, agua: nuevo });
  };

  const decrementarAgua = async () => {
    const actual = parseInt(agua || '0');
    if (actual <= 0) return;
    const nuevo = String(actual - 1);
    setAgua(nuevo);
    await guardar({ presion, temperatura, agua: nuevo });
  };

  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Salud</Text>
        <Text style={styles.subtitulo}>Registro de hoy</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcono}><Text style={styles.cardEmoji}>🩺</Text></View>
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Presión arterial</Text>
              {!editandoPresion && <Text style={styles.cardValor}>{presion || 'Sin registrar'}</Text>}
            </View>
            <TouchableOpacity onPress={() => setEditandoPresion(!editandoPresion)}>
              <Text style={styles.editarIcono}>{editandoPresion ? '✕' : '✏️'}</Text>
            </TouchableOpacity>
          </View>
          {editandoPresion && (
            <View style={styles.editarContenedor}>
              <TextInput style={styles.input} value={presion} onChangeText={setPresion} placeholder="Ej: 120/80 mmHg" placeholderTextColor={COLORS.textoSuave} />
              <TouchableOpacity style={styles.btnGuardar} onPress={guardarPresion}>
                <Text style={styles.btnGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcono}><Text style={styles.cardEmoji}>🌡️</Text></View>
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Temperatura</Text>
              {!editandoTemp && <Text style={styles.cardValor}>{temperatura ? `${temperatura} °C` : 'Sin registrar'}</Text>}
            </View>
            <TouchableOpacity onPress={() => setEditandoTemp(!editandoTemp)}>
              <Text style={styles.editarIcono}>{editandoTemp ? '✕' : '✏️'}</Text>
            </TouchableOpacity>
          </View>
          {editandoTemp && (
            <View style={styles.editarContenedor}>
              <TextInput style={styles.input} value={temperatura} onChangeText={setTemperatura} placeholder="Ej: 36.5" placeholderTextColor={COLORS.textoSuave} keyboardType="decimal-pad" />
              <TouchableOpacity style={styles.btnGuardar} onPress={guardarTemperatura}>
                <Text style={styles.btnGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcono}><Text style={styles.cardEmoji}>💧</Text></View>
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Agua</Text>
              <Text style={styles.cardValor}>{agua} vasos hoy</Text>
            </View>
          </View>
          <View style={styles.aguaControles}>
            <TouchableOpacity style={styles.aguaBtn} onPress={decrementarAgua}>
              <Text style={styles.aguaBtnTexto}>−</Text>
            </TouchableOpacity>
            <Text style={styles.aguaNum}>{agua}</Text>
            <TouchableOpacity style={styles.aguaBtn} onPress={incrementarAgua}>
              <Text style={styles.aguaBtnTexto}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.aguaVasos}>
            {Array.from({ length: Math.min(parseInt(agua || '0'), 8) }).map((_, i) => (
              <Text key={i} style={styles.vasoEmoji}>💧</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: COLORS.fondo },
  header: { backgroundColor: COLORS.primario, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  titulo: { fontSize: 22, fontWeight: '700', color: COLORS.blanco },
  subtitulo: { fontSize: 13, color: COLORS.primarioClarito, marginTop: 2 },
  scroll: { padding: 16 },
  card: { backgroundColor: COLORS.blanco, borderRadius: RADIOS.medio, padding: 14, marginBottom: 12, borderWidth: 0.5, borderColor: COLORS.borde },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIcono: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.verdeClaro, alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 20 },
  cardTexto: { flex: 1 },
  cardTitulo: { fontSize: 15, fontWeight: '600', color: COLORS.textoPrincipal },
  cardValor: { fontSize: 13, color: COLORS.textoSecundario, marginTop: 2 },
  editarIcono: { fontSize: 18 },
  editarContenedor: { marginTop: 10, flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.borde, borderRadius: RADIOS.chico, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: COLORS.textoPrincipal, backgroundColor: COLORS.fondo },
  btnGuardar: { backgroundColor: COLORS.primario, borderRadius: RADIOS.chico, paddingHorizontal: 14, paddingVertical: 9 },
  btnGuardarTexto: { color: COLORS.blanco, fontWeight: '600', fontSize: 13 },
  aguaControles: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 12 },
  aguaBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.verdeClaro, alignItems: 'center', justifyContent: 'center' },
  aguaBtnTexto: { fontSize: 22, color: COLORS.primario, fontWeight: '600' },
  aguaNum: { fontSize: 28, fontWeight: '700', color: COLORS.primario, minWidth: 40, textAlign: 'center' },
  aguaVasos: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 10, justifyContent: 'center' },
  vasoEmoji: { fontSize: 22 },
});
