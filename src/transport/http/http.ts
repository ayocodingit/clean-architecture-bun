import { Elysia, Context } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import statusCode from '../../pkg/statusCode'
import { Config } from '../../config/config.interface'
import Error from '../../pkg/error'
import Logger from '../../pkg/logger'
import { Connection } from '../../database/sequelize/interface'

type responseError = {
    message?: string | object
    errors?: object
}

type SetRouterOptions = {
    tags?: string | string[]
}

class Http {
    public app: Elysia

    constructor(
        private logger: Logger,
        private config: Config,
        private connection: Connection
    ) {
        this.app = new Elysia()
        this.plugins()
        this.ping()
        this.onError()
    }

    private plugins() {
        this.app.use(cors())
        this.app.use(
            swagger({
                provider: 'scalar',
                documentation: {
                    info: {
                        title: this.config.app.name,
                        version: '1.0.0',
                    },
                },
                path: '/docs',
                scalarConfig: { spec: { url: 'json' } },
            })
        )
    }

    private onError = () => {
        this.app.error({
            ERROR: Error,
        })

        this.app.onError(({ code, error, set, request }) => {
            const resp: responseError = {}
            let status: number = statusCode.INTERNAL_SERVER_ERROR

            if (error instanceof Error) {
                if ('status' in error) {
                    status = (error as any).status
                }
                resp.message =
                    'isObject' in error && (error as any).isObject
                        ? JSON.parse(error.message)
                        : error.message
            } else if (code === 'NOT_FOUND') {
                status = statusCode.NOT_FOUND
                resp.message = statusCode[statusCode.NOT_FOUND]
            } else {
                resp.message =
                    (error as any)?.message || 'Internal Server Error'
            }

            const url = new URL(request.url)
            const ignoredPaths = ['/favicon.ico', '/sw.js']

            if (!ignoredPaths.includes(url.pathname)) {
                this.logger.Error(
                    (error as any)?.message || 'Internal Server Error',
                    {
                        additional_info: this.AdditionalInfo(
                            { request, set } as any,
                            status
                        ),
                    }
                )
            }

            if (
                status >= statusCode.INTERNAL_SERVER_ERROR &&
                this.config.app.env === 'production'
            ) {
                resp.message = statusCode[statusCode.INTERNAL_SERVER_ERROR]
            }

            if (status === statusCode.UNPROCESSABLE_ENTITY) {
                resp.errors = resp.message as object
                delete resp.message
            }

            set.status = status as any
            return resp
        })
    }

    public AdditionalInfo(ctx: Context, code: number) {
        const { request, user } = ctx as any
        const url = new URL(request.url)
        return {
            env: this.config.app.env,
            http_uri: url.pathname,
            http_host: url.host,
            http_method: request.method,
            http_scheme: url.protocol.replace(':', ''),
            remote_addr: '1.1',
            user_agent: request.headers.get('user-agent'),
            origin: request.headers.get('origin') || 'unknown',
            tz: new Date(),
            code: code,
            user: user || {},
        }
    }

    public SetRouter(
        prefix: string,
        handler: Elysia<any>,
        opts?: SetRouterOptions
    ) {
        const path = (this.config.app.prefix + prefix).replace(/\/+/g, '/')
        const mount = new Elysia({ prefix: path })

        if (opts?.tags) {
            mount.guard(
                {
                    detail: {
                        tags: Array.isArray(opts.tags)
                            ? opts.tags
                            : [opts.tags],
                    },
                },
                (app) => app.use(handler)
            )
        } else {
            mount.use(handler)
        }

        this.app.use(mount)
    }

    public Tag(tags: string | string[]) {
        return {
            detail: { tags: Array.isArray(tags) ? tags : [tags] },
        }
    }

    public Router() {
        return new Elysia()
    }

    private ping = () => {
        this.app.get('/', async (ctx) => {
            // test connection to database
            await this.connection.query('SELECT 1+1 AS result')

            this.logger.Info('OK', {
                additional_info: this.AdditionalInfo(ctx as any, statusCode.OK),
            })

            return {
                app_name: this.config.app.name,
            }
        })
    }

    public Run(port: number) {
        this.logger.Info(`Server http is ready at port ${port}`)
    }
}

export default Http
