import { SQLiteDatabase } from 'expo-sqlite';

import {
  BonoDia,
  BonoPedido,
} from '../../../domain/models/Bono';

interface BonoPedidoRow {
  id: number;
  pedido_id: number;
  descripcion: string;
  monto: number;
}

interface BonoDiaRow {
  id: number;
  dia_id: number;
  descripcion: string;
  monto: number;
}

function mapBonoPedido(
  row: BonoPedidoRow,
): BonoPedido {
  return {
    id: row.id,
    pedidoId: row.pedido_id,
    descripcion: row.descripcion,
    monto: row.monto,
  };
}

function mapBonoDia(
  row: BonoDiaRow,
): BonoDia {
  return {
    id: row.id,
    diaId: row.dia_id,
    descripcion: row.descripcion,
    monto: row.monto,
  };
}

export async function crearBonoPedido(
  db: SQLiteDatabase,
  bono: Omit<BonoPedido, 'id'>,
): Promise<number> {
  const result = await db.runAsync(
    `
      INSERT INTO bonos_pedido (
        pedido_id,
        descripcion,
        monto
      )
      VALUES (?, ?, ?)
    `,
    bono.pedidoId,
    bono.descripcion,
    bono.monto,
  );

  return result.lastInsertRowId;
}

export async function obtenerBonosPedido(
  db: SQLiteDatabase,
  pedidoId: number,
): Promise<BonoPedido[]> {
  const rows =
    await db.getAllAsync<BonoPedidoRow>(
      `
        SELECT
          id,
          pedido_id,
          descripcion,
          monto
        FROM bonos_pedido
        WHERE pedido_id = ?
        ORDER BY id ASC
      `,
      pedidoId,
    );

  return rows.map(mapBonoPedido);
}

export async function eliminarBonoPedido(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM bonos_pedido
      WHERE id = ?
    `,
    id,
  );
}

export async function eliminarBonosPedido(
  db: SQLiteDatabase,
  pedidoId: number,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM bonos_pedido
      WHERE pedido_id = ?
    `,
    pedidoId,
  );
}

export async function crearBonoDia(
  db: SQLiteDatabase,
  bono: Omit<BonoDia, 'id'>,
): Promise<number> {
  const result = await db.runAsync(
    `
      INSERT INTO bonos_dia (
        dia_id,
        descripcion,
        monto
      )
      VALUES (?, ?, ?)
    `,
    bono.diaId,
    bono.descripcion,
    bono.monto,
  );

  return result.lastInsertRowId;
}

export async function obtenerBonosDia(
  db: SQLiteDatabase,
  diaId: number,
): Promise<BonoDia[]> {
  const rows =
    await db.getAllAsync<BonoDiaRow>(
      `
        SELECT
          id,
          dia_id,
          descripcion,
          monto
        FROM bonos_dia
        WHERE dia_id = ?
        ORDER BY id ASC
      `,
      diaId,
    );

  return rows.map(mapBonoDia);
}

export async function eliminarBonoDia(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM bonos_dia
      WHERE id = ?
    `,
    id,
  );
}