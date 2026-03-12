import { CustomPathFile } from '../../../helpers/file'
import statusCode from '../../../pkg/statusCode'
import Error from '../../../pkg/error'

class Usecase {
    constructor() {}

    public async Upload(file: File) {
        if (!file) {
            throw new Error(statusCode.BAD_REQUEST, 'File is required')
        }

        const path = 'uploads'
        const filename = CustomPathFile(path, file)

        // Bun.write is extremely fast and handles the stream automatically
        await Bun.write(filename, file)

        return {
            filename: filename,
            size: file.size,
            type: file.type
        }
    }
}

export default Usecase
