import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Configuracion } from '../../../domain/models/Configuracion';

import { useConfiguracionViewModel } from '../../screens/configuracion/ConfiguracionViewModel';

import { useSnackBar } from '../../components/snackbar/useSnackBar';

import {
  useTheme,
  useThemeSettings,
} from '../../theme/ThemeProvider';

import { styles } from './ConfiguracionStyles';

export default function ConfiguracionView() {
  const {
    configuracion,
    loading,
    saving,
    error,
    guardarConfiguracion,
    actualizarVentanaHoraria,
    agregarVentanaHoraria,
    eliminarVentanaHoraria,
  } = useConfiguracionViewModel();

  const theme = useTheme();

  const { mostrarSnackBar } = useSnackBar();

  const {
    themeMode,
    cambiarTema,
  } = useThemeSettings();

  const [formulario, setFormulario] =
    useState<Configuracion | null>(null);

  useEffect(() => {
    if (configuracion) {
      setFormulario(configuracion);
    }
  }, [configuracion]);

  if (loading || !formulario) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  const actualizarNumero = (
    campo: keyof Configuracion,
    valor: string,
  ) => {
    const numero = Number(valor);

    setFormulario((actual) => {
      if (!actual) {
        return actual;
      }

      return {
        ...actual,
        [campo]: Number.isNaN(numero) ? 0 : numero,
      };
    });
  };

  const actualizarBooleano = (
    campo: keyof Configuracion,
    valor: boolean,
  ) => {
    setFormulario((actual) => {
      if (!actual) {
        return actual;
      }

      return {
        ...actual,
        [campo]: valor,
      };
    });
  };

  const actualizarVentana = (
    indice: number,
    campo: 'inicio' | 'fin',
    valor: string,
  ) => {
    if (!formulario) {
      return;
    }

    const ventanaActual =
      formulario.ventanasHorarias[indice];

    if (!ventanaActual) {
      return;
    }

    actualizarVentanaHoraria(indice, {
      ...ventanaActual,
      [campo]: valor,
      label:
        campo === 'inicio'
          ? `${valor} - ${ventanaActual.fin}`
          : `${ventanaActual.inicio} - ${valor}`,
    });
  };

  const eliminarVentana = (indice: number) => {
    Alert.alert(
      'Eliminar ventana',
      '¿Quieres eliminar esta ventana horaria?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () =>
            eliminarVentanaHoraria(indice),
        },
      ],
    );
  };

  const guardar = async () => {
    const resultado =
      await guardarConfiguracion(formulario);

    if (resultado) {
      mostrarSnackBar(
        'Configuración guardada correctamente',
        'success'
      );
    }
    else {
      mostrarSnackBar(
        'Error al guardar la configuración',
        'error'
      );
    }
  };

  const seleccionarTema = async (
    modo: 'system' | 'light' | 'dark',
  ) => {
    await cambiarTema(modo);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Configuración
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.muted,
          },
        ]}
      >
        Configura los valores utilizados para calcular tus pedidos.
      </Text>

      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Apariencia
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Tema
        </Text>

        <View style={styles.themeOptions}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
              themeMode === 'system' && {
                backgroundColor: theme.colors.primarySoft,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => seleccionarTema('system')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.themeOptionText,
                {
                  color: theme.colors.text,
                },
                themeMode === 'system' && {
                  color: theme.colors.primary,
                },
              ]}
            >
              Sistema
            </Text>

            <Text
              style={[
                styles.themeOptionDescription,
                {
                  color: theme.colors.muted,
                },
              ]}
            >
              Usar el tema del teléfono
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
              themeMode === 'light' && {
                backgroundColor: theme.colors.primarySoft,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => seleccionarTema('light')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.themeOptionText,
                {
                  color: theme.colors.text,
                },
                themeMode === 'light' && {
                  color: theme.colors.primary,
                },
              ]}
            >
              Claro
            </Text>

            <Text
              style={[
                styles.themeOptionDescription,
                {
                  color: theme.colors.muted,
                },
              ]}
            >
              Usar siempre tema claro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
              themeMode === 'dark' && {
                backgroundColor: theme.colors.primarySoft,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => seleccionarTema('dark')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.themeOptionText,
                {
                  color: theme.colors.text,
                },
                themeMode === 'dark' && {
                  color: theme.colors.primary,
                },
              ]}
            >
              Oscuro
            </Text>

            <Text
              style={[
                styles.themeOptionDescription,
                {
                  color: theme.colors.muted,
                },
              ]}
            >
              Usar siempre tema oscuro
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Valores del pedido
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Pedido base
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          value={String(formulario.pedidoBase)}
          onChangeText={(value) =>
            actualizarNumero('pedidoBase', value)
          }
          keyboardType="numeric"
        />

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Valor base SKU
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          value={String(formulario.valorBaseSku)}
          onChangeText={(value) =>
            actualizarNumero('valorBaseSku', value)
          }
          keyboardType="numeric"
        />

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Valor compensación por KM
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          value={String(formulario.valorCompensacionKm)}
          onChangeText={(value) =>
            actualizarNumero('valorCompensacionKm', value)
          }
          keyboardType="numeric"
        />
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Ventanas horarias
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: theme.colors.muted,
            },
          ]}
        >
          Define los horarios disponibles para tus pedidos.
        </Text>

        {formulario.ventanasHorarias.map(
          (ventana, indice) => (
            <View
              key={`${indice}-${ventana.inicio}-${ventana.fin}`}
              style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.md,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: theme.spacing.sm,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    fontWeight: '700',
                  }}
                >
                  Ventana {indice + 1}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    eliminarVentana(indice)
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      color: theme.colors.danger,
                      fontWeight: '700',
                    }}
                  >
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: theme.spacing.sm,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: theme.colors.text,
                      },
                    ]}
                  >
                    Inicio
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                        backgroundColor:
                          theme.colors.background,
                      },
                    ]}
                    value={ventana.inicio}
                    onChangeText={(valor) =>
                      actualizarVentana(
                        indice,
                        'inicio',
                        valor,
                      )
                    }
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="09"
                    placeholderTextColor={
                      theme.colors.muted
                    }
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: theme.colors.text,
                      },
                    ]}
                  >
                    Fin
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                        backgroundColor:
                          theme.colors.background,
                      },
                    ]}
                    value={ventana.fin}
                    onChangeText={(valor) =>
                      actualizarVentana(
                        indice,
                        'fin',
                        valor,
                      )
                    }
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="11"
                    placeholderTextColor={
                      theme.colors.muted
                    }
                  />
                </View>
              </View>

              <Text
                style={{
                  marginTop: theme.spacing.sm,
                  color: theme.colors.muted,
                  fontSize: 13,
                }}
              >
                Vista previa: {ventana.inicio} - {ventana.fin}
              </Text>
            </View>
          ),
        )}

        <TouchableOpacity
          style={{
            marginTop: theme.spacing.md,
            padding: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            borderRadius: theme.radius.md,
            alignItems: 'center',
          }}
          onPress={agregarVentanaHoraria}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: theme.colors.primary,
              fontWeight: '700',
            }}
          >
            + Agregar ventana
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Asegurado
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Asegurado lunes a sábado
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          value={String(formulario.aseguradoLunesSabado)}
          onChangeText={(value) =>
            actualizarNumero('aseguradoLunesSabado', value)
          }
          keyboardType="numeric"
        />

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Asegurado domingo
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          value={String(formulario.aseguradoDomingo)}
          onChangeText={(value) =>
            actualizarNumero('aseguradoDomingo', value)
          }
          keyboardType="numeric"
        />

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Porcentaje boleta
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          value={String(formulario.porcentajeBoleta)}
          onChangeText={(value) =>
            actualizarNumero('porcentajeBoleta', value)
          }
          keyboardType="numeric"
        />
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Combustible
        </Text>

        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text
              style={[
                styles.label,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              Controlar combustible
            </Text>

            <Text
              style={[
                styles.description,
                {
                  color: theme.colors.muted,
                },
              ]}
            >
              Considerar combustible en los cálculos.
            </Text>
          </View>

          <Switch
            value={formulario.controlarCombustible}
            onValueChange={(value) =>
              actualizarBooleano(
                'controlarCombustible',
                value,
              )
            }
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Precio litro bencina
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          value={String(formulario.precioLitroBencina)}
          onChangeText={(value) =>
            actualizarNumero('precioLitroBencina', value)
          }
          keyboardType="numeric"
          editable={formulario.controlarCombustible}
        />

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Rendimiento KM/Litro
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          value={String(formulario.rendimientoKmLitro)}
          onChangeText={(value) =>
            actualizarNumero('rendimientoKmLitro', value)
          }
          keyboardType="numeric"
          editable={formulario.controlarCombustible}
        />
      </View>

      {error && (
        <Text
          style={[
            styles.error,
            {
              color: theme.colors.danger,
            },
          ]}
        >
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: theme.colors.primary,
          },
          saving && styles.saveButtonDisabled,
        ]}
        onPress={guardar}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator
            color={theme.colors.onPrimary}
          />
        ) : (
          <Text
            style={[
              styles.saveButtonText,
              {
                color: theme.colors.onPrimary,
              },
            ]}
          >
            Guardar configuración
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
