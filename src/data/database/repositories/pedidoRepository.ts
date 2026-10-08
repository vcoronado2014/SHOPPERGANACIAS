import { SQLiteDatabase } from 'expo-sqlite';

import { Pedido } from '../../../domain/models/Pedido';

interface PedidoRow {
  id: number;
  dia_id: number;
  numero_orden: string;
  fecha: string;
  ventana_inicio: string;
  ventana_fin: string;
  cantidad_sku: number;
  kilometros: number;
  pedido_base_aplicado: number;
  valor_sku_aplicado: number;
  valor_km_aplicado: number;
  controlar_combustible_aplicado: number;
  precio_litro_bencina_aplicado: number;
  rendimiento_km_litro_aplicado: number;
  created_at: string;
}

function mapPedido(row: PedidoRow): Pedido {
  return {
    id: row.id,
    diaId: row.dia_id,
    numeroOrden: row.numero_orden,
    fecha: row.fecha,
    ventanaInicio: row.ventana_inicio,
    ventanaFin: row.ventana_fin,
    cantidadSku: row.cantidad_sku,
    kilometros: row.kilometros,
    pedidoBaseAplicado: row.pedido_base_aplicado,
    valorSkuAplicado: row.valor_sku_aplicado,
    valorKmAplicado: row.valor_km_aplicado,
    controlarCombustibleAplicado:
      row.controlar_combustible_aplicado === 1,
    precioLitroBencinaAplicado:
      row.precio_litro_bencina_aplicado,
    rendimientoKmLitroAplicado:
      row.rendimiento_km_litro_aplicado,
    createdAt: row.created_at,
  };
}

export async function crearPedido(
  db: SQLiteDatabase,
  pedido: Omit<Pedido, 'id'>,
): Promise<number> {
  const result = await db.runAsync(
    `
      INSERT INTO pedidos (
        dia_id,
        numero_orden,
        fecha,
        ventana_inicio,
        ventana_fin,
        cantidad_sku,
        kilometros,
        pedido_base_aplicado,
        valor_sku_aplicado,
        valor_km_aplicado,
        controlar_combustible_aplicado,
        precio_litro_bencina_aplicado,
        rendimiento_km_litro_aplicado,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    pedido.diaId,
    pedido.numeroOrden,
    pedido.fecha,
    pedido.ventanaInicio,
    pedido.ventanaFin,
    pedido.cantidadSku,
    pedido.kilometros,
    pedido.pedidoBaseAplicado,
    pedido.valorSkuAplicado,
    pedido.valorKmAplicado,
    pedido.controlarCombustibleAplicado ? 1 : 0,
    pedido.precioLitroBencinaAplicado,
    pedido.rendimientoKmLitroAplicado,
    pedido.createdAt,
  );

  return result.lastInsertRowId;
}

export async function obtenerPedidoPorId(
  db: SQLiteDatabase,
  id: number,
): Promise<Pedido | null> {
  const row = await db.getFirstAsync<PedidoRow>(
    `
      SELECT
        id,
        dia_id,
        numero_orden,
        fecha,
        ventana_inicio,
        ventana_fin,
        cantidad_sku,
        kilometros,
        pedido_base_aplicado,
        valor_sku_aplicado,
        valor_km_aplicado,
        controlar_combustible_aplicado,
        precio_litro_bencina_aplicado,
        rendimiento_km_litro_aplicado,
        created_at
      FROM pedidos
      WHERE id = ?
      LIMIT 1
    `,
    id,
  );

  return row
    ? mapPedido(row)
    : null;
}

export async function actualizarPedido(
  db: SQLiteDatabase,
  id: number,
  pedido: Omit<Pedido, 'id'>,
): Promise<void> {
  await db.runAsync(
    `
      UPDATE pedidos
      SET
        dia_id = ?,
        numero_orden = ?,
        fecha = ?,
        ventana_inicio = ?,
        ventana_fin = ?,
        cantidad_sku = ?,
        kilometros = ?,
        pedido_base_aplicado = ?,
        valor_sku_aplicado = ?,
        valor_km_aplicado = ?,
        controlar_combustible_aplicado = ?,
        precio_litro_bencina_aplicado = ?,
        rendimiento_km_litro_aplicado = ?,
        created_at = ?
      WHERE id = ?
    `,
    pedido.diaId,
    pedido.numeroOrden,
    pedido.fecha,
    pedido.ventanaInicio,
    pedido.ventanaFin,
    pedido.cantidadSku,
    pedido.kilometros,
    pedido.pedidoBaseAplicado,
    pedido.valorSkuAplicado,
    pedido.valorKmAplicado,
    pedido.controlarCombustibleAplicado ? 1 : 0,
    pedido.precioLitroBencinaAplicado,
    pedido.rendimientoKmLitroAplicado,
    pedido.createdAt,
    id,
  );
}

export async function obtenerPedidosPorDia(
  db: SQLiteDatabase,
  diaId: number,
): Promise<Pedido[]> {
  const rows =
    await db.getAllAsync<PedidoRow>(
      `
        SELECT
          id,
          dia_id,
          numero_orden,
          fecha,
          ventana_inicio,
          ventana_fin,
          cantidad_sku,
          kilometros,
          pedido_base_aplicado,
          valor_sku_aplicado,
          valor_km_aplicado,
          controlar_combustible_aplicado,
          precio_litro_bencina_aplicado,
          rendimiento_km_litro_aplicado,
          created_at
        FROM pedidos
        WHERE dia_id = ?
        ORDER BY id ASC
      `,
      diaId,
    );

  return rows.map(mapPedido);
}

export async function obtenerPedidosPorFecha(
  db: SQLiteDatabase,
  fecha: string,
): Promise<Pedido[]> {
  const rows =
    await db.getAllAsync<PedidoRow>(
      `
        SELECT
          id,
          dia_id,
          numero_orden,
          fecha,
          ventana_inicio,
          ventana_fin,
          cantidad_sku,
          kilometros,
          pedido_base_aplicado,
          valor_sku_aplicado,
          valor_km_aplicado,
          controlar_combustible_aplicado,
          precio_litro_bencina_aplicado,
          rendimiento_km_litro_aplicado,
          created_at
        FROM pedidos
        WHERE fecha = ?
        ORDER BY id ASC
      `,
      fecha,
    );

  return rows.map(mapPedido);
}

export async function obtenerTodosLosPedidos(
  db: SQLiteDatabase,
): Promise<Pedido[]> {
  const rows =
    await db.getAllAsync<PedidoRow>(
      `
        SELECT
          id,
          dia_id,
          numero_orden,
          fecha,
          ventana_inicio,
          ventana_fin,
          cantidad_sku,
          kilometros,
          pedido_base_aplicado,
          valor_sku_aplicado,
          valor_km_aplicado,
          controlar_combustible_aplicado,
          precio_litro_bencina_aplicado,
          rendimiento_km_litro_aplicado,
          created_at
        FROM pedidos
        ORDER BY fecha DESC, id DESC
      `,
    );

  return rows.map(mapPedido);
}

export async function eliminarPedido(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM pedidos
      WHERE id = ?
    `,
    id,
  );
}

export async function existeNumeroOrden(
  db: SQLiteDatabase,
  numeroOrden: string,
): Promise<boolean> {

  const row =
    await db.getFirstAsync<{ total: number }>(
      `
      SELECT COUNT(*) as total
      FROM pedidos
      WHERE numero_orden = ?
      `,
      numeroOrden,
    );

  return (row?.total ?? 0) > 0;
}