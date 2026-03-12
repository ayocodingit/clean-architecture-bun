import Logger from '../../../pkg/logger'
import { RequestParams } from '../../../helpers/requestParams'
import { Schema } from '../../../database/sequelize/interface'
import { FilterCategoryDto, CategoryDto } from './dto'

class CategoryRepository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async Fetch(request: RequestParams<FilterCategoryDto>) {
        const { count, rows } = await this.schema.category.findAndCountAll({
            limit: request.per_page,
            offset: request.offset,
        })

        return {
            data: rows,
            count,
        }
    }

    public async GetById(id: number) {
        return this.schema.category.findByPk(id)
    }

    public async Store(body: CategoryDto) {
        return this.schema.category.create({
            title: body.title,
            description: body.description,
        })
    }

    public async Update(id: number, body: CategoryDto) {
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
