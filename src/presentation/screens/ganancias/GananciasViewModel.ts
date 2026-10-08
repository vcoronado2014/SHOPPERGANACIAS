import { useCallback, useState } from 'react';
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
  Pedido,
} from '../../../domain/models/Pedido';

import {
  BonoDia,
  BonoPedido,
} from '../../../domain/models/Bono';

import {
  calcularDia,
  ResultadoDia,
} from '../../../domain/calculators/diaCalculator';

import {
  calcularSemana,
  ResultadoDiaSemanal,
  ResultadoSemanal,
} from '../../../domain/calculators/semanaCalculator';


export interface PedidoGanancias {
  pedido: Pedido;
  bonos: BonoPedido[];
}

export interface DiaGanancias {
  fecha: string;
  porcentajeBoletaAplicado: number;
  pedidos: PedidoGanancias[];
  bonosDia: BonoDia[];
  resultado: ResultadoDia | null;
}


function crearFecha(
  fecha: string,
): Date {
  const [year, month, day] =
    fecha.split('-').map(Number);

  return new Date(
    year,
    month - 1,
    day,
  );
}


function formatearFecha(
  fecha: Date,
): string {
  const year =
    fecha.getFullYear();

  const month =
    String(
      fecha.getMonth() + 1,
    ).padStart(2, '0');

  const day =
    String(
      fecha.getDate(),
    ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


function obtenerLunesSemana(
  fecha: string,
): string {
  const date =
    crearFecha(fecha);

  const diaSemana =
    date.getDay();

  const diferencia =
    diaSemana === 0
      ? -6
      : 1 - diaSemana;

  date.setDate(
    date.getDate() + diferencia,
  );

  return formatearFecha(date);
}


function obtenerDomingoSemana(
  fechaInicio: string,
): string {
  const date =
    crearFecha(fechaInicio);

  date.setDate(
    date.getDate() + 6,
  );

  return formatearFecha(date);
}


function obtenerFechasSemana(
  fechaInicio: string,
): string[] {
  const inicio =
    crearFecha(fechaInicio);

  const fechas: string[] = [];

  for (let i = 0; i < 7; i++) {
    const fecha =
      new Date(inicio);

    fecha.setDate(
      inicio.getDate() + i,
    );

    fechas.push(
      formatearFecha(fecha),
    );
  }

  return fechas;
}


export function useGananciasViewModel(
  db: SQLiteDatabase,
) {
  const [
    fechaSemana,
    setFechaSemana,
  ] = useState<string>(
    obtenerLunesSemana(
      formatearFecha(new Date()),
    ),
  );

  const [
    dias,
    setDias,
  ] = useState<DiaGanancias[]>([]);

  const [
    resultadoSemana,
    setResultadoSemana,
  ] =
    useState<ResultadoSemanal | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(null);


  const cargarSemana =
    useCallback(
      async (
        fechaInicio: string,
      ) => {
        try {
          setLoading(true);
          setError(null);

          const fechas =
            obtenerFechasSemana(
              fechaInicio,
            );

          const diasCargados:
            DiaGanancias[] = [];

          const resultadosDias:
            ResultadoDiaSemanal[] = [];

          for (
            const fecha of fechas
          ) {
            const dia =
              await obtenerDiaPorFecha(
                db,
                fecha,
              );

            if (!dia) {
                diasCargados.push({
                fecha,
                porcentajeBoletaAplicado: 0,
                pedidos: [],
                bonosDia: [],
                resultado: null,
                });

              resultadosDias.push({
                fecha,
                cantidadPedidos: 0,
                resultado: null,
              });

              continue;
            }

            const pedidos =
              await obtenerPedidosPorDia(
                db,
                dia.id,
              );

            const bonosPedidoPorPedido:
              Record<
                number,
                BonoPedido[]
              > = {};

            const pedidosGanancias:
              PedidoGanancias[] = [];

            for (
              const pedido of pedidos
            ) {
              const bonos =
                await obtenerBonosPedido(
                  db,
                  pedido.id,
                );

              bonosPedidoPorPedido[
                pedido.id
              ] = bonos;

              pedidosGanancias.push({
                pedido,
                bonos,
              });
            }

            const bonosDia =
              await obtenerBonosDia(
                db,
                dia.id,
              );

            const resultado =
              calcularDia(
                dia.aseguradoAplicado,
                dia.porcentajeBoletaAplicado,
                pedidos,
                bonosPedidoPorPedido,
                bonosDia,
              );

              diasCargados.push({
                  fecha,
                  porcentajeBoletaAplicado:
                      dia.porcentajeBoletaAplicado,
                  pedidos: pedidosGanancias,
                  bonosDia,
                  resultado,
              });

            resultadosDias.push({
              fecha,
              cantidadPedidos:
                pedidos.length,
              resultado,
            });
          }

          const fechaFin =
            obtenerDomingoSemana(
              fechaInicio,
            );

          const resultado =
            calcularSemana(
              fechaInicio,
              fechaFin,
              resultadosDias,
            );

          setDias(
            diasCargados,
          );

          setResultadoSemana(
            resultado,
          );

          setFechaSemana(
            fechaInicio,
          );
        } catch (e) {
          console.error(
            'Error cargando ganancias:',
            e,
          );

          setError(
            'No fue posible cargar las ganancias.',
          );

          setDias([]);
          setResultadoSemana(null);
        } finally {
          setLoading(false);
        }
      },
      [db],
    );


  const cargarSemanaActual =
    useCallback(
      async () => {
        const hoy =
          formatearFecha(
            new Date(),
          );

        const lunes =
          obtenerLunesSemana(hoy);

        await cargarSemana(
          lunes,
        );
      },
      [cargarSemana],
    );


  const irSemanaAnterior =
    useCallback(
      async () => {
        const date =
          crearFecha(fechaSemana);

        date.setDate(
          date.getDate() - 7,
        );

        await cargarSemana(
          formatearFecha(date),
        );
      },
      [
        fechaSemana,
        cargarSemana,
      ],
    );


  const irSemanaSiguiente =
    useCallback(
      async () => {
        const date =
          crearFecha(fechaSemana);

        date.setDate(
          date.getDate() + 7,
        );

        await cargarSemana(
          formatearFecha(date),
        );
      },
      [
        fechaSemana,
        cargarSemana,
      ],
    );


  return {
    fechaSemana,
    dias,
    resultadoSemana,
    loading,
    error,

    cargarSemana,
    cargarSemanaActual,

    irSemanaAnterior,
    irSemanaSiguiente,
  };
}

