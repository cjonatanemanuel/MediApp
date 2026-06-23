import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const pedirPermisos = async () => {
  try {
    if (!Device.isDevice) return false;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

export const programarNotificacion = async (nombre, segundos = 10) => {
  try {
    await pedirPermisos();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 Medi. — Recordatorio',
        body: `Es hora de tomar: ${nombre}`,
        sound: true,
      },
      trigger: { seconds: segundos },
    });
  } catch {
    console.log('Notificación no disponible');
  }
};
