
export interface VentanaHoraria {
  label: string;
  inicio: string;
  fin: string;
}

export interface AseguradoDia {
  monto: number;
  pedidosMinimos: number;
}

export type DiaSemana =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo';

export interface Configuracion {
  pedidoBase: number;
  valorBaseSku: number;
  valorCompensacionKm: number;

  controlarAsegurado: boolean;

  aseguradoPorDia: Record<DiaSemana, AseguradoDia>;

  porcentajeBoleta: number;

  controlarCombustible: boolean;
  precioLitroBencina: number;
  rendimientoKmLitro: number;

  ventanasHorarias: VentanaHoraria[];
}

export const configuracionInicial: Configuracion = {
  pedidoBase: 3200,
  valorBaseSku: 100,
  valorCompensacionKm: 230,

  controlarAsegurado: true,

  aseguradoPorDia: {
    lunes: {
      monto: 35000,
      pedidosMinimos: 0,
    },
    martes: {
      monto: 35000,
      pedidosMinimos: 0,
    },
    miercoles: {
      monto: 35000,
      pedidosMinimos: 0,
    },
    jueves: {
      monto: 35000,
      pedidosMinimos: 0,
    },
    viernes: {
      monto: 35000,
      pedidosMinimos: 0,
    },
    sabado: {
      monto: 35000,
      pedidosMinimos: 0,
    },
    domingo: {
      monto: 40000,
      pedidosMinimos: 0,
    },
  },

  porcentajeBoleta: 12.5,

  controlarCombustible: false,
  precioLitroBencina: 1000,
  rendimientoKmLitro: 10,

  ventanasHorarias: [
    { label: '09 - 11', inicio: '09', fin: '11' },
    { label: '11 - 13', inicio: '11', fin: '13' },
    { label: '13 - 15', inicio: '13', fin: '15' },
    { label: '15 - 17', inicio: '15', fin: '17' },
    { label: '17 - 19', inicio: '17', fin: '19' },
    { label: '19 - 21', inicio: '19', fin: '21' },
  ],
};