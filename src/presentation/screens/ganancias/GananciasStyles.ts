import { StyleSheet } from 'react-native';

export function crearGananciasStyles(
    theme: any,
) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },

        content: {
            padding: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
        },

        titulo: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
        },

        subtitulo: {
            fontSize: 14,
            color: theme.colors.muted,
            marginBottom: theme.spacing.sm,
        },

        tarjeta: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
        },

        tarjetaPrincipal: {
            paddingVertical: theme.spacing.lg,
        },

        etiqueta: {
            fontSize: 13,
            fontWeight: '500',
            color: theme.colors.muted,
            marginBottom: theme.spacing.xs,
        },

        valorPrincipal: {
            fontSize: 32,
            fontWeight: '800',
            color: theme.colors.primary,
        },

        valor: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.colors.text,
        },

        texto: {
            fontSize: 14,
            color: theme.colors.text,
        },

        textoMuted: {
            fontSize: 13,
            color: theme.colors.muted,
        },

        separador: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: theme.spacing.sm,
        },

        fila: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: theme.spacing.sm,
        },

        filaResumen: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -theme.spacing.xs,
        },

        resumenItem: {
            width: '50%',
            padding: theme.spacing.xs,
        },

        resumenItemInterno: {
            backgroundColor: theme.colors.background,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
        },

        selectorPeriodo: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md,
        },

        botonNavegacion: {
            width: 42,
            height: 42,
            borderRadius: theme.radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },

        botonNavegacionTexto: {
            fontSize: 22,
            fontWeight: '600',
            color: theme.colors.text,
        },

        periodoTexto: {
            flex: 1,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.text,
            marginHorizontal: theme.spacing.sm,
        },

        seccionTitulo: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
        },

        diaFila: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: theme.spacing.sm,
        },

        diaNombre: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.colors.text,
        },

        diaDetalle: {
            fontSize: 13,
            color: theme.colors.muted,
            marginTop: 2,
        },

        diaMonto: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.text,
        },

        mensajeVacio: {
            textAlign: 'center',
            color: theme.colors.muted,
            fontSize: 14,
            paddingVertical: theme.spacing.lg,
        },

        botonExportar: {
            minHeight: 50,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: theme.spacing.md,
            marginTop: theme.spacing.sm,
        },

        botonExportarTexto: {
            color: theme.colors.onPrimary,
            fontSize: 15,
            fontWeight: '700',
        },


        flechaDia: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.muted,
            marginLeft: theme.spacing.xs,
        },


        diaColumnaIzquierda: {
            flex: 1,
            minWidth: 0,
        },

        diaCabecera: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        diaFecha: {
            fontSize: 13,
            color: theme.colors.muted,
            marginLeft: theme.spacing.xs,
        },

        diaColumnaDerecha: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginLeft: theme.spacing.md,
        },

        diaMontoFila: {
            flexDirection: 'row',
            alignItems: 'center',
        },


        detalleDiaExpandido: {
            marginTop: theme.spacing.xs,
            marginBottom: theme.spacing.sm,
        },
    });
}