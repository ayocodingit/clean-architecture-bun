import { RequestParams } from '../../../helpers/requestParams'
import Logger from '../../../pkg/logger'
import { RequestBody, RequestQueryFetch, Update } from '../entity/interface'
import CategoryRepository from '../../../database/repository/category/category'
import statusCode from '../../../pkg/statusCode'
import Error from '../../../pkg/error'

class Usecase {
    constructor(
        private logger: Logger,
        private categoryRepository: CategoryRepository
    ) {}

    public async Fetch(request: RequestParams<RequestQueryFetch>) {
        const result = await this.categoryRepository.Fetch(request)
        return result
    }

    public async Show(id: number) {
        const result = await this.categoryRepository.GetById(id)
        if (!result) {
            throw new Error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }
        return result
    }

    public async Store(body: RequestBody) {
        return this.categoryRepository.Store(body)
    }

    public async Update(id: number, body: Update) {
        await this.Show(id)
        return this.categoryRepository.Update(id, body)
    }

    public async Delete(id: number) {
        await this.Show(id)
        return this.categoryRepository.Delete(id)
    }
}

export default Usecase
