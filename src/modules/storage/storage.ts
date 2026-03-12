import { Config } from '../../config/config.interface'
import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Handler from './delivery/http/handler'
import Usecase from './usecase/usecase'

class Storage {
    constructor(
        private logger: Logger,
        private config: Config
    ) {}

    public RunHttp(http: Http) {
        const usecase = new Usecase()
        const handler = new Handler(usecase)

        const router = http.Router()

        router.post('/', handler.Upload)

        http.SetRouter('/v1/storage', router)
    }
}

export default Storage
