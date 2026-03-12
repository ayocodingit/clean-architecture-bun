import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { compress } from 'hono/compress'
import { logger as honoLogger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'
import { prettyJSON } from 'hono/pretty-json'
import statusCode from '../../pkg/statusCode'
import { Config } from '../../config/config.interface'
import Error from '../../pkg/error'
import Logger from '../../pkg/logger'
import { Connection } from '../../database/sequelize/interface'

type responseError = {
    message?: string | object
    errors?: object
}

class Http {
    public app: Hono

    constructor(
        private logger: Logger,
        private config: Config,
        private connection: Connection
    ) {
        this.app = new Hono()
        this.plugins()
        this.ping()
        this.pageNotFound()
        this.onError()
    }

    private plugins() {
        this.app.use('*', cors())
        this.app.use('*', compress())
        this.app.use('*', poweredBy())
        this.app.use('*', prettyJSON())
        this.app.use(
            '*',
            honoLogger((str) => this.logger.Info(str))
        )
    }

    private pageNotFound = () => {
        this.app.notFound((c) => {
            return c.json(
                {
                    message: statusCode[statusCode.NOT_FOUND],
                },
                statusCode.NOT_FOUND as any
            )
        })
    }

    private onError = () => {
        this.app.onError((error: any, c) => {
            const resp: responseError = {}
            const code =
                Number(error.status) || statusCode.INTERNAL_SERVER_ERROR
            resp.message =
                error.message || statusCode[statusCode.INTERNAL_SERVER_ERROR]

            if (error.isObject) resp.message = JSON.parse(error.message)

            this.logger.Error(error.message, {
                additional_info: this.AdditionalInfo(c, code),
            })

            if (
                code >= statusCode.INTERNAL_SERVER_ERROR &&
                this.config.app.env === 'production'
            ) {
                resp.message = statusCode[statusCode.INTERNAL_SERVER_ERROR]
            }

            if (code === statusCode.UNPROCESSABLE_ENTITY) {
                resp.errors = resp.message as object
                delete resp.message
            }

            return c.json(resp, code as any)
        })
    }

    public AdditionalInfo(c: any, statusCode: number) {
        return {
            env: this.config.app.env,
            http_uri: c.req.path,
            http_host: this.GetDomain(c),
            http_method: c.req.method,
            http_scheme: 'http', // Bun usually runs behind proxy or native http
            remote_addr: '1.1', // Hono abstracting this
            user_agent: c.req.header('user-agent'),
            origin: c.req.header('origin') || 'unknown',
            tz: new Date(),
            code: statusCode,
            user: c.get('user') || {},
        }
    }

    public GetDomain(c: any) {
        return c.req.header('host')
    }

    public SetRouter(prefix: string, ...handlers: any[]) {
        const path = (this.config.app.prefix + prefix).replace(/\/+/g, '/')
        // Hono uses app.route for nesting, but here we just mount handlers/routers
        handlers.forEach((handler) => {
            this.app.route(path, handler)
        })
    }

    public Router() {
        return new Hono()
    }

    private ping = () => {
        this.app.get('/', async (c) => {
            // test connection to database
            await this.connection.query('SELECT 1+1 AS result')

            this.logger.Info('OK', {
                additional_info: this.AdditionalInfo(c, statusCode.OK),
            })

            return c.json({
                app_name: this.config.app.name,
            })
        })
    }

    public Run(port: number) {
        // Note: Running handled via Bun.serve in app.ts
        this.logger.Info(`Server http is ready at port ${port}`)
    }
}

export default Http
