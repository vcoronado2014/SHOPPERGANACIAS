import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
  },

  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  description: {
    fontSize: 13,
    lineHeight: 18,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  switchTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  themeOptions: {
    gap: 8,
  },

  themeOption: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },

  themeOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },

  themeOptionDescription: {
    fontSize: 13,
    marginTop: 4,
  },

  error: {
    fontSize: 14,
    marginBottom: 16,
  },

  saveButton: {
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});