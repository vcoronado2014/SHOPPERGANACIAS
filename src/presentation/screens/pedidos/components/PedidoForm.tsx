import React from 'react';

import {
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import VentanaHorariaSelector from './VentanaHorariaSelector';

import { styles } from '../PedidosStyles';

import {
  useTheme,
} from '../../../theme/ThemeProvider';

import {
  VentanaHoraria,
} from '../../../../domain/models/Configuracion';

interface BonoForm {
  id: string;
  descripcion: string;
  monto: number;
}

interface Props {
  fecha: string;
  numeroOrden: string;
  ventanaInicio: string;
  ventanaFin: string;
  ventanasHorarias: VentanaHoraria[];
  cantidadSku: string;
  kilometros: string;
  bonos: BonoForm[];
  totalBonos: number;
  loading: boolean;
  error: string | null;
  modo: 'crear' | 'editar';
  onFechaChange: (valor: string) => void;
  onNumeroOrdenChange: (valor: string) => void;
  onVentanaChange: (
    inicio: string,
    fin: string,
  ) => void;
  onCantidadSkuChange: (valor: string) => void;
  onKilometrosChange: (valor: string) => void;
  onAgregarBono: () => void;
  onActualizarBono: (
    id: string,
    campo: 'descripcion' | 'monto',
    valor: string,
  ) => void;
  onEliminarBono: (id: string) => void;
  onGuardar: () => void;
  onCancelarEdicion: () => void;
}

const formatearPesos = (
  valor: number,
): string => {
  return `$${Math.round(valor).toLocaleString(
    'es-CL',
  )}`;
};

export default function PedidoForm({
  fecha,
  numeroOrden,
  ventanaInicio,
  ventanaFin,
  ventanasHorarias,
  cantidadSku,
  kilometros,
  bonos,
  totalBonos,
  loading,
  error,
  modo,
  onFechaChange,
  onNumeroOrdenChange,
  onVentanaChange,
  onCantidadSkuChange,
  onKilometrosChange,
  onAgregarBono,
  onActualizarBono,
  onEliminarBono,
  onGuardar,
  onCancelarEdicion,
}: Props) {
  const theme = useTheme();

  const editando =
    modo === 'editar';

  return (
    <View>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Pedidos
      </Text>

      <Text
        style={[
          styles.dateLabel,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Fecha
      </Text>

      <TextInput
        value={fecha}
        onChangeText={onFechaChange}
        placeholder="YYYY-MM-DD"
        style={styles.input}
        editable={!editando}
      />

      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.text,
          },
        ]}
      >
        {editando
          ? 'Editar pedido'
          : 'Nuevo pedido'}
      </Text>

      <TextInput
        value={numeroOrden}
        onChangeText={onNumeroOrdenChange}
        placeholder="Número de orden"
        autoCapitalize="characters"
        style={styles.input}
      />

      <Text
        style={[
          styles.fieldLabel,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Ventana horaria
      </Text>

      <VentanaHorariaSelector
        inicio={ventanaInicio}
        fin={ventanaFin}
        ventanas={ventanasHorarias}
        onChange={onVentanaChange}
      />

      <View style={styles.rowInputs}>
        <TextInput
          value={cantidadSku}
          onChangeText={
            onCantidadSkuChange
          }
          placeholder="Cantidad SKU"
          keyboardType="numeric"
          style={[
            styles.input,
            styles.halfInput,
          ]}
        />

        <TextInput
          value={kilometros}
          onChangeText={
            onKilometrosChange
          }
          placeholder="Kilómetros"
          keyboardType="numeric"
          style={[
            styles.input,
            styles.halfInput,
          ]}
        />
      </View>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Bonos
      </Text>

      {bonos.map((bono) => (
        <View
          key={bono.id}
          style={styles.bonoRow}
        >
          <TextInput
            value={bono.descripcion}
            onChangeText={(valor) =>
              onActualizarBono(
                bono.id,
                'descripcion',
                valor,
              )
            }
            placeholder="Descripción"
            style={[
              styles.input,
              styles.bonoDescription,
            ]}
          />

          <TextInput
            value={
              bono.monto
                ? String(bono.monto)
                : ''
            }
            onChangeText={(valor) =>
              onActualizarBono(
                bono.id,
                'monto',
                valor,
              )
            }
            placeholder="$"
            keyboardType="numeric"
            style={[
              styles.input,
              styles.bonoAmount,
            ]}
          />

          <Pressable
            onPress={() =>
              onEliminarBono(bono.id)
            }
          >
            <Text
              style={[
                styles.deleteText,
                {
                  color:
                    theme.colors.text,
                },
              ]}
            >
              ×
            </Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        style={
          styles.secondaryButton
        }
        onPress={onAgregarBono}
        disabled={loading}
      >
        <Text
          style={
            styles.secondaryButtonText
          }
        >
          + Agregar bono
        </Text>
      </Pressable>

      {bonos.length > 0 && (
        <View style={styles.preview}>
          <Text
            style={styles.previewLabel}
          >
            Bonos del pedido
          </Text>

          <Text
            style={styles.previewValue}
          >
            {formatearPesos(
              totalBonos,
            )}
          </Text>
        </View>
      )}

      <Pressable
        style={[
          styles.primaryButton,
          loading &&
            styles.disabledButton,
        ]}
        onPress={onGuardar}
        disabled={loading}
      >
        <Text
          style={
            styles.primaryButtonText
          }
        >
          {loading
            ? editando
              ? 'Actualizando...'
              : 'Guardando...'
            : editando
              ? 'Actualizar pedido'
              : 'Guardar pedido'}
        </Text>
      </Pressable>

      {editando && (
        <Pressable
          style={
            styles.secondaryButton
          }
          onPress={
            onCancelarEdicion
          }
          disabled={loading}
        >
          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Cancelar edición
          </Text>
        </Pressable>
      )}

    </View>
  );
}