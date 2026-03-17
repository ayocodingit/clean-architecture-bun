import { CustomPathFile } from '../../../helpers/file'
import statusCode from '../../../pkg/statusCode'
import Error from '../../../pkg/error'

export type UploadMetadata = {
    description?: string
    category?: string
}

class Usecase {
    constructor() {}

    public async Upload(file: File, metadata?: UploadMetadata) {
        if (!file) {
            throw new Error(statusCode.BAD_REQUEST, 'File is required')
        }

        const path = 'uploads'
        const filename = CustomPathFile(path, file)

        // Bun.write is extremely fast and handles the stream automatically
        await Bun.write(filename, file)

        return {
            filename,
            size: file.size,
            type: file.type,
            ...(metadata && {
                description: metadata.description,
                category: metadata.category,
            }),
        }
    }
}

export default Usecase
