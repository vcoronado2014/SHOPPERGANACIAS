import {
  useCallback,
  useState,
} from 'react';

import {
  useFocusEffect,
} from 'expo-router';

import { SQLiteDatabase } from 'expo-sqlite';

import {
  obtenerDiaPorFecha,
} from '../../../data/database/repositories/diaRepository';

import {
  obtenerPedidosPorDia,
} from '../../../data/database/repositories/pedidoRepository';

import {
  obtenerBonosPedido,
  obtenerBonosDia,
} from '../../../data/database/repositories/bonoRepository';

import {
  calcularDia,
  ResultadoDia,
} from '../../../domain/calculators/diaCalculator';

import {
  calcularSemana,
  ResultadoSemanal,
  ResultadoDiaSemanal,
} from '../../../domain/calculators/semanaCalculator';

import {
  BonoPedido,
} from '../../../domain/models/Bono';

import {
  usePedidoViewModel,
} from '../pedidos/PedidoViewModel';

function obtenerFechaHoy(): string {
  const hoy = new Date();

  const año = hoy.getFullYear();

  const mes = String(
    hoy.getMonth() + 1,
  ).padStart(2, '0');

  const dia = String(
    hoy.getDate(),
  ).padStart(2, '0');

  return `${año}-${mes}-${dia}`;
}

function formatearFecha(
  fecha: Date,
): string {
  const año = fecha.getFullYear();

  const mes = String(
    fecha.getMonth() + 1,
  ).padStart(2, '0');

  const dia = String(
    fecha.getDate(),
  ).padStart(2, '0');

  return `${año}-${mes}-${dia}`;
}

function obtenerInicioSemana(
  fecha: Date,
): Date {
  const resultado = new Date(fecha);

  const diaSemana = resultado.getDay();

  /*
   * JavaScript:
   * domingo = 0
   * lunes = 1
   * ...
   * sábado = 6
   *
   * Queremos que la semana comience el lunes.
   */
  const diasDesdeLunes =
    diaSemana === 0
      ? 6
      : diaSemana - 1;

  resultado.setDate(
    resultado.getDate() - diasDesdeLunes,
  );

  return resultado;
}

function obtenerFechasSemana(
  fecha: Date,
): string[] {
  const lunes =
    obtenerInicioSemana(fecha);

  const fechas: string[] = [];

  for (let i = 0; i < 7; i++) {
    const dia = new Date(lunes);

    dia.setDate(
      lunes.getDate() + i,
    );

    fechas.push(
      formatearFecha(dia),
    );
  }

  return fechas;
}

export function useInicioViewModel(
  db: SQLiteDatabase,
) {
  const [fecha, setFecha] = useState(
    obtenerFechaHoy(),
  );

  const [
    resultadoSemanal,
    setResultadoSemanal,
  ] = useState<ResultadoSemanal | null>(
    null,
  );

  const [
    loadingSemana,
    setLoadingSemana,
  ] = useState(false);

  const [
    errorSemana,
    setErrorSemana,
  ] = useState<string | null>(
    null,
  );

  const {
    pedidos,
    bonosDia,
    resultadoDia,
    loading,
    error,
    cargarPedidos,
  } = usePedidoViewModel(db);

  const cargarSemana =
    useCallback(
      async () => {
        try {
          setLoadingSemana(true);
          setErrorSemana(null);

          const hoy = new Date();

          const fechas =
            obtenerFechasSemana(hoy);

          const resultadosDias:
            ResultadoDiaSemanal[] = [];

          for (const fechaDia of fechas) {
            const dia =
              await obtenerDiaPorFecha(
                db,
                fechaDia,
              );

            /*
             * Si todavía no existe el día,
             * agregamos igualmente el día
             * a la semana, pero sin resultado.
             */
            if (!dia) {
              resultadosDias.push({
                fecha: fechaDia,
                cantidadPedidos: 0,
                resultado: null,
              });

              continue;
            }

            const pedidosDia =
              await obtenerPedidosPorDia(
                db,
                dia.id,
              );

              const bonosPedidoPorPedido:
                  Record<number, BonoPedido[]> = {};

            for (
              const pedido of pedidosDia
            ) {
              bonosPedidoPorPedido[
                pedido.id
              ] =
                await obtenerBonosPedido(
                  db,
                  pedido.id,
                );
            }

            const bonosDiaActuales =
              await obtenerBonosDia(
                db,
                dia.id,
              );

            const resultado:
              ResultadoDia =
                calcularDia(
                  dia.aseguradoAplicado,
                  dia.porcentajeBoletaAplicado,
                  pedidosDia,
                  bonosPedidoPorPedido,
                  bonosDiaActuales,
                );

            resultadosDias.push({
              fecha: fechaDia,
              cantidadPedidos:
                pedidosDia.length,
              resultado,
            });
          }

          const resultado =
            calcularSemana(
              fechas[0],
              fechas[6],
              resultadosDias,
            );

          setResultadoSemanal(
            resultado,
          );
        } catch (e) {
          console.error(
            'Error cargando semana:',
            e,
          );

          setErrorSemana(
            'No fue posible cargar el resumen semanal.',
          );
        } finally {
          setLoadingSemana(false);
        }
      },
      [db],
    );

  const cargarInicio =
    useCallback(
      async () => {
        const fechaHoy =
          obtenerFechaHoy();

        setFecha(fechaHoy);

        await Promise.all([
          cargarPedidos(fechaHoy),
          cargarSemana(),
        ]);
      },
      [
        cargarPedidos,
        cargarSemana,
      ],
    );

    useFocusEffect(
    useCallback(() => {
        cargarInicio();
    }, [cargarInicio]),
    );

  return {
    fecha,

    pedidos,
    bonosDia,
    resultadoDia,

    resultadoSemanal,

    loading,
    loadingSemana,

    error,
    errorSemana,

    cargarInicio,
    cargarSemana,
  };
}