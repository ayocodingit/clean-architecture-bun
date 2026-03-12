## Structure Folder Src

```
.
├── config
│   ├── config.interface.ts // type of config
│   ├── config.schema.ts // schema validation
│   ├── config.ts // setting configuration from .env
│   └── config.validate.ts // helper running validation
├── cron // execution need of running cron job
├── database
├── examples // developer examples and tests
├── external // integration of third party with Redis, etc.
├── helpers
├── modules // define modules
├── pkg // reusable library
├── transport // initial transport like HTTP (Hono)
│   └── http
│       └── http.ts
├── app.ts // execution server (Bun.serve)
└── migrater.ts // config database for running migration
```
