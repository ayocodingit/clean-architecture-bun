import { Context } from 'elysia'
import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import statusCode from '../../../../pkg/statusCode'
import { GetMeta, GetRequest } from '../../../../helpers/requestParams'
import {
    ValidateFormRequest,
    ValidateParams,
} from '../../../../helpers/validate'
import { Store, Update, Id } from '../../entity/schema'
import { RequestQueryFetch } from '../../entity/interface'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase
    ) {}

    public Fetch = async (ctx: Context) => {
        try {
            const request = GetRequest<RequestQueryFetch>(ctx.query as any)
            const { data, count } = await this.usecase.Fetch(request)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(ctx, statusCode.OK),
            })

            return { data, meta: GetMeta(request, count) }
        } catch (error) {
            throw error
        }
    }

    public Show = async (ctx: Context) => {
        try {
            const { id } = ValidateParams(Id, ctx.params)
            const result = await this.usecase.Show(id)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(ctx, statusCode.OK),
            })

            return { data: result }
        } catch (error) {
            throw error
        }
    }

    public Store = async (ctx: Context) => {
        try {
            const body = ctx.body
            const validate = ValidateFormRequest(Store, body)
            const result = await this.usecase.Store(validate)
            this.logger.Info(statusCode[statusCode.CREATED], {
                additional_info: this.http.AdditionalInfo(
                    ctx,
                    statusCode.CREATED
                ),
            })
            ctx.set.status = statusCode.CREATED
            return { data: result, message: 'CREATED' }
        } catch (error) {
            throw error
        }
    }

    public Update = async (ctx: Context) => {
        try {
            const { id } = ValidateParams(Id, ctx.params)
            const body = ctx.body
            const validate = ValidateFormRequest(Update, body)
            await this.usecase.Update(id, validate)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(ctx, statusCode.OK),
            })

            return { message: 'UPDATED' }
        } catch (error) {
            throw error
        }
    }

    public Delete = async (ctx: Context) => {
        try {
            const { id } = ValidateParams(Id, ctx.params)
            await this.usecase.Delete(id)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(ctx, statusCode.OK),
            })

            return { message: 'DELETED' }
        } catch (error) {
            throw error
        }
    }

    public Export = async (ctx: Context) => {
        try {
            const { data } = await this.usecase.Fetch({
                limit: 1000,
                page: 1,
            } as any)

            const header = 'ID,Title,Description,Created At\n'
            const rows = data
                .map(
                    (item: any) =>
                        `${item.id},"${item.title}","${item.description}",${item.created_at}`
                )
                .join('\n')

            const csv = header + rows

            ctx.set.headers['Content-Type'] = 'text/csv'
            ctx.set.headers[
                'Content-Disposition'
            ] = `attachment; filename="categories_${Date.now()}.csv"`

            return csv
        } catch (error) {
            throw error
        }
    }
}

export default Handler
