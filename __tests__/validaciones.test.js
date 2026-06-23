/**
 * TEST 2 (requisito): test de una función / lógica de negocio.
 * Verifica la validación de hora y el cálculo de adherencia.
 */
import { esHoraValida, calcularAdherencia, formatearCoordenada } from '../src/utils/validaciones';

describe('esHoraValida', () => {
  it('acepta horas válidas en formato HH:MM', () => {
    expect(esHoraValida('08:30')).toBe(true);
    expect(esHoraValida('00:00')).toBe(true);
    expect(esHoraValida('23:59')).toBe(true);
    expect(esHoraValida('9:05')).toBe(true);
  });

  it('rechaza horas inválidas', () => {
    expect(esHoraValida('24:00')).toBe(false);
    expect(esHoraValida('12:60')).toBe(false);
    expect(esHoraValida('8.30')).toBe(false);
    expect(esHoraValida('abc')).toBe(false);
    expect(esHoraValida('')).toBe(false);
  });
});

describe('calcularAdherencia', () => {
  it('devuelve 0 si no hay medicaciones', () => {
    expect(calcularAdherencia([])).toBe(0);
  });

  it('calcula el porcentaje de tomadas sobre el total', () => {
    const meds = [
      { tomada: true }, { tomada: true }, { tomada: false }, { tomada: false },
    ];
    expect(calcularAdherencia(meds)).toBe(50);
  });

  it('redondea correctamente', () => {
    const meds = [{ tomada: true }, { tomada: false }, { tomada: false }];
    expect(calcularAdherencia(meds)).toBe(33);
  });
});

describe('formatearCoordenada', () => {
  it('acorta a 5 decimales', () => {
    expect(formatearCoordenada(-34.6037389)).toBe('-34.60374');
  });
  it('devuelve string vacío si no es número', () => {
    expect(formatearCoordenada(undefined)).toBe('');
  });
});
