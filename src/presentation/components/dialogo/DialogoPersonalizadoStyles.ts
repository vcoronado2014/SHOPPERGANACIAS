
import { StyleSheet } from 'react-native';

export const dialogoStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  contenedor: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },

  contenedorIcono: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  titulo: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },

  parrafo: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 26,
  },

  contenedorBotones: {
    flexDirection: 'row',
    gap: 12,
  },

  boton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  textoBoton: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});