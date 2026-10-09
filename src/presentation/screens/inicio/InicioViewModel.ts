
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
  obtenerDias,
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
  Dia,
} from '../../../domain/models/Dia';

import {
  usePedidoViewModel,
} from '../pedidos/PedidoViewModel';

export interface SemanaRegistrada {
  fechaInicio: string;
  fechaFin: string;
  resultado: ResultadoSemanal;
}

function obtenerFechaHoy(): string {
  const hoy = new Date();

  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');

  return `${año}-${mes}-${dia}`;
}

function formatearFecha(fecha: Date): string {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${año}-${mes}-${dia}`;
}

function obtenerInicioSemana(fecha: Date): Date {
  const resultado = new Date(fecha);
  const diaSemana = resultado.getDay();

  const diasDesdeLunes =
    diaSemana === 0 ? 6 : diaSemana - 1;

  resultado.setDate(
    resultado.getDate() - diasDesdeLunes,
  );

  resultado.setHours(0, 0, 0, 0);

  return resultado;
}

function obtenerFinSemana(fecha: Date): Date {
  const resultado = obtenerInicioSemana(fecha);

  resultado.setDate(resultado.getDate() + 6);

  return resultado;
}

function obtenerFechasSemana(fecha: Date): string[] {
  const lunes = obtenerInicioSemana(fecha);
  const fechas: string[] = [];

  for (let i = 0; i < 7; i++) {
    const dia = new Date(lunes);

    dia.setDate(lunes.getDate() + i);

    fechas.push(formatearFecha(dia));
  }

  return fechas;
}

function fechaADate(fecha: string): Date {
  const [año, mes, dia] = fecha.split('-').map(Number);

  return new Date(año, mes - 1, dia);
}

function crearResultadoVacio(
  fecha: string,
): ResultadoDiaSemanal {
  return {
    fecha,
    cantidadPedidos: 0,
    resultado: null,
  };
}

async function calcularResultadoDeDia(
  db: SQLiteDatabase,
  dia: Dia,
): Promise<ResultadoDiaSemanal> {
  const pedidosDia = await obtenerPedidosPorDia(
    db,
    dia.id,
  );

  const bonosPedidoPorPedido: Record<number, BonoPedido[]> = {};

  for (const pedido of pedidosDia) {
    bonosPedidoPorPedido[pedido.id] =
      await obtenerBonosPedido(db, pedido.id);
  }

  const bonosDiaActuales = await obtenerBonosDia(
    db,
    dia.id,
  );

  const resultado: ResultadoDia = calcularDia(
    dia.aseguradoAplicado,
    dia.porcentajeBoletaAplicado,
    pedidosDia,
    bonosPedidoPorPedido,
    bonosDiaActuales,
  );

  return {
    fecha: dia.fecha,
    cantidadPedidos: pedidosDia.length,
    resultado,
  };
}

function crearSemanasRegistradas(
  resultados: ResultadoDiaSemanal[],
): SemanaRegistrada[] {
  const grupos = new Map<string, ResultadoDiaSemanal[]>();

  for (const resultadoDia of resultados) {
    const fecha = fechaADate(resultadoDia.fecha);
    const lunes = formatearFecha(obtenerInicioSemana(fecha));

    const grupo = grupos.get(lunes) ?? [];

    grupo.push(resultadoDia);

    grupos.set(lunes, grupo);
  }

  return Array.from(grupos.entries())
    .map(([fechaInicio, diasRegistrados]) => {
      const fechaLunes = fechaADate(fechaInicio);
      const fechaFin = formatearFecha(
        obtenerFinSemana(fechaLunes),
      );

      const diasPorFecha = new Map(
        diasRegistrados.map((dia) => [dia.fecha, dia]),
      );

      const sieteDias: ResultadoDiaSemanal[] =
        obtenerFechasSemana(fechaLunes).map(
          (fecha) =>
            diasPorFecha.get(fecha) ??
            crearResultadoVacio(fecha),
        );

      return {
        fechaInicio,
        fechaFin,
        resultado: calcularSemana(
          fechaInicio,
          fechaFin,
          sieteDias,
        ),
      };
    })
    .sort((a, b) =>
      b.fechaInicio.localeCompare(a.fechaInicio),
    );
}

export function useInicioViewModel(
  db: SQLiteDatabase,
) {
  const [fecha, setFecha] = useState(obtenerFechaHoy());

  const [
    resultadoSemanal,
    setResultadoSemanal,
  ] = useState<ResultadoSemanal | null>(null);

  const [
    semanasRegistradas,
    setSemanasRegistradas,
  ] = useState<SemanaRegistrada[]>([]);

  const [
    resultadoGeneral,
    setResultadoGeneral,
  ] = useState<ResultadoSemanal | null>(null);

  const [loadingSemana, setLoadingSemana] = useState(false);
  const [loadingGeneral, setLoadingGeneral] = useState(false);

  const [errorSemana, setErrorSemana] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const {
    pedidos,
    bonosDia,
    resultadoDia,
    loading,
    error,
    cargarPedidos,
  } = usePedidoViewModel(db);

  const cargarSemana = useCallback(async () => {
    try {
      setLoadingSemana(true);
      setErrorSemana(null);

      const fechas = obtenerFechasSemana(new Date());

      const resultadosDias: ResultadoDiaSemanal[] = [];

      for (const fechaDia of fechas) {
        const dia = await obtenerDiaPorFecha(db, fechaDia);

        if (!dia) {
          resultadosDias.push(crearResultadoVacio(fechaDia));
          continue;
        }

        resultadosDias.push(
          await calcularResultadoDeDia(db, dia),
        );
      }

      setResultadoSemanal(
        calcularSemana(
          fechas[0],
          fechas[6],
          resultadosDias,
        ),
      );
    } catch (e) {
      console.error('Error cargando semana:', e);

      setErrorSemana(
        'No fue posible cargar el resumen semanal.',
      );
    } finally {
      setLoadingSemana(false);
    }
  }, [db]);

  const cargarGeneral = useCallback(async () => {
    try {
      setLoadingGeneral(true);
      setErrorGeneral(null);

      // Obtiene todos los días guardados, sin excluir
      // fechas pasadas ni futuras.
      const dias = await obtenerDias(db);

      const resultadosDias: ResultadoDiaSemanal[] = [];

      for (const dia of dias) {
        resultadosDias.push(
          await calcularResultadoDeDia(db, dia),
        );
      }

      const semanas = crearSemanasRegistradas(
        resultadosDias,
      );

      setSemanasRegistradas(semanas);

      if (resultadosDias.length === 0) {
        setResultadoGeneral(null);
        return;
      }

      // El total general se calcula directamente a partir
      // de cada día registrado, no sumando semanas.
      const fechasOrdenadas = resultadosDias
        .map((dia) => dia.fecha)
        .sort((a, b) => a.localeCompare(b));

      setResultadoGeneral(
        calcularSemana(
          fechasOrdenadas[0],
          fechasOrdenadas[fechasOrdenadas.length - 1],
          resultadosDias,
        ),
      );
    } catch (e) {
      console.error('Error cargando resumen general:', e);

      setErrorGeneral(
        'No fue posible cargar el resumen general.',
      );
    } finally {
      setLoadingGeneral(false);
    }
  }, [db]);

  const cargarInicio = useCallback(async () => {
    const fechaHoy = obtenerFechaHoy();

    setFecha(fechaHoy);

    await Promise.all([
      cargarPedidos(fechaHoy),
      cargarSemana(),
      cargarGeneral(),
    ]);
  }, [
    cargarPedidos,
    cargarSemana,
    cargarGeneral,
  ]);

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
    resultadoGeneral,
    semanasRegistradas,

    loading,
    loadingSemana,
    loadingGeneral,

    error,
    errorSemana,
    errorGeneral,

    cargarInicio,
    cargarSemana,
    cargarGeneral,
  };
}