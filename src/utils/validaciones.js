/**
 * Funciones puras de validación / formateo.
 * Se extraen acá para poder testearlas con Jest de forma aislada,
 * sin depender de componentes ni de React Native.
 */

// Valida que la hora esté en formato HH:MM (00:00 a 23:59)
export const esHoraValida = (h) => /^([01]?\d|2[0-3]):[0-5]\d$/.test(String(h).trim());

// Calcula el porcentaje de adherencia (medicaciones tomadas sobre el total)
export const calcularAdherencia = (medicaciones = []) => {
  if (!medicaciones.length) return 0;
  const tomadas = medicaciones.filter((m) => m.tomada).length;
  return Math.round((tomadas / medicaciones.length) * 100);
};

// Acorta coordenadas para mostrarlas de forma legible
export const formatearCoordenada = (valor) =>
  typeof valor === 'number' ? valor.toFixed(5) : '';
