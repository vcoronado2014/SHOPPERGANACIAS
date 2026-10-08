import React, { useState } from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

import { crearGananciasStyles } from '../GananciasStyles';

import {
  DiaGanancias,
} from '../GananciasViewModel';

import { ResumenDiario } from './ResumenDiario';

interface ResumenSemanalProps {
  datosDias: DiaGanancias[];
}

function formatearPesos(valor: number): string {
  return `$${Math.round(valor).toLocaleString('es-CL')}`;
}

function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-');

  return `${day}/${month}/${year}`;
}

function obtenerNombreDia(fecha: string): string {
  const [year, month, day] = fecha
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

  return nombres[date.getDay()];
}

export function ResumenSemanal({
  datosDias,
}: ResumenSemanalProps) {
  const theme = useTheme();

  const styles =
    crearGananciasStyles(theme);

  const [
    fechaSeleccionada,
    setFechaSeleccionada,
  ] = useState<string | null>(null);

  const seleccionarDia = (
    fecha: string,
  ) => {
    if (fechaSeleccionada === fecha) {
      setFechaSeleccionada(null);
      return;
    }

    setFechaSeleccionada(fecha);
  };

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.seccionTitulo}>
        Detalle de la semana
      </Text>

      {datosDias.length === 0 ? (
        <Text style={styles.mensajeVacio}>
          No hay información disponible.
        </Text>
      ) : (
        datosDias.map((dia, index) => {
          const seleccionado =
            fechaSeleccionada === dia.fecha;

          const resultado =
            dia.resultado;

          const esUltimo =
            index === datosDias.length - 1;

          return (
            <React.Fragment key={dia.fecha}>

              {/* FILA DEL DÍA */}
              <Pressable
                onPress={() =>
                  seleccionarDia(dia.fecha)
                }
                style={({ pressed }) => [
                  styles.diaFila,
                  pressed && {
                    opacity: 0.7,
                  },
                ]}
              >

                {/* COLUMNA IZQUIERDA */}
                <View
                  style={styles.diaColumnaIzquierda}
                >
                  <View
                    style={styles.diaCabecera}
                  >
                    <Text
                      style={styles.diaNombre}
                    >
                      {obtenerNombreDia(
                        dia.fecha,
                      )}
                    </Text>

                    <Text
                      style={styles.diaFecha}
                    >
                      {formatearFecha(
                        dia.fecha,
                      )}
                    </Text>
                  </View>

                  {resultado ? (
                    <Text
                      style={styles.diaDetalle}
                    >
                      {dia.pedidos.length}{' '}
                      {dia.pedidos.length === 1
                        ? 'pedido'
                        : 'pedidos'}
                      {' • '}
                      Bruto:{' '}
                      {formatearPesos(
                        resultado.brutoDia,
                      )}
                    </Text>
                  ) : (
                    <Text
                      style={styles.diaDetalle}
                    >
                      Sin actividad
                    </Text>
                  )}
                </View>

                {/* COLUMNA DERECHA */}
                <View
                  style={styles.diaColumnaDerecha}
                >
                  <View
                    style={styles.diaMontoFila}
                  >
                    {resultado ? (
                      <Text
                        style={styles.diaMonto}
                      >
                        {formatearPesos(
                          resultado.liquido,
                        )}
                      </Text>
                    ) : (
                      <Text
                        style={styles.diaDetalle}
                      >
                        —
                      </Text>
                    )}

                    <Text
                      style={styles.flechaDia}
                    >
                      {seleccionado
                        ? '▲'
                        : '▼'}
                    </Text>
                  </View>
                </View>
              </Pressable>

              {/* RESUMEN DEL DÍA */}
              {seleccionado && (
                <View
                  style={styles.detalleDiaExpandido}
                >
                  <ResumenDiario
                    fecha={dia.fecha}
                    pedidos={dia.pedidos}
                    bonosDia={dia.bonosDia}
                    resultado={dia.resultado}
                  />
                </View>
              )}

              {/* SEPARADOR */}
              {!esUltimo && (
                <View
                  style={styles.separador}
                />
              )}
            </React.Fragment>
          );
        })
      )}
    </View>
  );
}

