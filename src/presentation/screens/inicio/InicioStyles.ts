import {
  StyleSheet,
} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  selector: {
    flexDirection: 'row',
    padding: 4,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
  },

  selectorItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
  },

  selectorText: {
    fontSize: 14,
    fontWeight: '700',
  },

  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },

  errorText: {
    fontSize: 14,
    fontWeight: '600',
  },

  heroCard: {
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
  },

  heroLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },

  heroAmount: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 6,
  },

  heroSubtext: {
    fontSize: 13,
    marginTop: 6,
    opacity: 0.85,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    minHeight: 92,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'center',
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },

  statValue: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

  averageCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
  },

  averageValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
  },

  averageDescription: {
    fontSize: 13,
    marginTop: 2,
  },

  periodCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  periodLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },

  periodValue: {
    fontSize: 16,
    fontWeight: '700',
  },

  detailCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },

  detailLabel: {
    fontSize: 14,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },

  dayInfo: {
    flex: 1,
  },

  dayDate: {
    fontSize: 14,
    fontWeight: '700',
  },

  dayOrders: {
    fontSize: 12,
    marginTop: 3,
  },

  dayAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 12,
  },
});