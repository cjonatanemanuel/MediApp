/**
 * TEST 3 (requisito): test del store global (Zustand).
 * Verifica que las acciones agregar / toggleTomada / eliminar
 * actualizan correctamente el estado.
 */

// Mock de AsyncStorage para que la persistencia no falle en el entorno de test.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { useMedStore } from '../src/store/useMedStore';

describe('useMedStore', () => {
  // Reseteamos el store antes de cada test
  beforeEach(async () => {
    useMedStore.setState({ usuario: 'tester', medicaciones: [] });
  });

  it('agrega una medicación al estado', async () => {
    await useMedStore.getState().agregar({ name: 'Ibuprofeno', time: '08:00' });
    const meds = useMedStore.getState().medicaciones;
    expect(meds).toHaveLength(1);
    expect(meds[0].name).toBe('Ibuprofeno');
    expect(meds[0].tomada).toBe(false); // arranca como pendiente
  });

  it('marca una medicación como tomada con toggleTomada', async () => {
    const nueva = await useMedStore.getState().agregar({ name: 'Paracetamol', time: '09:00' });
    await useMedStore.getState().toggleTomada(nueva.id);
    const med = useMedStore.getState().medicaciones.find((m) => m.id === nueva.id);
    expect(med.tomada).toBe(true);
  });

  it('elimina una medicación del estado', async () => {
    const nueva = await useMedStore.getState().agregar({ name: 'Amoxicilina', time: '10:00' });
    await useMedStore.getState().eliminar(nueva.id);
    expect(useMedStore.getState().medicaciones).toHaveLength(0);
  });

  it('actualiza campos de una medicación', async () => {
    const nueva = await useMedStore.getState().agregar({ name: 'Aspirina', time: '11:00' });
    await useMedStore.getState().actualizar(nueva.id, { dose: '1 comprimido' });
    const med = useMedStore.getState().medicaciones.find((m) => m.id === nueva.id);
    expect(med.dose).toBe('1 comprimido');
  });
});
