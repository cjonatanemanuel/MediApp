import { create } from 'zustand';
import {
  registrarUsuario,
  loginUsuario,
  obtenerSesion,
  cerrarSesion as cerrarSesionStorage,
} from '../storage/storage';

/**
 * Store global de autenticación (Zustand).
 * Reemplaza el manejo de sesión que antes estaba disperso con useState
 * en LoginScreen y pasado por params de navegación (prop drilling).
 * Ahora cualquier pantalla lee el usuario logueado con useAuthStore().
 */
export const useAuthStore = create((set) => ({
  usuario: null,        // string | null
  cargando: true,       // mientras se restaura la sesión al abrir la app

  // Restaura la sesión persistida (se llama al iniciar la app)
  restaurarSesion: async () => {
    const sesion = await obtenerSesion();
    set({ usuario: sesion ? sesion.usuario : null, cargando: false });
    return sesion ? sesion.usuario : null;
  },

  registrar: async (usuario, contrasena) => {
    return await registrarUsuario(usuario, contrasena);
  },

  iniciarSesion: async (usuario, contrasena) => {
    const resultado = await loginUsuario(usuario, contrasena);
    if (resultado.ok) set({ usuario: resultado.usuario.usuario });
    return resultado;
  },

  cerrarSesion: async () => {
    await cerrarSesionStorage();
    set({ usuario: null });
  },
}));
