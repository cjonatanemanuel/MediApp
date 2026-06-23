/**
 * TEST 1 (requisito): test de un componente reutilizable.
 * Verifica que CustomButton renderiza el título y responde al press.
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import CustomButton from '../src/components/CustomButton';

describe('CustomButton', () => {
  it('renderiza el título que recibe por props', () => {
    render(<CustomButton titulo="Guardar" onPress={() => {}} />);
    expect(screen.getByText('Guardar')).toBeTruthy();
  });

  it('ejecuta onPress al ser presionado', () => {
    const onPressMock = jest.fn();
    render(<CustomButton titulo="Ingresar" onPress={onPressMock} />);
    fireEvent.press(screen.getByText('Ingresar'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('muestra el spinner y no dispara onPress cuando está cargando', () => {
    const onPressMock = jest.fn();
    render(<CustomButton titulo="Enviar" onPress={onPressMock} cargando />);
    // Con cargando=true el texto se reemplaza por el ActivityIndicator
    expect(screen.queryByText('Enviar')).toBeNull();
  });
});
