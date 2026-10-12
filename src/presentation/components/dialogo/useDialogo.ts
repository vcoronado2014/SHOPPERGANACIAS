
import {
  useCallback,
  useState,
} from 'react';

import {
  DialogoPersonalizadoProps,
} from './DialogoPersonalizado';

type OpcionesDialogo = Omit<
  DialogoPersonalizadoProps,
  'visible' | 'onAceptar' | 'onCancelar'
> & {
  onAceptar?: () => void;
  onCancelar?: () => void;
};

interface EstadoDialogo extends OpcionesDialogo {
  visible: boolean;
}

export function useDialogo() {
  const [dialogo, setDialogo] = useState<EstadoDialogo>({
    visible: false,
    titulo: '',
    parrafo: '',
  });

  const mostrarDialogo = useCallback(
    (opciones: OpcionesDialogo) => {
      setDialogo({
        ...opciones,
        visible: true,
      });
    },
    [],
  );

  const cerrarDialogo = useCallback(() => {
    setDialogo((actual) => ({
      ...actual,
      visible: false,
    }));
  }, []);

  const aceptarDialogo = useCallback(() => {
    const accion = dialogo.onAceptar;

    cerrarDialogo();
    accion?.();
  }, [dialogo.onAceptar, cerrarDialogo]);

  const cancelarDialogo = useCallback(() => {
    const accion = dialogo.onCancelar;

    cerrarDialogo();
    accion?.();
  }, [dialogo.onCancelar, cerrarDialogo]);

  return {
    dialogo,
    mostrarDialogo,
    cerrarDialogo,
    aceptarDialogo,
    cancelarDialogo,
  };
}