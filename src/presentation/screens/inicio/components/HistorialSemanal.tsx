import React from 'react';

import { Text, View } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

import { styles } from '../InicioStyles';

import { SemanaRegistrada } from '../InicioViewModel';

interface HistorialSemanalProps {
    semanas: SemanaRegistrada[];
}

function formatearMonto(valor: number): string {
    return `$${Math.round(valor).toLocaleString('es-CL')}`;
}

function formatearFecha(fecha: string): string {
    const partes = fecha.split('-');

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function HistorialSemanal({
    semanas,
}: HistorialSemanalProps) {
    const theme = useTheme();

    return (
        <View
            style={[
                styles.detailCard,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
            ]}
        >
            <Text
                style={[
                    styles.sectionTitle,
                    { color: theme.colors.text },
                ]}
            >
                Historial semanal </Text>

            {semanas.length === 0 ? (
                <Text
                    style={[
                        styles.dayOrders,
                        { color: theme.colors.muted },
                    ]}
                >
                    Todavía no hay semanas registradas.
                </Text>
            ) : (
                semanas.map((semana) => (
                    <View
                        key={semana.fechaInicio}
                        style={[
                            styles.dayRow,
                            { borderBottomColor: theme.colors.border },
                        ]}
                    >
                        <View style={styles.dayInfo}>
                            <Text
                                style={[
                                    styles.dayDate,
                                    { color: theme.colors.text },
                                ]}
                            >
                                {formatearFecha(semana.fechaInicio)}
                                {' - '}
                                {formatearFecha(semana.fechaFin)}
                            </Text>

                            <Text
                                style={[
                                    styles.dayOrders,
                                    { color: theme.colors.muted },
                                ]}
                            >
                                {semana.resultado.cantidadPedidos}{' '}
                                {semana.resultado.cantidadPedidos === 1
                                    ? 'pedido'
                                    : 'pedidos'}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.dayAmount,
                                { color: theme.colors.primary },
                            ]}
                        >
                            {formatearMonto(semana.resultado.liquido)}
                        </Text>
                    </View>
                ))
            )}
        </View>


    );
}
