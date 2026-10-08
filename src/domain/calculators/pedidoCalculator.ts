import { Configuracion } from '../models/Configuracion';
import { Pedido } from '../models/Pedido';
import { BonoPedido } from '../models/Bono';

export interface ResultadoPedido {
  bruto: number;
  combustible: number;
  boleta: number;
  liquidoEstimado: number;
  totalBonos: number;
}

export function calcularPedido(
  pedido: Pedido,
  bonos: BonoPedido[],
  porcentajeBoleta: number,
): ResultadoPedido {
  const totalBonos = bonos.reduce(
    (total, bono) => total + bono.monto,
    0,
  );

  const bruto =
    pedido.pedidoBaseAplicado +
    pedido.cantidadSku * pedido.valorSkuAplicado +
    pedido.kilometros * pedido.valorKmAplicado +
    totalBonos;

  let combustible = 0;

  if (
    pedido.controlarCombustibleAplicado &&
    pedido.rendimientoKmLitroAplicado > 0
  ) {
    const litros =
      pedido.kilometros /
      pedido.rendimientoKmLitroAplicado;

    combustible =
      litros *
      pedido.precioLitroBencinaAplicado;
  }

  const boleta =
    bruto * (porcentajeBoleta / 100);

  const liquidoEstimado =
    bruto -
    combustible -
    boleta;

  return {
    bruto,
    combustible,
    boleta,
    liquidoEstimado,
    totalBonos,
  };
}