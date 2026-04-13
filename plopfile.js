module.exports = function (plop) {
    plop.setGenerator('module', {
        description: 'Generate a new module (Usecase + Handler)',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Module name please',
            },
            {
                type: 'input',
                name: 'repository',
                message: 'Repository name please',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/modules/{{camelCase name}}/{{camelCase name}}.ts',
                templateFile: 'plop-templates/module/module.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/modules/{{camelCase name}}/delivery/http/handler.ts',
                templateFile: 'plop-templates/module/delivery/http/handler.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/modules/{{camelCase name}}/delivery/http/contract.ts',
                templateFile: 'plop-templates/module/delivery/http/contract.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/modules/{{camelCase name}}/entity/interface.ts',
                templateFile: 'plop-templates/module/entity/interface.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/modules/{{camelCase name}}/entity/schema.ts',
                templateFile: 'plop-templates/module/entity/schema.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/modules/{{camelCase name}}/usecase/usecase.ts',
                templateFile: 'plop-templates/module/usecase/usecase.ts.hbs',
            },
            {
                type: 'modify',
                path: 'src/app.ts',
                pattern: /(import Http from '\.\/transport\/http\/http')/g,
                template: "import {{properCase name}} from './modules/{{camelCase name}}/{{camelCase name}}'\n$1",
            },
            {
                type: 'modify',
                path: 'src/app.ts',
                pattern: /(\/\/ End Load Modules)/g,
                template: 'new {{properCase name}}(logger, config, connection).RunHttp(http)\n    $1',
            },
        ],
    });
    plop.setHelper('timestamp', () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        return `${yyyy}${mm}${dd}${hh}${min}${ss}`;
    });

    plop.setGenerator('cron', {
        description: 'Generate a new cron job',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Cron job name please',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/cron/{{kebabCase name}}.cron.ts',
                templateFile: 'plop-templates/cron/cron.ts.hbs',
            },
        ],
    });

    plop.setGenerator('migration', {
        description: 'Generate a new migration',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Migration name please',
                default: 'create-table',
            },
            {
                type: 'input',
                name: 'table',
                message: 'Table name please',
                default: 'posts',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/database/sequelize/migrations/{{timestamp}}-{{kebabCase name}}.ts',
                templateFile: 'plop-templates/migration/migration.ts.hbs',
            },
        ],
    });

    plop.setGenerator('model', {
        description: 'Generate a new migration + model + repository',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Migration name please',
                default: 'create-table',
            },
            {
                type: 'input',
                name: 'repository',
                message: 'Repository name please',
                default: 'post',
            },
            {
                type: 'input',
                name: 'table',
                message: 'Table name please',
                default: 'posts',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/database/sequelize/migrations/{{timestamp}}-{{kebabCase name}}.ts',
                templateFile: 'plop-templates/migration/migration.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/database/repository/{{camelCase repository}}/repository.ts',
                templateFile: 'plop-templates/repository/repository.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/database/repository/{{camelCase repository}}/types.ts',
                templateFile: 'plop-templates/repository/types.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/database/repository/{{camelCase repository}}/contract.ts',
                templateFile: 'plop-templates/repository/contract.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/database/sequelize/models/{{kebabCase repository}}.ts',
                templateFile: 'plop-templates/model/model.ts.hbs',
            },
            {
                type: 'modify',
                path: 'src/database/sequelize/interface.ts',
                pattern: /(export type Schema = \{\n    connection: Connection\n    Op: typeof Op\n})/g,
                template: 'export type Schema = {\n    connection: Connection\n    Op: typeof Op\n    {{camelCase repository}}: Model\n    // tambah model: namaModel: Model\n}',
            },
            {
                type: 'modify',
                path: 'src/database/sequelize/sequelize.ts',
                pattern: /(import { Connection } from '\.\/interface')/g,
                template: "import {{pascalCase repository}} from './models/{{kebabCase repository}}'\n$1",
            },
            {
                type: 'modify',
                path: 'src/database/sequelize/sequelize.ts',
                pattern: /(public static Models = \(connection: Connection\) => \{\n        \/\/ Tambah model di sini \(dari make:model\), lalu daftarkan di interface\.ts \(type Schema\)\n        const schema = \{\n            connection,\n            Op,\n        \})/g,
                template: 'public static Models = (connection: Connection) => {\n        // Tambah model di sini (dari make:model), lalu daftarkan di interface.ts (type Schema)\n        const {{camelCase repository}} = {{pascalCase repository}}(connection)\n        const schema = {\n            connection,\n            Op,\n            {{camelCase repository}},\n        }',
            },
        ],
    });
};
