export function esDomingo(
  fecha: string,
): boolean {
  const [year, month, day] =
    fecha.split('-').map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
  );

  return date.getDay() === 0;
}

export function obtenerFechaHoy(): string {
  const ahora = new Date();

  const year =
    ahora.getFullYear();

  const month =
    String(
      ahora.getMonth() + 1,
    ).padStart(2, '0');

  const day =
    String(
      ahora.getDate(),
    ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}