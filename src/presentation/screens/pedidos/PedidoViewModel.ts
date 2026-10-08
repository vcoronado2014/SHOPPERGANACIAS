import { useCallback, useState } from 'react';
import { SQLiteDatabase } from 'expo-sqlite';

import {
  getConfiguracion,
} from '../../../data/storage/appStorage';

import {
  obtenerDiaPorFecha,
  crearDia,
} from '../../../data/database/repositories/diaRepository';

import {
  crearPedido,
  actualizarPedido,
  obtenerPedidosPorDia,
  eliminarPedido,
  obtenerPedidoPorId,
  existeNumeroOrden,
} from '../../../data/database/repositories/pedidoRepository';

import {
  crearBonoPedido,
  eliminarBonosPedido,
  obtenerBonosPedido,
  obtenerBonosDia,
  crearBonoDia,
  eliminarBonoDia,
} from '../../../data/database/repositories/bonoRepository';

import {
  Pedido,
} from '../../../domain/models/Pedido';

import {
  BonoDia,
  BonoPedido,
} from '../../../domain/models/Bono';

import {
  calcularPedido,
  ResultadoPedido,
} from '../../../domain/calculators/pedidoCalculator';

import { esDomingo } from '../../../utils/dates';

import {
  calcularDia,
  ResultadoDia,
} from '../../../domain/calculators/diaCalculator';

export interface NuevoBonoPedido {
  descripcion: string;
  monto: number;
}

export interface NuevoPedido {
  numeroOrden: string;
  fecha: string;
  ventanaInicio: string;
  ventanaFin: string;
  cantidadSku: number;
  kilometros: number;
  bonos: NuevoBonoPedido[];
}

export interface PedidoConResultado {
  pedido: Pedido;
  bonos: BonoPedido[];
  resultado: ResultadoPedido;
}

export interface ResultadoOperacion {
  ok: boolean;
  error?: string;
}

