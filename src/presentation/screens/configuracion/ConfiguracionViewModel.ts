import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getConfiguracion,
  saveConfiguracion,
} from '../../../data/storage/appStorage';

import {
  Configuracion,
  VentanaHoraria,
} from '../../../domain/models/Configuracion';

export function useConfiguracionViewModel() {
  const [configuracion, setConfiguracion] =
    useState<Configuracion | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * ==============================
   * VALIDAR VENTANAS HORARIAS
   * ==============================
   */

  const validarVentanasHorarias =
    useCallback(
      (
        ventanas: VentanaHoraria[],
      ): string | null => {
        for (
          let i = 0;
          i < ventanas.length;
          i++
        ) {
          const ventana =
            ventanas[i];

          const inicio =
            Number(ventana.inicio);

          const fin =
            Number(ventana.fin);

          /**
           * Validar campos vacíos
           */
          if (
            ventana.inicio.trim() === '' ||
            ventana.fin.trim() === ''
          ) {
            return `La ventana ${i + 1} tiene campos vacíos.`;
          }

          /**
           * Validar que sean números
           */
          if (
            !Number.isInteger(inicio) ||
            !Number.isInteger(fin)
          ) {
            return `La ventana ${i + 1} contiene horas inválidas.`;
          }

          /**
           * Validar rango
           */
          if (
            inicio < 0 ||
            inicio > 23 ||
            fin < 0 ||
            fin > 23
          ) {
            return `La ventana ${i + 1} debe estar entre 00 y 23 horas.`;
          }

          /**
           * Validar que inicio sea
           * menor que fin
           */
          if (inicio >= fin) {
            return `La ventana ${i + 1} tiene un horario inválido. El inicio debe ser menor que el fin.`;
          }
        }

        /**
         * ==============================
         * VALIDAR DUPLICADOS
         * ==============================
         */

        for (
          let i = 0;
          i < ventanas.length;
          i++
        ) {
          for (
            let j = i + 1;
            j < ventanas.length;
            j++
          ) {
            const ventanaA =
              ventanas[i];

            const ventanaB =
              ventanas[j];

            if (
              Number(ventanaA.inicio) ===
                Number(ventanaB.inicio) &&
              Number(ventanaA.fin) ===
                Number(ventanaB.fin)
            ) {
              return `Las ventanas ${i + 1} y ${j + 1} son iguales.`;
            }
          }
        }

        /**
         * ==============================
         * VALIDAR SUPERPOSICIONES
         * ==============================
         */

        for (
          let i = 0;
          i < ventanas.length;
          i++
        ) {
          for (
            let j = i + 1;
            j < ventanas.length;
            j++
          ) {
            const inicioA =
              Number(
                ventanas[i].inicio,
              );

            const finA =
              Number(
                ventanas[i].fin,
              );

            const inicioB =
              Number(
                ventanas[j].inicio,
              );

            const finB =
              Number(
                ventanas[j].fin,
              );

            const seSuperponen =
              inicioA < finB &&
              inicioB < finA;

            if (seSuperponen) {
              return `Las ventanas ${i + 1} y ${j + 1} se superponen.`;
            }
          }
        }

        return null;
      },
      [],
    );

  /**
   * ==============================
   * CARGAR CONFIGURACIÓN
   * ==============================
   */

  const cargarConfiguracion =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const datos =
          await getConfiguracion();

        setConfiguracion(datos);
      } catch (e) {
        console.error(
          'Error cargando configuración:',
          e,
        );

        setError(
          'No fue posible cargar la configuración.',
        );
      } finally {
        setLoading(false);
      }
    }, []);

  /**
   * ==============================
   * GUARDAR CONFIGURACIÓN
   * ==============================
   */

  const guardarConfiguracion =
    useCallback(
      async (
        nuevaConfiguracion: Configuracion,
      ): Promise<boolean> => {
        try {
          setSaving(true);
          setError(null);

          /**
           * Validar ventanas antes
           * de guardar.
           */
          const errorVentanas =
            validarVentanasHorarias(
              nuevaConfiguracion.ventanasHorarias,
            );

          if (errorVentanas) {
            setError(errorVentanas);
            return false;
          }

          await saveConfiguracion(
            nuevaConfiguracion,
          );

          setConfiguracion(
            nuevaConfiguracion,
          );

          return true;
        } catch (e) {
          console.error(
            'Error guardando configuración:',
            e,
          );

          setError(
            'No fue posible guardar la configuración.',
          );

          return false;
        } finally {
          setSaving(false);
        }
      },
      [validarVentanasHorarias],
    );

  /**
   * ==============================
   * ACTUALIZAR VENTANA
   * ==============================
   */

  const actualizarVentanaHoraria =
    useCallback(
      (
        indice: number,
        ventana: VentanaHoraria,
      ) => {
        setConfiguracion((actual) => {
          if (!actual) {
            return actual;
          }

          const ventanas = [
            ...actual.ventanasHorarias,
          ];

          ventanas[indice] = ventana;

          return {
            ...actual,
            ventanasHorarias: ventanas,
          };
        });
      },
      [],
    );

  /**
   * ==============================
   * AGREGAR VENTANA
   * ==============================
   */

  const agregarVentanaHoraria =
    useCallback(() => {
      setConfiguracion((actual) => {
        if (!actual) {
          return actual;
        }

        const nuevaVentana: VentanaHoraria = {
          label: '21 - 23',
          inicio: '21',
          fin: '23',
        };

        return {
          ...actual,
          ventanasHorarias: [
            ...actual.ventanasHorarias,
            nuevaVentana,
          ],
        };
      });
    }, []);

  /**
   * ==============================
   * ELIMINAR VENTANA
   * ==============================
   */

  const eliminarVentanaHoraria =
    useCallback(
      (indice: number) => {
        setConfiguracion((actual) => {
          if (!actual) {
            return actual;
          }

          const ventanas =
            actual.ventanasHorarias.filter(
              (_, index) =>
                index !== indice,
            );

          return {
            ...actual,
            ventanasHorarias: ventanas,
          };
        });
      },
      [],
    );

  useEffect(() => {
    cargarConfiguracion();
  }, [cargarConfiguracion]);

  return {
    configuracion,

    loading,
    saving,
    error,

    cargarConfiguracion,
    guardarConfiguracion,

    actualizarVentanaHoraria,
    agregarVentanaHoraria,
    eliminarVentanaHoraria,
  };
}