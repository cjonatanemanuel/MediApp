import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_USUARIOS = 'medi_usuarios';
const CLAVE_SESION = 'medi_sesion';

// Las medicaciones y la salud ahora se guardan POR USUARIO.
// Antes eran claves globales y todos los usuarios compartían los mismos datos (bug del Parcial 1).
const claveMedicaciones = (usuario) => `medi_medicaciones_${usuario}`;
const claveSalud = (usuario) => `medi_salud_${usuario}`;

// ─── USUARIOS ────────────────────────────────────────────────────────────────

export const obtenerUsuarios = async () => {
  try {
    const datos = await AsyncStorage.getItem(CLAVE_USUARIOS);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
};

export const registrarUsuario = async (usuario, contrasena) => {
  const usuarios = await obtenerUsuarios();
  const existe = usuarios.find((u) => u.usuario.toLowerCase() === usuario.toLowerCase());
  if (existe) return { ok: false, mensaje: 'El usuario ya existe.' };
  usuarios.push({ usuario, contrasena });
  await AsyncStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  return { ok: true };
};

export const loginUsuario = async (usuario, contrasena) => {
  const usuarios = await obtenerUsuarios();
  const encontrado = usuarios.find(
    (u) => u.usuario.toLowerCase() === usuario.toLowerCase() && u.contrasena === contrasena
  );
  if (!encontrado) return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
  await AsyncStorage.setItem(CLAVE_SESION, JSON.stringify(encontrado));
  return { ok: true, usuario: encontrado };
};

export const obtenerSesion = async () => {
  try {
    const datos = await AsyncStorage.getItem(CLAVE_SESION);
    return datos ? JSON.parse(datos) : null;
  } catch {
    return null;
  }
};

export const cerrarSesion = async () => {
  await AsyncStorage.removeItem(CLAVE_SESION);
};

// ─── MEDICACIONES (por usuario) ──────────────────────────────────────────────

export const leerMedicaciones = async (usuario) => {
  try {
    const datos = await AsyncStorage.getItem(claveMedicaciones(usuario));
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
};

export const escribirMedicaciones = async (usuario, lista) => {
  await AsyncStorage.setItem(claveMedicaciones(usuario), JSON.stringify(lista));
};

// ─── SALUD (por usuario) ──────────────────────────────────────────────────────

const SALUD_VACIA = { presion: '', temperatura: '', agua: '0' };

export const leerSalud = async (usuario) => {
  try {
    const datos = await AsyncStorage.getItem(claveSalud(usuario));
    return datos ? JSON.parse(datos) : { ...SALUD_VACIA };
  } catch {
    return { ...SALUD_VACIA };
  }
};

export const escribirSalud = async (usuario, datos) => {
  await AsyncStorage.setItem(claveSalud(usuario), JSON.stringify(datos));
};
