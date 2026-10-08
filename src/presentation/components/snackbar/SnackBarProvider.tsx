import React, {
  createContext,
  ReactNode,
  useCallback,
  useState,
} from 'react';

import {
  SnackBar,
  SnackBarTipo,
  SnackBarPosicion
} from './SnackBar';

interface SnackBarContextType {
  mostrarSnackBar: (
    mensaje: string,
    tipo?: SnackBarTipo,
    duracion?: number,
    posicion?: SnackBarPosicion
  ) => void;

  ocultarSnackBar: () => void;
}

export const SnackBarContext =
  createContext<SnackBarContextType | undefined>(undefined);

interface SnackBarProviderProps {
  children: ReactNode;
}

export function SnackBarProvider({
  children,
}: SnackBarProviderProps) {
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] =
    useState<SnackBarTipo>('info');
  const [visible, setVisible] = useState(false);
  const [duracion, setDuracion] = useState(3000);
  const [posicion, setPosicion] = useState<SnackBarPosicion>('top');

  const mostrarSnackBar = useCallback(
    (
      nuevoMensaje: string,
      nuevoTipo: SnackBarTipo = 'info',
      nuevaDuracion = 3000,
      nuevaPosicion: SnackBarPosicion = 'top'
    ) => {
      setMensaje(nuevoMensaje);
      setTipo(nuevoTipo);
      setDuracion(nuevaDuracion);
      setPosicion(nuevaPosicion);
      setVisible(true);
    },
    [],
  );

  const ocultarSnackBar = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <SnackBarContext.Provider
      value={{
        mostrarSnackBar,
        ocultarSnackBar,
      }}
    >
      {children}

      <SnackBar
        mensaje={mensaje}
        tipo={tipo}
        visible={visible}
        duracion={duracion}
        posicion={posicion}
        onClose={ocultarSnackBar}
      />
    </SnackBarContext.Provider>
  );
}