import Logger from '../../../pkg/logger'
import { RequestParams } from '../../../helpers/requestParams'
import { Schema } from '../../../database/sequelize/interface'
import type {
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryFilter,
} from './types'

/**
 * Repository Category: layer akses data (Sequelize).
 * Fetch pakai RequestParams (helpers) + CategoryFilter (custom filter di types).
 */
class CategoryRepository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async Fetch(params: RequestParams<CategoryFilter>) {
        const { count, rows } = await this.schema.category.findAndCountAll({
            limit: params.per_page,
            offset: params.offset,
            // where: custom filter dari params (start_date, dll) bisa dipakai di sini
        })

        return {
            data: rows,
            count,
        }
    }

    public async GetById(id: number) {
        return this.schema.category.findByPk(id)
    }

    public async Store(body: CreateCategoryInput) {
        return this.schema.category.create({
            title: body.title,
            description: body.description,
        })
    }

    public async Update(id: number, body: UpdateCategoryInput) {
        return this.schema.category.update(
            {
                title: body.title,
                description: body.description,
            },
            {
                where: { id },
            }
        )
    }

    public async Delete(id: number) {
        return this.schema.category.destroy({
            where: { id },
        })
    }
}

export default CategoryRepository
