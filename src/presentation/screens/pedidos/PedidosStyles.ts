import {
  StyleSheet,
} from 'react-native';

export const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },

    listContent: {
      padding: 16,
      paddingBottom: 40,
    },

    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 20,
    },

    dateLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginTop: 20,
      marginBottom: 12,
    },

    input: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D0D0D0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 11,
      marginBottom: 10,
      fontSize: 16,
    },

    rowInputs: {
      flexDirection: 'row',
      gap: 10,
    },

    halfInput: {
      flex: 1,
    },

    bonoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    bonoDescription: {
      flex: 1,
    },

    bonoAmount: {
      width: 100,
    },

    primaryButton: {
      backgroundColor: '#1976D2',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 16,
    },

    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },

    secondaryButton: {
      borderWidth: 1,
      borderColor: '#1976D2',
      borderRadius: 8,
      paddingVertical: 11,
      alignItems: 'center',
      marginTop: 4,
    },

    secondaryButtonText: {
      color: '#1976D2',
      fontSize: 15,
      fontWeight: '600',
    },

    disabledButton: {
      opacity: 0.6,
    },

    preview: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
      padding: 12,
      backgroundColor: '#EAF2FF',
      borderRadius: 8,
    },

    previewLabel: {
      fontWeight: '600',
    },

    previewValue: {
      fontWeight: '700',
    },

    summary: {
      marginTop: 20,
      padding: 14,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
    },

    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 15,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#E5E5E5',
    },

    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },

    cardHeaderInfo: {
      flex: 1,
      marginRight: 12,
    },

    cardTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: '#222222',
    },

    cardSubtitle: {
      fontSize: 14,
      color: '#777777',
      marginTop: 4,
    },

    cardAmount: {
      fontSize: 17,
      fontWeight: '700',
      color: '#1976D2',
    },

    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 5,
    },

    cardLabel: {
      color: '#666666',
      fontSize: 14,
    },

    cardValue: {
      fontWeight: '600',
      color: '#222222',
      fontSize: 14,
    },

    orderNumber: {
      fontSize: 17,
      fontWeight: '700',
    },

    secondary: {
      color: '#777777',
      marginTop: 3,
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 5,
    },

    label: {
      color: '#666666',
    },

    value: {
      fontWeight: '600',
    },

    expenseValue: {
      fontWeight: '600',
      color: '#C62828',
    },

    separator: {
      borderTopWidth: 1,
      borderTopColor: '#EEEEEE',
      marginVertical: 8,
    },

    totalRow: {
      borderTopWidth: 1,
      borderTopColor: '#EEEEEE',
      marginTop: 8,
      paddingTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    totalLabel: {
      fontSize: 17,
      fontWeight: '700',
    },

    totalValue: {
      fontSize: 17,
      fontWeight: '700',
    },

    error: {
      color: '#D32F2F',
      marginTop: 10,
    },

    empty: {
      textAlign: 'center',
      color: '#777777',
      paddingVertical: 30,
    },

    fieldLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
    },

    selectorContainer: {
      position: 'relative',
      zIndex: 100,
      marginBottom: 12,
    },

    selector: {
      height: 48,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      backgroundColor: '#fff',
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    selectorText: {
      fontSize: 16,
      color: '#222',
    },

    selectorPlaceholder: {
      fontSize: 16,
      color: '#999',
    },

    selectorArrow: {
      fontSize: 12,
      color: '#555',
    },

    selectorOptions: {
      position: 'absolute',
      top: 52,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },

    selectorOption: {
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },

    selectorOptionText: {
      fontSize: 16,
      color: '#222',
    },

    bonoDiaContainer: {
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#F5F5F5',
    },

    bonoDiaTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
    },

    bonoDiaInput: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#DDDDDD',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    },

    bonoDiaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#DDDDDD',
    },

    bonoDiaInfo: {
      flex: 1,
      marginRight: 12,
    },

    bonoDiaDescription: {
      fontWeight: '600',
    },

    cardActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#EEEEEE',
      gap: 10,
    },

    editButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#2563EB',
    },

    editText: {
      color: '#2563EB',
      fontSize: 14,
      fontWeight: '600',
    },

    deleteButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#DC2626',
    },

    deleteText: {
      color: '#DC2626',
      fontSize: 14,
      fontWeight: '600',
    },
  });