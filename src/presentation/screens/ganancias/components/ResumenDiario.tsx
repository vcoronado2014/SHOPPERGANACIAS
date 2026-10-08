import React from 'react';

import {
  Text,
  View,
} from 'react-native';

import {
  ResultadoDia,
} from '../../../../domain/calculators/diaCalculator';

import {
  PedidoGanancias,
} from '../GananciasViewModel';

import {
  BonoDia,
} from '../../../../domain/models/Bono';

import { useTheme } from '../../../theme/ThemeProvider';

import { crearGananciasStyles } from '../GananciasStyles';

interface ResumenDiarioProps {
  fecha: string;
  pedidos: PedidoGanancias[];
  bonosDia: BonoDia[];
  resultado: ResultadoDia | null;
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

export function ResumenDiario({
  fecha,
  pedidos,
  bonosDia,
  resultado,
}: ResumenDiarioProps) {
  const theme = useTheme();
  const styles = crearGananciasStyles(theme);

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.seccionTitulo}>
        {obtenerNombreDia(fecha)}
      </Text>

      <Text style={styles.subtitulo}>
        {formatearFecha(fecha)}
      </Text>

      {!resultado ? (
        <Text style={styles.mensajeVacio}>
          No hay actividad registrada para este día.
        </Text>
      ) : (
        <>
          <View style={styles.filaResumen}>
            <View style={styles.resumenItem}>
              <View style={styles.resumenItemInterno}>
                <Text style={styles.etiqueta}>
                  Pedidos
                </Text>

                <Text style={styles.valor}>
                  {pedidos.length}
                </Text>
              </View>
            </View>

            <View style={styles.resumenItem}>
              <View style={styles.resumenItemInterno}>
                <Text style={styles.etiqueta}>
                  Kilómetros
                </Text>

                <Text style={styles.valor}>
                  {resultado.kilometros.toFixed(1)} km
                </Text>
              </View>
            </View>

            <View style={styles.resumenItem}>
              <View style={styles.resumenItemInterno}>
                <Text style={styles.etiqueta}>
                  Bruto
                </Text>

                <Text style={styles.valor}>
                  {formatearPesos(resultado.brutoDia)}
                </Text>
              </View>
            </View>

            <View style={styles.resumenItem}>
              <View style={styles.resumenItemInterno}>
                <Text style={styles.etiqueta}>
                  Líquido
                </Text>

                <Text style={styles.valorPrincipal}>
                  {formatearPesos(resultado.liquido)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.separador} />

          <Text style={styles.seccionTitulo}>
            Composición
          </Text>

          <View style={styles.fila}>
            <Text style={styles.texto}>
              Bruto pedidos
            </Text>

            <Text style={styles.valor}>
              {formatearPesos(resultado.brutoPedidos)}
            </Text>
          </View>

          <View style={styles.fila}>
            <Text style={styles.texto}>
              Ajuste asegurado
            </Text>

            <Text style={styles.valor}>
              {formatearPesos(resultado.ajusteAsegurado)}
            </Text>
          </View>

          <View style={styles.fila}>
            <Text style={styles.texto}>
              Bonos del día
            </Text>

            <Text style={styles.valor}>
              {formatearPesos(resultado.bonosDia)}
            </Text>
          </View>

          <View style={styles.fila}>
            <Text style={styles.texto}>
              Combustible
            </Text>

            <Text style={styles.valor}>
              -{formatearPesos(resultado.combustible)}
            </Text>
          </View>

          <View style={styles.fila}>
            <Text style={styles.texto}>
              Boleta
            </Text>

            <Text style={styles.valor}>
              -{formatearPesos(resultado.boleta)}
            </Text>
          </View>

          {pedidos.length > 0 && (
            <>
              <View style={styles.separador} />

              <Text style={styles.seccionTitulo}>
                Pedidos
              </Text>

              {pedidos.map((item, index) => {
                const totalBonos = item.bonos.reduce(
                  (total, bono) => total + bono.monto,
                  0,
                );

                const bruto =
                  item.pedido.pedidoBaseAplicado +
                  item.pedido.cantidadSku *
                    item.pedido.valorSkuAplicado +
                  item.pedido.kilometros *
                    item.pedido.valorKmAplicado +
                  totalBonos;

                let combustible = 0;

                if (
                  item.pedido.controlarCombustibleAplicado &&
                  item.pedido.rendimientoKmLitroAplicado > 0
                ) {
                  const litros =
                    item.pedido.kilometros /
                    item.pedido.rendimientoKmLitroAplicado;

                  combustible =
                    litros *
                    item.pedido.precioLitroBencinaAplicado;
                }

                const boleta =
                  bruto *
                  (
                    resultado.boleta /
                    resultado.brutoDia
                  );

                const liquido =
                  bruto -
                  combustible -
                  boleta;

                const esUltimo =
                  index === pedidos.length - 1;

                return (
                  <React.Fragment
                    key={item.pedido.id}
                  >
                    <View style={styles.diaFila}>
                      <View
                        style={{
                          flex: 1,
                          marginRight: theme.spacing.md,
                        }}
                      >
                        <Text style={styles.diaNombre}>
                          Orden #{item.pedido.numeroOrden}
                        </Text>

                        <Text style={styles.diaDetalle}>
                          {item.pedido.ventanaInicio}
                          {' - '}
                          {item.pedido.ventanaFin}
                        </Text>

                        <Text style={styles.diaDetalle}>
                          {item.pedido.cantidadSku} SKU
                          {' • '}
                          {item.pedido.kilometros.toFixed(1)} km
                        </Text>

                        {totalBonos > 0 && (
                          <Text style={styles.diaDetalle}>
                            Bonos:{' '}
                            {formatearPesos(totalBonos)}
                          </Text>
                        )}
                      </View>

                      <View
                        style={{
                          alignItems: 'flex-end',
                        }}
                      >
                        <Text style={styles.diaMonto}>
                          {formatearPesos(liquido)}
                        </Text>

                        <Text style={styles.diaDetalle}>
                          bruto {formatearPesos(bruto)}
                        </Text>
                      </View>
                    </View>

                    {!esUltimo && (
                      <View style={styles.separador} />
                    )}
                  </React.Fragment>
                );
              })}
            </>
          )}

          {bonosDia.length > 0 && (
            <>
              <View style={styles.separador} />

              <Text style={styles.seccionTitulo}>
                Bonos del día
              </Text>

              {bonosDia.map((bono, index) => (
                <View
                  key={bono.id}
                  style={styles.fila}
                >
                  <Text style={styles.texto}>
                    {bono.descripcion}
                  </Text>

                  <Text style={styles.valor}>
                    {formatearPesos(bono.monto)}
                  </Text>
                </View>
              ))}
            </>
          )}
        </>
      )}
    </View>
  );
}