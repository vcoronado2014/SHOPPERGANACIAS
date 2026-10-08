import { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(
  db: SQLiteDatabase,
): Promise<void> {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS dias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT NOT NULL UNIQUE,

      asegurado_aplicado REAL NOT NULL,
      porcentaje_boleta_aplicado REAL NOT NULL,

      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      dia_id INTEGER NOT NULL,

      numero_orden TEXT NOT NULL,
      fecha TEXT NOT NULL,

      ventana_inicio TEXT NOT NULL,
      ventana_fin TEXT NOT NULL,

      cantidad_sku INTEGER NOT NULL,
      kilometros REAL NOT NULL,

      pedido_base_aplicado REAL NOT NULL,
      valor_sku_aplicado REAL NOT NULL,
      valor_km_aplicado REAL NOT NULL,

      controlar_combustible_aplicado INTEGER NOT NULL,
      precio_litro_bencina_aplicado REAL NOT NULL,
      rendimiento_km_litro_aplicado REAL NOT NULL,

      created_at TEXT NOT NULL,

      FOREIGN KEY (dia_id)
        REFERENCES dias(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bonos_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      pedido_id INTEGER NOT NULL,

      descripcion TEXT NOT NULL,
      monto REAL NOT NULL,

      FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bonos_dia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      dia_id INTEGER NOT NULL,

      descripcion TEXT NOT NULL,
      monto REAL NOT NULL,

      FOREIGN KEY (dia_id)
        REFERENCES dias(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_dias_fecha
      ON dias(fecha);

    CREATE INDEX IF NOT EXISTS idx_pedidos_dia
      ON pedidos(dia_id);

    CREATE INDEX IF NOT EXISTS idx_pedidos_fecha
      ON pedidos(fecha);

    CREATE INDEX IF NOT EXISTS idx_bonos_pedido
      ON bonos_pedido(pedido_id);

    CREATE INDEX IF NOT EXISTS idx_bonos_dia
      ON bonos_dia(dia_id);
  `);
}