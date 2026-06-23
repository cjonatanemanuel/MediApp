import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../storage/theme';
import { useAuthStore } from '../store/useAuthStore';
import { useMedStore } from '../store/useMedStore';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MedScreen from '../screens/MedScreen';
import AddMedicationScreen from '../screens/AddMedicationScreen';
import ProgresoScreen from '../screens/ProgresoScreen';
import SaludScreen from '../screens/SaludScreen';
import YoScreen from '../screens/YoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONOS = { Inicio: '🏠', Med: '💊', Progreso: '📊', Salud: '❤️', Yo: '👤' };

function MainTabs() {
  // El usuario logueado ahora vive en el store global (no se pasa por params).
  const usuario = useAuthStore((s) => s.usuario);
  const cargarParaUsuario = useMedStore((s) => s.cargarParaUsuario);

  // Al entrar a la zona logueada, cargamos las medicaciones de ESE usuario.
  useEffect(() => {
    if (usuario) cargarParaUsuario(usuario);
  }, [usuario]);

  return (
    <Tab.Navigator
      screenOptions={({ route: tabRoute }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primario,
        tabBarInactiveTintColor: COLORS.textoSuave,
        tabBarStyle: { backgroundColor: COLORS.fondoCard, borderTopColor: COLORS.borde, borderTopWidth: 0.5, height: 60, paddingBottom: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{ICONOS[tabRoute.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Med" component={MedScreen} />
      <Tab.Screen name="Progreso" component={ProgresoScreen} />
      <Tab.Screen name="Salud" component={SaludScreen} />
      <Tab.Screen name="Yo" component={YoScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="AgregarMedicacion" component={AddMedicationScreen} />
    </Stack.Navigator>
  );
}
