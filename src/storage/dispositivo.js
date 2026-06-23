import { Alert, Platform, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import { esHoraValida } from '../utils/validaciones';

// ─── CÁMARA Y GALERÍA ─────────────────────────────────────
export const tomarFoto = async () => {
  const permiso = await ImagePicker.requestCameraPermissionsAsync();
  if (permiso.status !== 'granted') {
    Alert.alert('Permiso de cámara denegado', 'Habilitá el acceso a la cámara desde los ajustes.');
    return null;
  }
  const resultado = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5, allowsEditing: true });
  if (resultado.canceled) return null;
  return resultado.assets[0].uri;
};

export const elegirDeGaleria = async () => {
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permiso.status !== 'granted') {
    Alert.alert('Permiso de galería denegado', 'Habilitá el acceso a la galería desde los ajustes.');
    return null;
  }
  const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5, allowsEditing: true });
  if (resultado.canceled) return null;
  return resultado.assets[0].uri;
};

// ─── UBICACIÓN GPS ────────────────────────────────────────
export const obtenerUbicacion = async () => {
  const permiso = await Location.requestForegroundPermissionsAsync();
  if (permiso.status !== 'granted') {
    Alert.alert('Permiso de ubicación denegado', 'Activá el permiso de ubicación de Expo Go.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
    ]);
    return null;
  }

  let pos = await Location.getLastKnownPositionAsync();

  // Espera hasta 20s: te da tiempo a tocar SET LOCATION en el emulador
  // mientras la app está escuchando (que es cuando la capta).
  if (!pos) {
    pos = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest }).catch(() => null),
      new Promise((resolve) => setTimeout(() => resolve(null), 20000)),
    ]);
  }

  if (!pos) {
    pos = await Location.getLastKnownPositionAsync();
  }

  if (!pos) {
    Alert.alert('Ubicación no disponible', 'No se pudo obtener la ubicación. En el emulador: ⋯ → Location, poné una dirección, tocá SET LOCATION y reintentá.');
    return null;
  }

  const { latitude, longitude } = pos.coords;

  let direccion = '';
  try {
    const lugares = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (lugares.length > 0) {
      const l = lugares[0];
      direccion = [l.street, l.name, l.city, l.region].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).join(', ');
    }
  } catch {
    direccion = '';
  }

  return { latitude, longitude, direccion };
};

// ─── CONTACTOS ────────────────────────────────────────────
export const elegirContacto = async () => {
  const permiso = await Contacts.requestPermissionsAsync();
  if (permiso.status !== 'granted') {
    Alert.alert('Permiso de contactos denegado', 'Activá el permiso de contactos de Expo Go.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
    ]);
    return null;
  }
  const contacto = await Contacts.presentContactPickerAsync();
  if (!contacto) return null;
  const telefono = contacto.phoneNumbers && contacto.phoneNumbers.length > 0 ? contacto.phoneNumbers[0].number : '';
  return { nombre: contacto.name || 'Sin nombre', telefono };
};

// ─── CALENDARIO ───────────────────────────────────────────
const obtenerCalendarioModificable = async () => {
  if (Platform.OS === 'ios') {
    const cal = await Calendar.getDefaultCalendarAsync();
    if (cal) return cal.id;
  }
  const calendarios = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const modificable = calendarios.find((c) => c.allowsModifications);
  if (modificable) return modificable.id;

  const fuente = Platform.OS === 'android' ? { isLocalAccount: true, name: 'Medi.' } : calendarios[0]?.source;
  return await Calendar.createCalendarAsync({
    title: 'Medi.', color: '#00A86B', entityType: Calendar.EntityTypes.EVENT,
    sourceId: Platform.OS === 'ios' ? fuente?.id : undefined,
    source: Platform.OS === 'android' ? fuente : undefined,
    name: 'Medi.', ownerAccount: 'personal', accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
};

export const agendarToma = async (medicacion) => {
  const permiso = await Calendar.requestCalendarPermissionsAsync();
  if (permiso.status !== 'granted') {
    Alert.alert('Permiso de calendario denegado', 'Habilitá el acceso al calendario.');
    return false;
  }
  if (!esHoraValida(medicacion.time)) {
    Alert.alert('Hora inválida', 'La medicación no tiene una hora válida (HH:MM).');
    return false;
  }

  const [hh, mm] = medicacion.time.split(':').map(Number);
  const inicio = new Date();
  inicio.setHours(hh, mm, 0, 0);
  const fin = new Date(inicio.getTime() + 15 * 60 * 1000);

  try {
    const calendarId = await obtenerCalendarioModificable();
    await Calendar.createEventAsync(calendarId, {
      title: `💊 Tomar ${medicacion.name}`,
      notes: medicacion.dose ? `Dosis: ${medicacion.dose}` : 'Recordatorio de medicación',
      startDate: inicio, endDate: fin, alarms: [{ relativeOffset: -5 }], timeZone: undefined,
    });
    return true;
  } catch (e) {
    Alert.alert('Error', 'No se pudo crear el evento en el calendario.');
    return false;
  }
};