import * as XLSX from 'xlsx';

import {
  File,
  Paths,
} from 'expo-file-system';

import * as Sharing from 'expo-sharing';

import {
  DiaGanancias,
} from '../../presentation/screens/ganancias/GananciasViewModel';

import {
  ResultadoSemanal,
} from '../../domain/calculators/semanaCalculator';

import {
  calcularPedido,
} from '../../domain/calculators/pedidoCalculator';

function formatearFecha(
  fecha: string,
): string {
  const [
    year,
    month,
    day,
  ] = fecha.split('-');

  return `${day}/${month}/${year}`;
}

function obtenerNombreDia(
  fecha: string,
): string {
  const [
    year,
    month,
    day,
  ] = fecha
    .split('-')
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
  );

  const nombres = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  return nombres[
    date.getDay()
  ];
}

function formatearVentana(
  inicio: string,
  fin: string,
): string {
  return `${inicio} - ${fin}`;
}

export async function exportarGananciasExcel(
  fechaInicio: string,
  fechaFin: string,
  datosDias: DiaGanancias[],
  resultadoSemana: ResultadoSemanal,
): Promise<string> {
  const filasPedidos:
    Record<string, unknown>[] = [];

  for (const dia of datosDias) {
    for (const item of dia.pedidos) {
      const pedido = item.pedido;

      const resultadoPedido =
        calcularPedido(
          pedido,
          item.bonos,
          dia.porcentajeBoletaAplicado,
        );

      filasPedidos.push({
        Fecha: formatearFecha(
          dia.fecha,
        ),

        Día: obtenerNombreDia(
          dia.fecha,
        ),

        'N° Orden':
          pedido.numeroOrden,

        Ventana:
          formatearVentana(
            pedido.ventanaInicio,
            pedido.ventanaFin,
          ),

        'Cantidad SKU':
          pedido.cantidadSku,

        'Kilómetros':
          pedido.kilometros,

        'Bonos Pedido':
          Math.round(
            resultadoPedido.totalBonos,
          ),

        'Bruto Pedido':
          Math.round(
            resultadoPedido.bruto,
          ),

        '% Boleta':
          dia.porcentajeBoletaAplicado,

        Boleta:
          Math.round(
            resultadoPedido.boleta,
          ),

        Líquido:
          Math.round(
            resultadoPedido.liquidoEstimado,
          ),
      });
    }
  }

  const hojaPedidos =
    XLSX.utils.json_to_sheet(
      filasPedidos,
    );

  hojaPedidos['!cols'] = [
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 15 },
    { wch: 13 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 13 },
    { wch: 15 },
  ];

  const filasDiarias =
    datosDias.map((dia) => {
      const resultado =
        dia.resultado;

      return {
        Fecha:
          formatearFecha(
            dia.fecha,
          ),

        Día:
          obtenerNombreDia(
            dia.fecha,
          ),

        Pedidos:
          dia.pedidos.length,

        Kilómetros:
          resultado?.kilometros ?? 0,

        'Bruto Pedidos':
          Math.round(
            resultado?.brutoPedidos ?? 0,
          ),

        Asegurado:
          Math.round(
            resultado?.asegurado ?? 0,
          ),

        'Ajuste Asegurado':
          Math.round(
            resultado?.ajusteAsegurado ?? 0,
          ),

        'Bonos Día':
          Math.round(
            resultado?.bonosDia ?? 0,
          ),

        'Bruto Día':
          Math.round(
            resultado?.brutoDia ?? 0,
          ),

        Boleta:
          Math.round(
            resultado?.boleta ?? 0,
          ),

        Líquido:
          Math.round(
            resultado?.liquido ?? 0,
          ),
      };
    });

  const hojaResumenDiario =
    XLSX.utils.json_to_sheet(
      filasDiarias,
    );

  hojaResumenDiario['!cols'] = [
    { wch: 12 },
    { wch: 14 },
    { wch: 10 },
    { wch: 13 },
    { wch: 16 },
    { wch: 14 },
    { wch: 19 },
    { wch: 13 },
    { wch: 14 },
    { wch: 13 },
    { wch: 15 },
  ];

  const filasSemana = [
    {
      'Semana Desde':
        formatearFecha(
          resultadoSemana.fechaInicio,
        ),

      'Semana Hasta':
        formatearFecha(
          resultadoSemana.fechaFin,
        ),

      'Total Pedidos':
        resultadoSemana.cantidadPedidos,

      'Total Kilómetros':
        resultadoSemana.kilometros,

      'Bruto Pedidos':
        Math.round(
          resultadoSemana.brutoPedidos,
        ),

      Asegurado:
        Math.round(
          resultadoSemana.asegurado,
        ),

      'Ajuste Asegurado':
        Math.round(
          resultadoSemana.ajusteAsegurado,
        ),

      'Bonos Pedido':
        Math.round(
          resultadoSemana.bonosPedido,
        ),

      'Bonos Día':
        Math.round(
          resultadoSemana.bonosDia,
        ),

      'Bruto Total':
        Math.round(
          resultadoSemana.brutoDia,
        ),

      Boleta:
        Math.round(
          resultadoSemana.boleta,
        ),

      'Líquido Estimado':
        Math.round(
          resultadoSemana.liquido,
        ),
    },
  ];

  const hojaResumenSemana =
    XLSX.utils.json_to_sheet(
      filasSemana,
    );

  hojaResumenSemana['!cols'] = [
    { wch: 16 },
    { wch: 16 },
    { wch: 15 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 },
    { wch: 19 },
    { wch: 15 },
    { wch: 13 },
    { wch: 15 },
    { wch: 13 },
    { wch: 18 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    hojaPedidos,
    'Pedidos',
  );

  XLSX.utils.book_append_sheet(
    workbook,
    hojaResumenDiario,
    'Resumen Diario',
  );

  XLSX.utils.book_append_sheet(
    workbook,
    hojaResumenSemana,
    'Resumen Semana',
  );

  /*
   * Generamos el XLSX como base64.
   */
  const contenido =
    XLSX.write(workbook, {
      type: 'base64',
      bookType: 'xlsx',
    });

  const nombreArchivo =
    `ShopperGanancias_${fechaInicio}_${fechaFin}.xlsx`;

  /*
   * Expo 55 utiliza la nueva API
   * de expo-file-system.
   */
  const archivo = new File(
    Paths.document,
    nombreArchivo,
  );

  /*
   * Convertimos base64 a bytes.
   */
  const bytes =
    Uint8Array.from(
      globalThis.atob(contenido),
      (char) =>
        char.charCodeAt(0),
    );

  archivo.write(bytes);

  const uri =
    archivo.uri;

  const disponible =
    await Sharing.isAvailableAsync();

  if (!disponible) {
    return uri;
  }

  await Sharing.shareAsync(
    uri,
    {
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

      dialogTitle:
        'Compartir ganancias',
    },
  );

  return uri;
}