import React from 'react';

import { Text, View } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

import { styles } from '../InicioStyles';

import { ResultadoSemanal } from '../../../../domain/calculators/semanaCalculator';

interface ResumenContenidoProps {
    resultado: ResultadoSemanal;
    tituloLiquido: string;
    tituloDetalle: string;
    mostrarDias?: boolean;
}

function formatearMonto(valor: number): string {
    return `$${Math.round(valor).toLocaleString('es-CL')}`;
}

function formatearKilometros(valor: number): string {
    return `${valor.toLocaleString('es-CL', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })} km`;
}

function formatearFecha(fecha: string): string {
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
    return `${formatearFecha(fechaInicio)} al ${formatearFecha(fechaFin)}`;
}

export default function ResumenContenido({
    resultado,
    tituloLiquido,
    tituloDetalle,
    mostrarDias = false,
}: ResumenContenidoProps) {
    const theme = useTheme();

    const kilometrosPorPedido =
        resultado.cantidadPedidos > 0
            ? resultado.kilometros / resultado.cantidadPedidos
            : 0;

    const estadisticas = [
        {
            titulo: 'Pedidos',
            valor: resultado.cantidadPedidos.toLocaleString('es-CL'),
        },
        {
            titulo: 'Kilómetros',
            valor: formatearKilometros(resultado.kilometros),
        },
        {
            titulo: 'Bruto',
            valor: formatearMonto(resultado.brutoDia),
        },
    ];

    const detalles = [
        { titulo: 'Bruto pedidos', valor: resultado.brutoPedidos },
        { titulo: 'Asegurado acumulado', valor: resultado.asegurado },
        { titulo: 'Ajuste asegurado', valor: resultado.ajusteAsegurado },
        { titulo: 'Bonos de pedidos', valor: resultado.bonosPedido },
        { titulo: 'Bonos del día', valor: resultado.bonosDia },
        { titulo: 'Combustible', valor: resultado.combustible },
        { titulo: 'Boleta', valor: resultado.boleta },
    ];

    return (
        <>
            <View
                style={[
                    styles.periodCard,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.periodLabel,
                        { color: theme.colors.muted },
                    ]}
                >
                    {mostrarDias ? 'Semana' : 'Período registrado'} </Text>
                <Text
                    style={[
                        styles.periodValue,
                        { color: theme.colors.text },
                    ]}
                >
                    {formatearRangoSemana(
                        resultado.fechaInicio,
                        resultado.fechaFin,
                    )}
                </Text>
            </View>

            <View
                style={[
                    styles.heroCard,
                    { backgroundColor: theme.colors.primary },
                ]}
            >
                <Text
                    style={[
                        styles.heroLabel,
                        { color: theme.colors.onPrimary },
                    ]}
                >
                    {tituloLiquido}
                </Text>

                <Text
                    style={[
                        styles.heroAmount,
                        { color: theme.colors.onPrimary },
                    ]}
                >
                    {formatearMonto(resultado.liquido)}
                </Text>

                <Text
                    style={[
                        styles.heroSubtext,
                        { color: theme.colors.onPrimary },
                    ]}
                >
                    {mostrarDias
                        ? 'Lunes a domingo'
                        : 'Todos los días registrados'}
                </Text>
            </View>

            <View style={styles.statsGrid}>
                {estadisticas.map((estadistica) => (
                    <View
                        key={estadistica.titulo}
                        style={[
                            styles.statCard,
                            {
                                backgroundColor: theme.colors.surface,
                                borderColor: theme.colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.statLabel,
                                { color: theme.colors.muted },
                            ]}
                        >
                            {estadistica.titulo}
                        </Text>

                        <Text
                            style={[
                                styles.statValue,
                                { color: theme.colors.text },
                            ]}
                        >
                            {estadistica.valor}
                        </Text>
                    </View>
                ))}
            </View>

            <View
                style={[
                    styles.averageCard,
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
                    Distancia promedio
                </Text>

                <Text
                    style={[
                        styles.averageValue,
                        { color: theme.colors.primary },
                    ]}
                >
                    {formatearKilometros(kilometrosPorPedido)}
                </Text>

                <Text
                    style={[
                        styles.averageDescription,
                        { color: theme.colors.muted },
                    ]}
                >
                    por pedido
                </Text>
            </View>

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
                    {tituloDetalle}
                </Text>

                {detalles.map((detalle) => (
                    <View
                        key={detalle.titulo}
                        style={styles.detailRow}
                    >
                        <Text
                            style={[
                                styles.detailLabel,
                                { color: theme.colors.muted },
                            ]}
                        >
                            {detalle.titulo}
                        </Text>

                        <Text
                            style={[
                                styles.detailValue,
                                { color: theme.colors.text },
                            ]}
                        >
                            {formatearMonto(detalle.valor)}
                        </Text>
                    </View>
                ))}
            </View>

            {mostrarDias && (
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
                        Detalle por día
                    </Text>

                    {resultado.dias.map((dia) => (
                        <View
                            key={dia.fecha}
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
                                    {formatearFecha(dia.fecha)}
                                </Text>

                                <Text
                                    style={[
                                        styles.dayOrders,
                                        { color: theme.colors.muted },
                                    ]}
                                >
                                    {dia.cantidadPedidos}{' '}
                                    {dia.cantidadPedidos === 1
                                        ? 'pedido'
                                        : 'pedidos'}
                                    {' · '}
                                    {formatearKilometros(
                                        dia.resultado?.kilometros ?? 0,
                                    )}
                                </Text>
                            </View>

                            <Text
                                style={[
                                    styles.dayAmount,
                                    { color: theme.colors.primary },
                                ]}
                            >
                                {formatearMonto(
                                    dia.resultado?.liquido ?? 0,
                                )}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </>


    );
}
