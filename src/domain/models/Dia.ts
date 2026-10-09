
export interface Dia {
  id: number;
  fecha: string;

  // Condiciones históricas del asegurado.
  aseguradoBase: number;
  pedidosMinimos: number;

  // Valores aplicados al día.
  aseguradoAplicado: number;
  porcentajeBoletaAplicado: number;

  createdAt: string;
}