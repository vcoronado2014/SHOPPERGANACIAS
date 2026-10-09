import { useCallback, useState } from 'react';
import { SQLiteDatabase } from 'expo-sqlite';

import {
  getConfiguracion,
} from '../../../data/storage/appStorage';

import {
  DiaSemana,
} from '../../../domain/models/Configuracion';

import {
  obtenerDiaPorFecha,
  crearDia,
  actualizarAseguradoAplicado,
  obtenerDiaPorId,
  actualizarConfiguracionAsegurado,
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


function obtenerDiaSemana(fecha: string): DiaSemana {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const fechaLocal = new Date(anio, mes - 1, dia);

  const dias: DiaSemana[] = [
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
  ];

  return dias[fechaLocal.getDay()];
}

async function actualizarAseguradoDelDia(
  db: SQLiteDatabase,
  diaId: number,
): Promise<void> {
  const dia = await obtenerDiaPorId(db, diaId);

  if (!dia) {
    throw new Error('No se encontró el día para actualizar el asegurado.');
  }

  const pedidosActuales = await obtenerPedidosPorDia(db, diaId);

  // Si no quedan pedidos, el asegurado aplicado debe ser cero.
  const cumpleMinimo =
    pedidosActuales.length > 0 &&
    (
      dia.pedidosMinimos === 0 ||
      pedidosActuales.length >= dia.pedidosMinimos
    );

  const aseguradoAplicado =
    dia.aseguradoBase > 0 && cumpleMinimo
      ? dia.aseguradoBase
      : 0;

  await actualizarAseguradoAplicado(
    db,
    diaId,
    aseguradoAplicado,
  );
}


function calcularAseguradoAplicado(
  controlarAsegurado: boolean,
  aseguradoBase: number,
  pedidosMinimos: number,
  cantidadPedidos: number,
): number {
  if (!controlarAsegurado) {
    return 0;
  }

  if (
    pedidosMinimos > 0 &&
    cantidadPedidos < pedidosMinimos
  ) {
    return 0;
  }

  return aseguradoBase;
}

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

        if (nuevoPedido.cantidadSku <= 0) {
          const mensaje =
            'Debe ingresar la cantidad de SKU.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        if (nuevoPedido.kilometros <= 0) {
          const mensaje =
            'Debe ingresar los kilómetros.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        const existe = await existeNumeroOrden(
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

        let dia = await obtenerDiaPorFecha(
          db,
          nuevoPedido.fecha,
        );


        // Si el día ya existe, pero no tiene pedidos,
        // actualizamos el asegurado con la configuración vigente.
        if (dia) {
          const pedidosExistentes = await obtenerPedidosPorDia(
            db,
            dia.id,
          );

          if (pedidosExistentes.length === 0) {
            const diaSemana = obtenerDiaSemana(nuevoPedido.fecha);

            const aseguradoConfigurado =
              configuracion.aseguradoPorDia[diaSemana];

            const aseguradoBase = configuracion.controlarAsegurado
              ? aseguradoConfigurado.monto
              : 0;

            const pedidosMinimos = configuracion.controlarAsegurado
              ? aseguradoConfigurado.pedidosMinimos
              : 0;

            await actualizarConfiguracionAsegurado(
              db,
              dia.id,
              aseguradoBase,
              pedidosMinimos,
            );
          }
        }


        // Crear el día solamente si todavía no existe.
        // Los días existentes conservan sus condiciones históricas.
        if (!dia) {
          const diaSemana = obtenerDiaSemana(
            nuevoPedido.fecha,
          );

          const aseguradoConfigurado =
            configuracion.aseguradoPorDia[diaSemana];

          const aseguradoBase =
            configuracion.controlarAsegurado
              ? aseguradoConfigurado.monto
              : 0;

          const pedidosMinimos =
            configuracion.controlarAsegurado
              ? aseguradoConfigurado.pedidosMinimos
              : 0;

          const diaId = await crearDia(db, {
            fecha: nuevoPedido.fecha,
            aseguradoBase,
            pedidosMinimos,
            aseguradoAplicado: 0,
            porcentajeBoletaAplicado:
              configuracion.porcentajeBoleta,
            createdAt: new Date().toISOString(),
          });

          dia = await obtenerDiaPorFecha(
            db,
            nuevoPedido.fecha,
          );

          if (!dia || dia.id !== diaId) {
            throw new Error(
              'No fue posible crear el día.',
            );
          }
        }

        const pedidoId = await crearPedido(db, {
          diaId: dia.id,
          numeroOrden,
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

        // Guardar los bonos asociados al pedido.
        for (const bono of nuevoPedido.bonos) {
          const descripcion =
            bono.descripcion.trim();

          if (
            descripcion === '' ||
            bono.monto <= 0
          ) {
            continue;
          }

          await crearBonoPedido(db, {
            pedidoId,
            descripcion,
            monto: bono.monto,
          });
        }

        // Volver a consultar el día y sus pedidos.
        await actualizarAseguradoDelDia(db, dia.id);

        await cargarPedidos(nuevoPedido.fecha);
        return { ok: true };

        // Actualizar el resumen y los pedidos de la pantalla.
        await cargarPedidos(nuevoPedido.fecha);

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

        // 1. Obtener el pedido actual
        const pedidoActual = await obtenerPedidoPorId(
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

        // 2. Validar el número de orden
        const numeroOrden =
          nuevoPedido.numeroOrden.trim().toUpperCase();

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

        // 3. Actualizar el pedido conservando sus valores históricos
        await actualizarPedido(
          db,
          pedidoId,
          {
            diaId: pedidoActual.diaId,
            numeroOrden,
            fecha: pedidoActual.fecha,
            ventanaInicio: nuevoPedido.ventanaInicio,
            ventanaFin: nuevoPedido.ventanaFin,
            cantidadSku: nuevoPedido.cantidadSku,
            kilometros: nuevoPedido.kilometros,

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

            createdAt: pedidoActual.createdAt,
          },
        );

        // 4. Reemplazar los bonos del pedido
        await eliminarBonosPedido(
          db,
          pedidoId,
        );

        for (const bono of nuevoPedido.bonos) {
          const descripcion = bono.descripcion.trim();

          if (descripcion === '' || bono.monto <= 0) {
            continue;
          }

          await crearBonoPedido(db, {
            pedidoId,
            descripcion,
            monto: bono.monto,
          });
        }

        // 5. Recalcular el asegurado con la cantidad actual de pedidos
        await actualizarAseguradoDelDia(
          db,
          pedidoActual.diaId,
        );

        // 6. Recargar los datos del día
        await cargarPedidos(pedidoActual.fecha);

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

        // Obtener el pedido antes de eliminarlo
        const pedido = await obtenerPedidoPorId(
          db,
          pedidoId,
        );

        if (!pedido) {
          const mensaje = 'No se encontró el pedido.';

          setError(mensaje);

          return {
            ok: false,
            error: mensaje,
          };
        }

        // Eliminar el pedido
        await eliminarPedido(
          db,
          pedidoId,
        );

        // Recalcular el asegurado del día
        await actualizarAseguradoDelDia(
          db,
          pedido.diaId,
        );

        // Actualizar los datos de la pantalla
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
