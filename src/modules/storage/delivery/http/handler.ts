import { Context } from 'elysia'
import statusCode from '../../../../pkg/statusCode'
import Usecase, { UploadMetadata } from '../../usecase/usecase'

/** Request body: file + field lain (multipart/form-data) */
export type UploadBody = {
    file: File
    description?: string
    category?: string
}

class Handler {
    constructor(private usecase: Usecase) {}

    public Upload = async (ctx: Context) => {
        try {
            const body = ctx.body as UploadBody
            const { file, description, category } = body

            const metadata: UploadMetadata = { description, category }
            const result = await this.usecase.Upload(file, metadata)

            ctx.set.status = statusCode.CREATED
            return { data: result, message: 'UPLOADED' }
        } catch (error) {
            throw error
        }
    }
}

export default Handler
