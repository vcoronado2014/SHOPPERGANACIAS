import React from 'react';

import {
  Text,
  View,
} from 'react-native';

import {
  ResultadoSemanal,
} from '../../../../domain/calculators/semanaCalculator';

import { useTheme } from '../../../theme/ThemeProvider';

import { crearGananciasStyles } from '../GananciasStyles';
import { getConfiguracion } from '../../../../data/storage/appStorage';

interface ResumenGananciasProps {
  resultado: ResultadoSemanal | null;
}

function formatearPesos(valor: number): string {
  return `$${Math.round(valor).toLocaleString('es-CL')}`;
}

export function ResumenGanancias({
  resultado,
}: ResumenGananciasProps) {
  const theme = useTheme();
  const styles = crearGananciasStyles(theme);

  if (!resultado) {
    return (
      <View style={styles.tarjeta}>
        <Text style={styles.mensajeVacio}>
          No hay información de ganancias para esta semana.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View
        style={[
          styles.tarjeta,
          styles.tarjetaPrincipal,
        ]}
      >
        <Text style={styles.etiqueta}>
          LÍQUIDO ESTIMADO
        </Text>

        <Text style={styles.valorPrincipal}>
          {formatearPesos(resultado.liquido)}
        </Text>

        <Text style={styles.textoMuted}>
          Total estimado después de combustible y boleta
        </Text>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.seccionTitulo}>
          Resumen de la semana
        </Text>

        <View style={styles.filaResumen}>
          <View style={styles.resumenItem}>
            <View style={styles.resumenItemInterno}>
              <Text style={styles.etiqueta}>
                Pedidos
              </Text>

              <Text style={styles.valor}>
                {resultado.cantidadPedidos}
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
                Bruto pedidos
              </Text>

              <Text style={styles.valor}>
                {formatearPesos(resultado.brutoPedidos)}
              </Text>
            </View>
          </View>

          <View style={styles.resumenItem}>
            <View style={styles.resumenItemInterno}>
              <Text style={styles.etiqueta}>
                Asegurado
              </Text>

              <Text style={styles.valor}>
                {formatearPesos(resultado.asegurado)}
              </Text>
            </View>
          </View>

          <View style={styles.resumenItem}>
            <View style={styles.resumenItemInterno}>
              <Text style={styles.etiqueta}>
                Ajuste asegurado
              </Text>

              <Text style={styles.valor}>
                {formatearPesos(resultado.ajusteAsegurado)}
              </Text>
            </View>
          </View>

          <View style={styles.resumenItem}>
            <View style={styles.resumenItemInterno}>
              <Text style={styles.etiqueta}>
                Bonos
              </Text>

              <Text style={styles.valor}>
                {formatearPesos(resultado.bonosDia)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.separador} />

        <View style={styles.fila}>
          <Text style={styles.texto}>
            Bruto total
          </Text>

          <Text style={styles.valor}>
            {formatearPesos(resultado.brutoDia)}
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

        <View style={styles.separador} />

        <View style={styles.fila}>
          <Text style={styles.texto}>
            Líquido estimado
          </Text>

          <Text style={styles.valorPrincipal}>
            {formatearPesos(resultado.liquido)}
          </Text>
        </View>
      </View>
    </>
  );
}