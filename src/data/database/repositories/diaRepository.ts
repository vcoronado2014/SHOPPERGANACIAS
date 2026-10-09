
import { SQLiteDatabase } from 'expo-sqlite';
import { Dia } from '../../../domain/models/Dia';

interface DiaRow {
  id: number;
  fecha: string;
  asegurado_base: number;
  pedidos_minimos: number;
  asegurado_aplicado: number;
  porcentaje_boleta_aplicado: number;
  created_at: string;
}

function mapDia(row: DiaRow): Dia {
  return {
    id: row.id,
    fecha: row.fecha,
    aseguradoBase: row.asegurado_base,
    pedidosMinimos: row.pedidos_minimos,
    aseguradoAplicado: row.asegurado_aplicado,
    porcentajeBoletaAplicado:
      row.porcentaje_boleta_aplicado,
    createdAt: row.created_at,
  };
}

export async function crearDia(
  db: SQLiteDatabase,
  dia: Omit<Dia, 'id'>,
): Promise<number> {
  const result = await db.runAsync(
    `
      INSERT INTO dias (
        fecha,
        asegurado_base,
        pedidos_minimos,
        asegurado_aplicado,
        porcentaje_boleta_aplicado,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    dia.fecha,
    dia.aseguradoBase,
    dia.pedidosMinimos,
    dia.aseguradoAplicado,
    dia.porcentajeBoletaAplicado,
    dia.createdAt,
  );

  return result.lastInsertRowId;
}

export async function actualizarAseguradoAplicado(
  db: SQLiteDatabase,
  id: number,
  aseguradoAplicado: number,
): Promise<void> {
  await db.runAsync(
    `
      UPDATE dias
      SET asegurado_aplicado = ?
      WHERE id = ?
    `,
    aseguradoAplicado,
    id,
  );
}

export async function actualizarConfiguracionAsegurado(
  db: SQLiteDatabase,
  diaId: number,
  aseguradoBase: number,
  pedidosMinimos: number,
): Promise<void> {
  await db.runAsync(
    `UPDATE dias
     SET asegurado_base = ?,
         pedidos_minimos = ?
     WHERE id = ?`,
    aseguradoBase,
    pedidosMinimos,
    diaId,
  );
}


export async function obtenerDiaPorFecha(
  db: SQLiteDatabase,
  fecha: string,
): Promise<Dia | null> {
  const row = await db.getFirstAsync<DiaRow>(
    `
      SELECT
        id,
        fecha,
        asegurado_base,
        pedidos_minimos,
        asegurado_aplicado,
        porcentaje_boleta_aplicado,
        created_at
      FROM dias
      WHERE fecha = ?
      LIMIT 1
    `,
    fecha,
  );

  return row ? mapDia(row) : null;
}

export async function obtenerDiaPorId(
  db: SQLiteDatabase,
  id: number,
): Promise<Dia | null> {
  const row = await db.getFirstAsync<DiaRow>(
    `
      SELECT
        id,
        fecha,
        asegurado_base,
        pedidos_minimos,
        asegurado_aplicado,
        porcentaje_boleta_aplicado,
        created_at
      FROM dias
      WHERE id = ?
      LIMIT 1
    `,
    id,
  );

  return row ? mapDia(row) : null;
}

export async function obtenerDias(
  db: SQLiteDatabase,
): Promise<Dia[]> {
  const rows = await db.getAllAsync<DiaRow>(
    `
      SELECT
        id,
        fecha,
        asegurado_base,
        pedidos_minimos,
        asegurado_aplicado,
        porcentaje_boleta_aplicado,
        created_at
      FROM dias
      ORDER BY fecha DESC
    `,
  );

  return rows.map(mapDia);
}

export async function eliminarDia(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM dias
      WHERE id = ?
    `,
    id,
  );
}