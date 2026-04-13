import config from './config/config'
import Sequelize from './database/sequelize/sequelize'
import Logger from './pkg/logger'

import Category from './modules/category/category'
import Http from './transport/http/http'

const Run = async () => {
    const logger = new Logger(config)
    const connection = await Sequelize.Connect(config, logger)

    const http = new Http(logger, config, connection)

    // Start Load Modules
    new Category(logger, config, connection).RunHttp(http)

    // End Load Modules

    // The http.Run() method is likely intended to set up routes or middleware,
    // while Bun.serve actually starts the server.
    // The graceful shutdown logic should apply to the Bun.serve instance.
    http.Run(config.app.port.http)

    const server = Bun.serve({
        port: config.app.port.http,
        fetch: http.app.fetch,
    })

    // Graceful shutdown
    const stop = async () => {
        logger.Info('Shutting down server...')
        server.stop() // Stop the Bun server
        logger.Info('Bun server stopped.')
        await connection.close()
        logger.Info('Database connection closed.')
        process.exit(0)
    }

    process.on('SIGINT', stop)
    process.on('SIGTERM', stop)

    return server
}

export default Run()