export function usePedidoViewModel(
  db: SQLiteDatabase,
) {
  const [pedidos, setPedidos] = useState<
    PedidoConResultado[]
  >([]);

  const [bonosDia, setBonosDia] =
    useState<BonoDia[]>([]);

  const [resultadoDia, setResultadoDia] =
    useState<ResultadoDia | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const cargarPedidos = useCallback(
    async (fecha: string) => {
      try {
        setLoading(true);
        setError(null);

        const dia =
          await obtenerDiaPorFecha(
            db,
            fecha,
          );

        if (!dia) {
          setPedidos([]);
          setResultadoDia(null);
          setBonosDia([]);
          return;
        }

        const pedidosDia =
          await obtenerPedidosPorDia(
            db,
            dia.id,
          );

        const bonosPedidoPorPedido: Record<
          number,
          BonoPedido[]
        > = {};

        const resultados: PedidoConResultado[] =
          [];

        for (const pedido of pedidosDia) {
          const bonos =
            await obtenerBonosPedido(
              db,
              pedido.id,
            );

          bonosPedidoPorPedido[pedido.id] =
            bonos;

          const resultado =
            calcularPedido(
              pedido,
              bonos,
              dia.porcentajeBoletaAplicado,
            );

          resultados.push({
            pedido,
            bonos,
            resultado,
          });
        }

        const bonosDiaActuales =
          await obtenerBonosDia(
            db,
            dia.id,
          );

        setBonosDia(
          bonosDiaActuales,
        );

        const resultadoFinal =
          calcularDia(
            dia.aseguradoAplicado,
            dia.porcentajeBoletaAplicado,
            pedidosDia,
            bonosPedidoPorPedido,
            bonosDiaActuales,
          );

        setPedidos(resultados);
        setResultadoDia(
          resultadoFinal,
        );
      } catch (e) {
        console.error(
          'Error cargando pedidos:',
          e,
        );

        const mensaje =
          'No fue posible cargar los pedidos.';

        setError(mensaje);
        setResultadoDia(null);
      } finally {
        setLoading(false);
      }
    },
    [db],
  );

  const guardarPedido = useCallback(
    async (
      nuevoPedido: NuevoPedido,
    ): Promise<ResultadoOperacion> => {
      try {
        setLoading(true);
        setError(null);

        const numeroOrden =
          nuevoPedido.numeroOrden
            .trim()
            .toUpperCase();

        if (!numeroOrden) {
          const mensaje =
            'Debe ingresar el número de orden.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        if (!/^[A-Z0-9]+$/.test(numeroOrden)) {
          const mensaje =
            'El número de orden solo puede contener letras y números.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        if (
          !nuevoPedido.ventanaInicio ||
          !nuevoPedido.ventanaFin
        ) {
          const mensaje =
            'Debe seleccionar una ventana horaria.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        if (
          nuevoPedido.cantidadSku <= 0
        ) {
          const mensaje =
            'Debe ingresar la cantidad de SKU.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        if (
          nuevoPedido.kilometros <= 0
        ) {
          const mensaje =
            'Debe ingresar los kilómetros.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        const existe =
          await existeNumeroOrden(
            db,
            numeroOrden,
          );

        if (existe) {
          const mensaje =
            'Ya existe un pedido con ese número de orden.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        const configuracion =
          await getConfiguracion();

        let dia =
          await obtenerDiaPorFecha(
            db,
            nuevoPedido.fecha,
          );

        if (!dia) {
          const domingo =
            esDomingo(
              nuevoPedido.fecha,
            );

          const aseguradoAplicado =
            domingo
              ? configuracion.aseguradoDomingo
              : configuracion.aseguradoLunesSabado;

          const diaId =
            await crearDia(db, {
              fecha: nuevoPedido.fecha,
              aseguradoAplicado,
              porcentajeBoletaAplicado:
                configuracion.porcentajeBoleta,
              createdAt:
                new Date().toISOString(),
            });

          dia =
            await obtenerDiaPorFecha(
              db,
              nuevoPedido.fecha,
            );

          if (
            !dia ||
            dia.id !== diaId
          ) {
            throw new Error(
              'No fue posible crear el día.',
            );
          }
        }

        const pedidoId =
          await crearPedido(db, {
            diaId: dia.id,
            numeroOrden:
              nuevoPedido.numeroOrden.trim(),
            fecha: nuevoPedido.fecha,
            ventanaInicio:
              nuevoPedido.ventanaInicio,
            ventanaFin:
              nuevoPedido.ventanaFin,
            cantidadSku:
              nuevoPedido.cantidadSku,
            kilometros:
              nuevoPedido.kilometros,
            pedidoBaseAplicado:
              configuracion.pedidoBase,
            valorSkuAplicado:
              configuracion.valorBaseSku,
            valorKmAplicado:
              configuracion.valorCompensacionKm,
            controlarCombustibleAplicado:
              configuracion.controlarCombustible,
            precioLitroBencinaAplicado:
              configuracion.precioLitroBencina,
            rendimientoKmLitroAplicado:
              configuracion.rendimientoKmLitro,
            createdAt:
              new Date().toISOString(),
          });

        for (const bono of nuevoPedido.bonos) {
          if (
            bono.descripcion.trim() === '' ||
            bono.monto <= 0
          ) {
            continue;
          }

          await crearBonoPedido(db, {
            pedidoId,
            descripcion:
              bono.descripcion.trim(),
            monto: bono.monto,
          });
        }

        await cargarPedidos(
          nuevoPedido.fecha,
        );

        return {
          ok: true,
        };
      } catch (e) {
        console.error(
          'Error guardando pedido:',
          e,
        );

        const mensaje =
          'No fue posible guardar el pedido.';

        setError(mensaje);

        return {
          ok: false,
          error: mensaje,
        };
      } finally {
        setLoading(false);
      }
    },
    [db, cargarPedidos],
  );

  const editarPedido = useCallback(
    async (
      pedidoId: number,
      nuevoPedido: NuevoPedido,
    ): Promise<ResultadoOperacion> => {
      try {
        setLoading(true);
        setError(null);

        const pedidoActual =
          await obtenerPedidoPorId(
            db,
            pedidoId,
          );

        if (!pedidoActual) {
          const mensaje =
            'No fue posible encontrar el pedido.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        await actualizarPedido(
          db,
          pedidoId,
          {
            diaId:
              pedidoActual.diaId,

            numeroOrden:
              nuevoPedido.numeroOrden.trim(),

            fecha:
              pedidoActual.fecha,

            ventanaInicio:
              nuevoPedido.ventanaInicio,

            ventanaFin:
              nuevoPedido.ventanaFin,

            cantidadSku:
              nuevoPedido.cantidadSku,

            kilometros:
              nuevoPedido.kilometros,

            pedidoBaseAplicado:
              pedidoActual.pedidoBaseAplicado,

            valorSkuAplicado:
              pedidoActual.valorSkuAplicado,

            valorKmAplicado:
              pedidoActual.valorKmAplicado,

            controlarCombustibleAplicado:
              pedidoActual.controlarCombustibleAplicado,

            precioLitroBencinaAplicado:
              pedidoActual.precioLitroBencinaAplicado,

            rendimientoKmLitroAplicado:
              pedidoActual.rendimientoKmLitroAplicado,

            createdAt:
              pedidoActual.createdAt,
          },
        );

        await eliminarBonosPedido(
          db,
          pedidoId,
        );

        for (
          const bono of nuevoPedido.bonos
        ) {
          if (
            bono.descripcion.trim() === '' ||
            bono.monto <= 0
          ) {
            continue;
          }

          await crearBonoPedido(db, {
            pedidoId,
            descripcion:
              bono.descripcion.trim(),
            monto: bono.monto,
          });
        }

        await cargarPedidos(
          pedidoActual.fecha,
        );

        return {
          ok: true,
        };
      } catch (e) {
        console.error(
          'Error editando pedido:',
          e,
        );

        const mensaje =
          'No fue posible editar el pedido.';

        setError(mensaje);

        return {
          ok: false,
          error: mensaje,
        };
      } finally {
        setLoading(false);
      }
    },
    [db, cargarPedidos],
  );

  const borrarPedido = useCallback(
    async (
      pedidoId: number,
      fecha: string,
    ): Promise<ResultadoOperacion> => {
      try {
        setLoading(true);
        setError(null);

        await eliminarPedido(
          db,
          pedidoId,
        );

        await cargarPedidos(fecha);

        return {
          ok: true,
        };
      } catch (e) {
        console.error(
          'Error eliminando pedido:',
          e,
        );

        const mensaje =
          'No fue posible eliminar el pedido.';

        setError(mensaje);

        return {
          ok: false,
          error: mensaje,
        };
      } finally {
        setLoading(false);
      }
    },
    [db, cargarPedidos],
  );

  const agregarBonoDia = useCallback(
    async (
      fecha: string,
      descripcion: string,
      monto: number,
    ): Promise<ResultadoOperacion> => {
      try {
        setLoading(true);
        setError(null);

        const descripcionLimpia =
          descripcion.trim();

        if (
          descripcionLimpia === '' ||
          monto <= 0
        ) {
          const mensaje =
            'La descripción y el monto del bono son obligatorios.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        const dia =
          await obtenerDiaPorFecha(
            db,
            fecha,
          );

        if (!dia) {
          const mensaje =
            'No existe un día para la fecha seleccionada.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        await crearBonoDia(db, {
          diaId: dia.id,
          descripcion:
            descripcionLimpia,
          monto,
        });

        await cargarPedidos(fecha);

        return {
          ok: true,
        };
      } catch (e) {
        console.error(
          'Error agregando bono del día:',
          e,
        );

        const mensaje =
          'No fue posible agregar el bono del día.';

        setError(mensaje);

        return {
          ok: false,
          error: mensaje,
        };
      } finally {
        setLoading(false);
      }
    },
    [db, cargarPedidos],
  );

  const borrarBonoDia = useCallback(
    async (
      bonoId: number,
      fecha: string,
    ): Promise<ResultadoOperacion> => {
      try {
        setLoading(true);
        setError(null);

        await eliminarBonoDia(
          db,
          bonoId,
        );

        await cargarPedidos(fecha);

        return {
          ok: true,
        };
      } catch (e) {
        console.error(
          'Error eliminando bono del día:',
          e,
        );

        const mensaje =
          'No fue posible eliminar el bono del día.';

        setError(mensaje);

        return {
          ok: false,
          error: mensaje,
        };
      } finally {
        setLoading(false);
      }
    },
    [db, cargarPedidos],
  );

  return {
    pedidos,
    bonosDia,
    resultadoDia,
    loading,
    error,
    cargarPedidos,
    guardarPedido,
    editarPedido,
    borrarPedido,
    agregarBonoDia,
    borrarBonoDia,
  };
}
