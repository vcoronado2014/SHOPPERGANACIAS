import { Pedido } from '../models/Pedido';
import { BonoPedido, BonoDia } from '../models/Bono';
import { calcularPedido } from './pedidoCalculator';

export interface ResultadoDia {
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
}

export function calcularDia(
  aseguradoAplicado: number,
  porcentajeBoletaAplicado: number,
  pedidos: Pedido[],
  bonosPedidoPorPedido: Record<number, BonoPedido[]>,
  bonosDia: BonoDia[],
): ResultadoDia {
  let brutoPedidos = 0;
  let bonosPedido = 0;
  let kilometros = 0;
  let combustible = 0;

  for (const pedido of pedidos) {
    const bonosDelPedido =
      bonosPedidoPorPedido[pedido.id] ?? [];

    const resultado = calcularPedido(
      pedido,
      bonosDelPedido,
      porcentajeBoletaAplicado,
    );

    brutoPedidos += resultado.bruto;

    // Bonos asociados directamente al pedido.
    bonosPedido += resultado.totalBonos;

    // Los kilómetros se contabilizan siempre,
    // independiente de controlarCombustible.
    kilometros += pedido.kilometros;

    // El gasto de combustible sigue dependiendo
    // de la configuración aplicada al pedido.
    combustible += resultado.combustible;
  }

  const ingresoBase = Math.max(
    brutoPedidos,
    aseguradoAplicado,
  );

  const ajusteAsegurado = Math.max(
    0,
    aseguradoAplicado - brutoPedidos,
  );

  const totalBonosDia = bonosDia.reduce(
    (total, bono) => total + bono.monto,
    0,
  );

  const brutoDia =
    ingresoBase + totalBonosDia;

  const boleta =
    brutoDia *
    (porcentajeBoletaAplicado / 100);

  const liquido =
    brutoDia -
    combustible -
    boleta;

  return {
    brutoPedidos,
    asegurado: aseguradoAplicado,
    ajusteAsegurado,

    bonosPedido,
    bonosDia: totalBonosDia,

    brutoDia,

    kilometros,
    combustible,
    boleta,
    liquido,
  };
}