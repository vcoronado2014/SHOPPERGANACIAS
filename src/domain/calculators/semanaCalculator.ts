import { ResultadoDia } from './diaCalculator';

export interface ResultadoDiaSemanal {
  fecha: string;
  cantidadPedidos: number;
  resultado: ResultadoDia | null;
}

export interface ResultadoSemanal {
  fechaInicio: string;
  fechaFin: string;

  cantidadPedidos: number;

  brutoPedidos: number;
  asegurado: number;
  ajusteAsegurado: number;

  bonosPedido: number;
  bonosDia: number;

  brutoDia: number;

  kilometros: number;
  combustible: number;
  boleta: number;
  liquido: number;

  dias: ResultadoDiaSemanal[];
}

export function calcularSemana(
  fechaInicio: string,
  fechaFin: string,
  resultadosDias: ResultadoDiaSemanal[],
): ResultadoSemanal {
  let cantidadPedidos = 0;

  let brutoPedidos = 0;
  let asegurado = 0;
  let ajusteAsegurado = 0;

  let bonosPedido = 0;
  let bonosDia = 0;

  let brutoDia = 0;

  let kilometros = 0;
  let combustible = 0;
  let boleta = 0;
  let liquido = 0;

  for (const dia of resultadosDias) {
    cantidadPedidos += dia.cantidadPedidos;

    if (!dia.resultado) {
      continue;
    }

    brutoPedidos += dia.resultado.brutoPedidos;

    asegurado += dia.resultado.asegurado;

    ajusteAsegurado +=
      dia.resultado.ajusteAsegurado;

    bonosPedido +=
      dia.resultado.bonosPedido;

    bonosDia +=
      dia.resultado.bonosDia;

    brutoDia +=
      dia.resultado.brutoDia;

    kilometros +=
      dia.resultado.kilometros;

    combustible +=
      dia.resultado.combustible;

    boleta +=
      dia.resultado.boleta;

    liquido +=
      dia.resultado.liquido;
  }

  return {
    fechaInicio,
    fechaFin,

    cantidadPedidos,

    brutoPedidos,
    asegurado,
    ajusteAsegurado,

    bonosPedido,
    bonosDia,

    brutoDia,

    kilometros,
    combustible,
    boleta,
    liquido,

    dias: resultadosDias,
  };
}