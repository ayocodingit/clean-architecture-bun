import { ModelStatic, Sequelize, Op } from 'sequelize'

/** Koneksi DB (return dari Connect). Dipakai di app, transport, dan saat panggil Models(connection). */
export type Connection = Sequelize

/** Type dasar model Sequelize (findAll, create, update, destroy, dll). */
export type Model = ModelStatic<any>

/**
 * Schema = return dari Models(connection).
 * Dipakai di repository: schema.category, schema.connection, schema.Op.
 * Setiap tambah model: (1) load di sequelize.ts, (2) tambah property di sini.
 */
export type Schema = {
    category: Model
    // tambah model lain: namaModel: Model

    connection: Connection
    Op: typeof Op
}
