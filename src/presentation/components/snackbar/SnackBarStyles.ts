import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },

  top: {
    top: 24,
  },

  center: {
    top: '45%',
  },

  bottom: {
    bottom: 24,
  },

  snackBar: {
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 14,

    paddingHorizontal: 16,
    paddingVertical: 12,

    flexDirection: 'row',
    alignItems: 'center',

    elevation: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  icono: {
    marginRight: 12,
  },

  mensaje: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },

  botonCerrar: {
    marginLeft: 12,
    padding: 2,
  },
});