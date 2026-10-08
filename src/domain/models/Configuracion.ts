export interface VentanaHoraria {
  label: string;
  inicio: string;
  fin: string;
}

export interface Configuracion {
  pedidoBase: number;

  valorBaseSku: number;

  valorCompensacionKm: number;

  aseguradoLunesSabado: number;

  aseguradoDomingo: number;

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

  aseguradoLunesSabado: 35000,

  aseguradoDomingo: 40000,

  porcentajeBoleta: 12.5,

  controlarCombustible: false,

  precioLitroBencina: 1000,

  rendimientoKmLitro: 10,

  ventanasHorarias: [
    {
      label: '09 - 11',
      inicio: '09',
      fin: '11',
    },
    {
      label: '11 - 13',
      inicio: '11',
      fin: '13',
    },
    {
      label: '13 - 15',
      inicio: '13',
      fin: '15',
    },
    {
      label: '15 - 17',
      inicio: '15',
      fin: '17',
    },
    {
      label: '17 - 19',
      inicio: '17',
      fin: '19',
    },
    {
      label: '19 - 21',
      inicio: '19',
      fin: '21',
    },
  ],
};