export interface Pedido {
  id: number;
  diaId: number;

  numeroOrden: string;
  fecha: string;

  ventanaInicio: string;
  ventanaFin: string;

  cantidadSku: number;
  kilometros: number;

  pedidoBaseAplicado: number;
  valorSkuAplicado: number;
  valorKmAplicado: number;

  controlarCombustibleAplicado: boolean;
  precioLitroBencinaAplicado: number;
  rendimientoKmLitroAplicado: number;

  createdAt: string;
}