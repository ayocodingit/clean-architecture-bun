import { Config } from '../../config/config.interface'
import Logger from '../../pkg/logger'
import { Sequelize as createConnection, Dialect, Op } from 'sequelize'
import Category from './models/category'
import { Connection } from './interface'
import { setupRelations } from './relations'

class SequelizeClient {
    public static async Connect({ db }: Config, logger: Logger) {
        const connection = new createConnection({
            logging: false,
            dialect: db.connection as Dialect,
            username: db.username,
            password: db.password,
            host: db.host,
            port: db.port,
            database: db.name,
            pool: {
                min: db.pool.min,
                max: db.pool.max,
                acquire: db.pool.acquire,
                idle: db.pool.idle,
            },
        })

        try {
            await connection.authenticate()
            logger.Info('Sequelize connection to database established')
        } catch (error: any) {
            logger.Error('Sequelize connection error: ' + error.message)
            process.exit(-1)
        }

        return connection
    }

    public static Models = (connection: Connection) => {
        const category = Category(connection)
        // Tambah model lain di sini, lalu daftarkan di interface.ts (type Schema)

        const schema = {
            category,
            connection,
            Op,
        }

        setupRelations(schema)
        return schema
    }

    public static Disconnect = (connection: Connection) => {
        return connection.close()
    }
}

export default SequelizeClient
