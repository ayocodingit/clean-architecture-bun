import type { Schema } from './interface'

/**
 * Setup relasi antar model (hasMany, belongsTo, hasOne, belongsToMany).
 * Dipanggil setelah semua model di-load di SequelizeClient.Models().
 *
 * Contoh:
 *   schema.user.hasMany(schema.post, { foreignKey: 'user_id' })
 *   schema.post.belongsTo(schema.user, { foreignKey: 'user_id' })
 */
export function setupRelations(schema: Schema): void {
    // Tambah relasi di sini, misalnya:
    // schema.category.hasMany(schema.post, { foreignKey: 'category_id' })
    // schema.post.belongsTo(schema.category, { foreignKey: 'category_id' })
}
