import config from './config/config'
import Sequelize from './database/sequelize/sequelize'
import Logger from './pkg/logger'

import Category from './modules/category/category'
import Storage from './modules/storage/storage'
import Http from './transport/http/http'

const Run = async () => {
    const logger = new Logger(config)
    const connection = await Sequelize.Connect(config, logger)

    const http = new Http(logger, config, connection)

    // Start Load Modules
    new Category(logger, config, connection).RunHttp(http)

    new Storage(logger, config).RunHttp(http)
    // End Load Modules

    http.Run(config.app.port.http)

    return Bun.serve({
        port: config.app.port.http,
        fetch: http.app.fetch,
    })
}

export default Run()
