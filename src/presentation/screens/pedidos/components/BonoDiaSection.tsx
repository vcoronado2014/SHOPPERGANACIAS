import React from 'react';

import {
  Button,
  Text,
  TextInput,
  View,
} from 'react-native';

import { styles } from '../PedidosStyles';

import {
  useTheme,
} from '../../../theme/ThemeProvider';

interface BonoDia {
  id: number;
  descripcion: string;
  monto: number;
}

interface Props {
  bonosDia: BonoDia[];
  descripcion: string;
  monto: string;
  loading: boolean;

  onDescripcionChange: (
    valor: string,
  ) => void;

  onMontoChange: (
    valor: string,
  ) => void;

  onGuardar: () => void;

  onEliminar: (
    id: number,
  ) => void;
}

const formatearPesos = (
  valor: number,
): string => {
  return `$${Math.round(
    valor,
  ).toLocaleString('es-CL')}`;
};

export default function BonoDiaSection({
  bonosDia,
  descripcion,
  monto,
  loading,
  onDescripcionChange,
  onMontoChange,
  onGuardar,
  onEliminar,
}: Props) {
  const theme = useTheme();
  return (
    <View
      style={[styles.bonoDiaContainer, { backgroundColor: theme.colors.background }]}
    >
      <Text
        style={[styles.bonoDiaTitle, { color: theme.colors.text }]}
      >
        Bonos del día
      </Text>

      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={
          onDescripcionChange
        }
        style={styles.bonoDiaInput}
      />

      <TextInput
        placeholder="Monto"
        value={monto}
        onChangeText={onMontoChange}
        keyboardType="numeric"
        style={styles.bonoDiaInput}
      />

      <Button
        title="Agregar bono del día"
        onPress={onGuardar}
        disabled={loading}
      />

      {bonosDia.map((bono) => (
        <View
          key={bono.id}
          style={styles.bonoDiaRow}
        >
          <View
            style={
              styles.bonoDiaInfo
            }
          >
            <Text
              style={
                [styles.bonoDiaDescription, { color: theme.colors.text }]
              }
            >
              {bono.descripcion}
            </Text>

            <Text>
              {formatearPesos(
                bono.monto,
              )}
            </Text>
          </View>

          <Button
            title="Eliminar"
            onPress={() =>
              onEliminar(bono.id)
            }
            disabled={loading}
          />
        </View>
      ))}
    </View>
  );
}