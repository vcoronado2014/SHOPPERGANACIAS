
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginVertical: 5,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  headerInfo: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },

  orderTitle: {
    fontSize: 15,
    fontWeight: '700',
  },

  operationalInfo: {
    fontSize: 11,
    lineHeight: 16,
  },

  liquidContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
    maxWidth: '45%',
  },

  liquidAmount: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
  },

  liquidLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'right',
  },

  economicSummary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 9,
    marginTop: 10,
    gap: 6,
  },

  economicItem: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  economicLabel: {
    fontSize: 11,
  },

  economicValue: {
    fontSize: 12,
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },

  receiptText: {
    fontSize: 11,
    flexShrink: 1,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  actionButton: {
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  editText: {
    fontSize: 12,
    fontWeight: '600',
  },

  deleteText: {
    fontSize: 12,
    fontWeight: '600',
  },
});