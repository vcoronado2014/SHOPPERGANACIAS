import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) =>
  StyleSheet.create({
    // Layout global
    keyboardContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.xl,
      paddingBottom: theme.spacing.xl * 2,
    },

    // Card contenedora genérica
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: theme.colors.muted,
      marginBottom: theme.spacing.md,
    },

    // Componente 1: Header (Avatar e Info)
    headerContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    avatarWrapper: {
      position: 'relative',
      width: 110,
      height: 110,
      marginBottom: theme.spacing.md,
    },
    cameraButton: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.colors.primary,
      borderWidth: 3,
      borderColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraIcon: {
      fontSize: 18,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    headerEmail: {
      fontSize: 15,
      color: theme.colors.muted,
    },

    // Componente 2: Card de Selección de Avatar
    galleryButton: {
      minHeight: 50,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    galleryButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    avatarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      justifyContent: 'center',
    },
    avatarItem: {
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarSelected: {
      backgroundColor: theme.colors.primarySoft,
      borderWidth: 3,
      borderColor: theme.colors.primary,
    },
    avatarUnselected: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    avatarEmoji: {
      fontSize: 30,
    },
    deletePhotoButton: {
      marginTop: theme.spacing.md,
      alignItems: 'center',
    },
    deletePhotoText: {
      color: theme.colors.danger,
      fontSize: 14,
      fontWeight: '600',
    },

    // Componente 3: Card de Cambio de Contraseña
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    inputWrapper: {
      position: 'relative',
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 13,
      paddingRight: 70,
      fontSize: 16,
    },
    togglePasswordButton: {
      position: 'absolute',
      right: theme.spacing.sm,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.sm,
    },
    togglePasswordText: {
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    saveButton: {
      minHeight: 50,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.xs,
    },
    saveButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },

    // Mensajes y Botón de Salir (Vista Principal)
    errorBox: {
      backgroundColor: theme.colors.danger + '15',
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.danger + '40',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    errorText: {
      color: theme.colors.danger,
      fontSize: 14,
      lineHeight: 20,
    },
    successBox: {
      backgroundColor: theme.colors.success + '15',
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.success + '40',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    successText: {
      color: theme.colors.success,
      fontSize: 14,
      lineHeight: 20,
    },
    logoutButton: {
      minHeight: 52,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.danger,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoutText: {
      color: theme.colors.danger,
      fontSize: 16,
      fontWeight: '700',
    },

    // Utilidades
    disabled: {
      opacity: 0.6,
    },
    galleryButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
  });