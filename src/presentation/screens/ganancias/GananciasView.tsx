import React, { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from 'react-native';

import { useSQLiteContext } from 'expo-sqlite';

import { useTheme } from '../../theme/ThemeProvider';

import {
    useGananciasViewModel,
} from './GananciasViewModel';

import {
    PeriodoSelector,
} from './components/PeriodoSelector';

import {
    ResumenGanancias,
} from './components/ResumenGanancias';

import {
    ResumenSemanal,
} from './components/ResumenSemanal';

import {
    ExportarGanancias,
} from './components/ExportarGanancias';

import {
    crearGananciasStyles,
} from './GananciasStyles';

function obtenerDomingoSemana(
    fechaInicio: string,
): string {
    const [year, month, day] =
        fechaInicio.split('-').map(Number);

    const date = new Date(
        year,
        month - 1,
        day,
    );

    date.setDate(
        date.getDate() + 6,
    );

    const yearResultado =
        date.getFullYear();

    const monthResultado =
        String(
            date.getMonth() + 1,
        ).padStart(2, '0');

    const dayResultado =
        String(
            date.getDate(),
        ).padStart(2, '0');

    return `${yearResultado}-${monthResultado}-${dayResultado}`;
}

export function GananciasView() {
    const db = useSQLiteContext();

    const theme = useTheme();

    const styles =
        crearGananciasStyles(theme);

    const {
        fechaSemana,
        dias,
        resultadoSemana,
        loading,
        error,
        cargarSemanaActual,
        irSemanaAnterior,
        irSemanaSiguiente,
    } = useGananciasViewModel(db);

    useFocusEffect(
        useCallback(() => {
            cargarSemanaActual();
        }, [cargarSemanaActual]),
    );

    const fechaFin =
        obtenerDomingoSemana(
            fechaSemana,
        );

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={
                    styles.content
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                <Text style={styles.titulo}>
                    Ganancias
                </Text>

                <Text style={styles.subtitulo}>
                    Revisa cuánto ganaste y cómo se compone.
                </Text>

                <PeriodoSelector
                    fechaInicio={fechaSemana}
                    fechaFin={fechaFin}
                    onAnterior={
                        irSemanaAnterior
                    }
                    onSiguiente={
                        irSemanaSiguiente
                    }
                />

                {loading ? (
                    <View
                        style={{
                            alignItems: 'center',
                            paddingVertical: theme.spacing.xl,
                        }}
                    >
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                        />

                        <Text
                            style={[
                                styles.textoMuted,
                                {
                                    marginTop: theme.spacing.sm,
                                },
                            ]}
                        >
                            Cargando ganancias...
                        </Text>
                    </View>
                ) : error ? (
                    <View style={styles.tarjeta}>
                        <Text style={styles.texto}>
                            {error}
                        </Text>
                    </View>
                ) : (
                    <>
                        <ResumenGanancias
                            resultado={
                                resultadoSemana
                            }
                        />

                        <ResumenSemanal
                            datosDias={dias}
                        />

                        <ExportarGanancias
                            fechaInicio={
                                fechaSemana
                            }
                            fechaFin={
                                fechaFin
                            }
                            tieneDatos={
                                (resultadoSemana?.cantidadPedidos ??
                                    0) > 0 ||
                                (resultadoSemana?.bonosDia ??
                                    0) > 0
                            }
                            datosDias={dias}
                            resultadoSemana={
                                resultadoSemana
                            }
                        />
                    </>
                )}
            </ScrollView>
        </View>
    );
}
