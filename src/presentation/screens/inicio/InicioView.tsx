import React from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSQLiteContext } from 'expo-sqlite';

import {
  useTheme,
} from '../../theme/ThemeProvider';

import {
  useInicioViewModel,
} from './InicioViewModel';

import {
  styles,
} from './InicioStyles';

type VistaInicio = 'hoy' | 'semana';

function formatearMonto(
  valor: number,
): string {
  return `$${Math.round(valor).toLocaleString('es-CL')}`;
}

function formatearKilometros(
  valor: number,
): string {
  return `${valor.toLocaleString('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}

function formatearKilometrosPorPedido(
  kilometros: number,
  pedidos: number,
): string {
  if (pedidos <= 0) {
    return '0,0 km';
  }

  const promedio =
    kilometros / pedidos;

  return `${promedio.toLocaleString('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}

function formatearFecha(
  fecha: string,
): string {
  const partes = fecha.split('-');

  if (partes.length !== 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatearRangoSemana(
  fechaInicio: string,
  fechaFin: string,
): string {
  return `${formatearFecha(
    fechaInicio,
  )} al ${formatearFecha(fechaFin)}`;
}

export default function InicioView() {
  const db = useSQLiteContext();

  const theme = useTheme();

  const {
    pedidos,
    resultadoDia,
    resultadoSemanal,
    loading,
    loadingSemana,
    error,
    errorSemana,
  } = useInicioViewModel(db);

  const [
    vista,
    setVista,
  ] = React.useState<VistaInicio>('semana');

  const cargando =
    vista === 'hoy'
      ? loading
      : loadingSemana;

  const mensajeError =
    vista === 'hoy'
      ? error
      : errorSemana;

  const kilometrosHoy =
    resultadoDia?.kilometros ?? 0;

  const pedidosHoy =
    pedidos.length;

  const kilometrosPorPedidoHoy =
    formatearKilometrosPorPedido(
      kilometrosHoy,
      pedidosHoy,
    );

  const kilometrosSemana =
    resultadoSemanal?.kilometros ?? 0;

  const pedidosSemana =
    resultadoSemanal?.cantidadPedidos ?? 0;

  const kilometrosPorPedidoSemana =
    formatearKilometrosPorPedido(
      kilometrosSemana,
      pedidosSemana,
    );

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
      contentContainerStyle={
        styles.content
      }
    >
      <View
        style={[
          styles.selector,
          {
            backgroundColor:
              theme.colors.surface,
            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() =>
            setVista('hoy')
          }
          style={[
            styles.selectorItem,
            vista === 'hoy' && {
              backgroundColor:
                theme.colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.selectorText,
              {
                color:
                  vista === 'hoy'
                    ? theme.colors.onPrimary
                    : theme.colors.muted,
              },
            ]}
          >
            Hoy
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setVista('semana')
          }
          style={[
            styles.selectorItem,
            vista === 'semana' && {
              backgroundColor:
                theme.colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.selectorText,
              {
                color:
                  vista === 'semana'
                    ? theme.colors.onPrimary
                    : theme.colors.muted,
              },
            ]}
          >
            Semana
          </Text>
        </Pressable>
      </View>

      {cargando ? (
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color={
              theme.colors.primary
            }
          />
        </View>
      ) : mensajeError ? (
        <View
          style={[
            styles.errorCard,
            {
              backgroundColor:
                theme.colors.surface,
              borderColor:
                theme.colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.errorText,
              {
                color:
                  theme.colors.danger,
              },
            ]}
          >
            {mensajeError}
          </Text>
        </View>
      ) : vista === 'hoy' ? (
        <>
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor:
                  theme.colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.heroLabel,
                {
                  color:
                    theme.colors.onPrimary,
                },
              ]}
            >
              Líquido estimado
            </Text>

            <Text
              style={[
                styles.heroAmount,
                {
                  color:
                    theme.colors.onPrimary,
                },
              ]}
            >
              {formatearMonto(
                resultadoDia?.liquido ?? 0,
              )}
            </Text>

            <Text
              style={[
                styles.heroSubtext,
                {
                  color:
                    theme.colors.onPrimary,
                },
              ]}
            >
              Resultado del día
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Pedidos
              </Text>

              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {pedidosHoy}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Kilómetros
              </Text>

              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearKilometros(
                  kilometrosHoy,
                )}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Bruto
              </Text>

              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoDia?.brutoDia ?? 0,
                )}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.averageCard,
              {
                backgroundColor:
                  theme.colors.surface,
                borderColor:
                  theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              Distancia promedio
            </Text>

            <Text
              style={[
                styles.averageValue,
                {
                  color:
                    theme.colors.primary,
                },
              ]}
            >
              {kilometrosPorPedidoHoy}
            </Text>

            <Text
              style={[
                styles.averageDescription,
                {
                  color:
                    theme.colors.muted,
                },
              ]}
            >
              por pedido
            </Text>
          </View>

          <View
            style={[
              styles.detailCard,
              {
                backgroundColor:
                  theme.colors.surface,
                borderColor:
                  theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              Resumen del día
            </Text>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Bruto pedidos
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoDia?.brutoPedidos ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Asegurado
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoDia?.asegurado ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Ajuste asegurado
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoDia?.ajusteAsegurado ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Bonos del día
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoDia?.bonosDia ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Combustible
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoDia?.combustible ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Boleta
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoDia?.boleta ?? 0,
                )}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <View
            style={[
              styles.periodCard,
              {
                backgroundColor:
                  theme.colors.surface,
                borderColor:
                  theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.periodLabel,
                {
                  color:
                    theme.colors.muted,
                },
              ]}
            >
              Semana
            </Text>

            <Text
              style={[
                styles.periodValue,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              {resultadoSemanal
                ? formatearRangoSemana(
                    resultadoSemanal.fechaInicio,
                    resultadoSemanal.fechaFin,
                  )
                : '-'}
            </Text>
          </View>

          <View
            style={[
              styles.heroCard,
              {
                backgroundColor:
                  theme.colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.heroLabel,
                {
                  color:
                    theme.colors.onPrimary,
                },
              ]}
            >
              Líquido semanal
            </Text>

            <Text
              style={[
                styles.heroAmount,
                {
                  color:
                    theme.colors.onPrimary,
                },
              ]}
            >
              {formatearMonto(
                resultadoSemanal?.liquido ?? 0,
              )}
            </Text>

            <Text
              style={[
                styles.heroSubtext,
                {
                  color:
                    theme.colors.onPrimary,
                },
              ]}
            >
              Lunes a domingo
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Pedidos
              </Text>

              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {pedidosSemana}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Kilómetros
              </Text>

              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearKilometros(
                  kilometrosSemana,
                )}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Bruto
              </Text>

              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoSemanal?.brutoDia ?? 0,
                )}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.averageCard,
              {
                backgroundColor:
                  theme.colors.surface,
                borderColor:
                  theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              Distancia promedio
            </Text>

            <Text
              style={[
                styles.averageValue,
                {
                  color:
                    theme.colors.primary,
                },
              ]}
            >
              {kilometrosPorPedidoSemana}
            </Text>

            <Text
              style={[
                styles.averageDescription,
                {
                  color:
                    theme.colors.muted,
                },
              ]}
            >
              por pedido
            </Text>
          </View>

          <View
            style={[
              styles.detailCard,
              {
                backgroundColor:
                  theme.colors.surface,
                borderColor:
                  theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              Resumen semanal
            </Text>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Bruto pedidos
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoSemanal?.brutoPedidos ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Asegurado acumulado
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoSemanal?.asegurado ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Ajuste asegurado
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoSemanal?.ajusteAsegurado ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Bonos
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoSemanal?.bonosDia ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Combustible
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoSemanal?.combustible ?? 0,
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color:
                      theme.colors.muted,
                  },
                ]}
              >
                Boleta
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {formatearMonto(
                  resultadoSemanal?.boleta ?? 0,
                )}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.detailCard,
              {
                backgroundColor:
                  theme.colors.surface,
                borderColor:
                  theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              Detalle por día
            </Text>

            {resultadoSemanal?.dias.map(
              (dia) => (
                <View
                  key={dia.fecha}
                  style={styles.dayRow}
                >
                  <View
                    style={
                      styles.dayInfo
                    }
                  >
                    <Text
                      style={[
                        styles.dayDate,
                        {
                          color:
                            theme.colors.text,
                        },
                      ]}
                    >
                      {formatearFecha(
                        dia.fecha,
                      )}
                    </Text>

                    <Text
                      style={[
                        styles.dayOrders,
                        {
                          color:
                            theme.colors.muted,
                        },
                      ]}
                    >
                      {dia.cantidadPedidos}{' '}
                      {dia.cantidadPedidos === 1
                        ? 'pedido'
                        : 'pedidos'}{' '}
                      ·{' '}
                      {formatearKilometros(
                        dia.resultado
                          ?.kilometros ?? 0,
                      )}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.dayAmount,
                      {
                        color:
                          theme.colors.primary,
                      },
                    ]}
                  >
                    {formatearMonto(
                      dia.resultado
                        ?.liquido ?? 0,
                    )}
                  </Text>
                </View>
              ),
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}



