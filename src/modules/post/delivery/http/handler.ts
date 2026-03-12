import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { Context } from 'hono'
import statusCode from '../../../../pkg/statusCode'
import { GetMeta, GetRequest } from '../../../../helpers/requestParams'
import { ValidateFormRequest } from '../../../../helpers/validate'
import { Store } from '../../entity/schema'
import { RequestQueryFetch } from '../../entity/interface'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase
    ) {}

    public Fetch = async (c: Context) => {
        try {
            const request = GetRequest<RequestQueryFetch>(c.req.query() as any)
            const { data, count } = await this.usecase.Fetch(request)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(c, statusCode.OK),
            })

            return c.json({ data, meta: GetMeta(request, count) })
        } catch (error) {
            throw error
        }
    }

    public Store = async (c: Context) => {
        try {
            const body = await c.req.json()
            const validate = ValidateFormRequest(Store, body)
            const result = await this.usecase.Store(validate)
            this.logger.Info(statusCode[statusCode.CREATED], {
                additional_info: this.http.AdditionalInfo(
                    c,
                    statusCode.CREATED
                ),
            })
            return c.json(
                { data: result, message: 'CREATED' },
                statusCode.CREATED as any
            )
        } catch (error) {
            throw error
        }
    }
}

export default Handler
