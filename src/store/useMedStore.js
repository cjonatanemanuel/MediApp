import { create } from 'zustand';
import { leerMedicaciones, escribirMedicaciones } from '../storage/storage';

/**
 * Store global de medicaciones (Zustand).
 * Migra la lista principal de la app desde el patrón anterior
 * (cada pantalla llamaba a AsyncStorage por su cuenta con useState).
 * Ahora hay una única fuente de verdad y las pantallas leen/escriben acá.
 *
 * Cada medicación: { id, name, dose, time, notes, tomada, fotoUri, ubicacion, contacto }
 *   - fotoUri:    string (uri local de la imagen del medicamento)
 *   - ubicacion:  { latitude, longitude, direccion } (farmacia)
 *   - contacto:   { nombre, telefono } (médico / familiar)
 */
export const useMedStore = create((set, get) => ({
  usuario: null,
  medicaciones: [],

  // Carga las medicaciones del usuario logueado (namespacing por usuario)
  cargarParaUsuario: async (usuario) => {
    const lista = await leerMedicaciones(usuario);
    set({ usuario, medicaciones: lista });
  },

  // Persiste el estado actual en AsyncStorage
  _persistir: async (lista) => {
    const { usuario } = get();
    if (usuario) await escribirMedicaciones(usuario, lista);
  },

  agregar: async (medicacion) => {
    const nueva = {
      id: Date.now().toString(),
      tomada: false,
      fotoUri: null,
      ubicacion: null,
      contacto: null,
      ...medicacion,
    };
    const lista = [...get().medicaciones, nueva];
    set({ medicaciones: lista });
    await get()._persistir(lista);
    return nueva;
  },

  eliminar: async (id) => {
    const lista = get().medicaciones.filter((m) => m.id !== id);
    set({ medicaciones: lista });
    await get()._persistir(lista);
  },

  // Actualiza cualquier campo de una medicación (nombre, foto, ubicación, contacto, etc.)
  actualizar: async (id, cambios) => {
    const lista = get().medicaciones.map((m) =>
      m.id === id ? { ...m, ...cambios } : m
    );
    set({ medicaciones: lista });
    await get()._persistir(lista);
  },

  // Marca/desmarca como tomada. (En el Parcial 1 esta acción existía pero no se
  // llamaba desde ninguna pantalla, por eso Progreso siempre mostraba 0%.)
  toggleTomada: async (id) => {
    const lista = get().medicaciones.map((m) =>
      m.id === id ? { ...m, tomada: !m.tomada } : m
    );
    set({ medicaciones: lista });
    await get()._persistir(lista);
  },

  limpiar: () => set({ usuario: null, medicaciones: [] }),
}));
