export function formatearPesos(
  valor: number,
): string {
  return new Intl.NumberFormat(
    'es-CL',
    {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    },
  ).format(valor);
}

export function parsearNumero(
  valor: string,
): number {
  const limpio = valor
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  const numero = Number(limpio);

  return Number.isFinite(numero)
    ? numero
    : 0;
}