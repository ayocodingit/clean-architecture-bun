import { Umzug, SequelizeStorage } from 'umzug'
import { Sequelize } from 'sequelize'
import config from './config/config'
import path from 'path'

const database = new Sequelize({
    username: config.db.username,
    password: config.db.password,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.connection as any,
    logging: false,
})

const umzug = new Umzug({
    migrations: {
        glob: path.join(__dirname, 'database/sequelize/migrations/*.ts'),
        resolve: ({ name, path, context }) => {
            const migration = require(path!)
            return {
                name,
                up: async () => migration.up(context, Sequelize),
                down: async () => migration.down(context, Sequelize),
            }
        },
    },
    context: database.getQueryInterface(),
    storage: new SequelizeStorage({
        sequelize: database,
        tableName: 'migrations',
    }),
    logger: console,
})

const run = async () => {
    const cmd = process.argv[2] || 'up'

    try {
        if (cmd === 'up') {
            await umzug.up()
            console.log('Migrations up to date')
        } else if (cmd === 'down') {
            await umzug.down()
            console.log('Migration reverted')
        } else if (cmd === 'status') {
            const pending = await umzug.pending()
            const executed = await umzug.executed()
            console.log(
                'Pending migrations:',
                pending.map((m) => m.name)
            )
            console.log(
                'Executed migrations:',
                executed.map((m) => m.name)
            )
        } else {
            console.error('Unknown command:', cmd)
            process.exit(1)
        }
        process.exit(0)
    } catch (error) {
        console.error('Migration failed:', error)
        process.exit(1)
    }
}

// Check if this script is being run directly
if (require.main === module || !require.main) {
    run()
}

export default {
    development: {
        username: config.db.username,
        password: config.db.password,
        database: config.db.name,
        host: config.db.host,
        dialect: config.db.connection,
    },
}
