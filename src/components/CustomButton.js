import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, RADIOS } from '../storage/theme';

export default function CustomButton({ titulo, onPress, variante = 'primario', cargando = false, estilo }) {
  const esPrimario = variante === 'primario';
  const esPeligro = variante === 'peligro';

  const getColor = () => {
    if (esPeligro) return COLORS.rojo;
    if (esPrimario) return COLORS.primario;
    return COLORS.blanco;
  };

  return (
    <TouchableOpacity
      style={[styles.boton, { backgroundColor: getColor() }, !esPrimario && !esPeligro && styles.secundario, estilo]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={cargando}
    >
      {cargando ? (
        <ActivityIndicator color={esPrimario || esPeligro ? COLORS.blanco : COLORS.primario} />
      ) : (
        <Text style={[styles.texto, (esPrimario || esPeligro) ? styles.textoBlanco : styles.textoVerde]}>
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: RADIOS.medio,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  secundario: {
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  texto: {
    fontSize: 15,
    fontWeight: '600',
  },
  textoBlanco: { color: COLORS.blanco },
  textoVerde: { color: COLORS.primario },
});
