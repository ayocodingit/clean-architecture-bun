# Boilerplate Clean Architecture for Bun

![Bun Logo](https://bun.sh/logo.svg)

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/ayocodingit/boilerplate-clean-architecture)
[![Maintainability](https://api.codeclimate.com/v1/badges/12c10806992f9baa009f/maintainability)](https://codeclimate.com/github/ayocodingit/boilerplate-clean-architecture/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/12c10806992f9baa009f/test_coverage)](https://codeclimate.com/github/ayocodingit/boilerplate-clean-architecture/test_coverage)

## 📖 Introduction

This boilerplate is a robust and scalable foundation for building applications using **Clean Architecture** principles, powered by the **Bun** runtime. It is designed to help developers create maintainable, testable, and loosely coupled systems.

By separating concerns into distinct layers (Entities, Use Cases, Interface Adapters, Frameworks), this boilerplate ensures that your business logic remains independent of frameworks, databases, and external agencies.

## 🚀 Why use this boilerplate?

-   **Separation of Concerns**: Business rules are isolated from implementation details.
-   **Testability**: The architecture makes it easy to test business logic without UI, database, or web server.
-   **Scalability**: Easy to add new features and maintain existing ones as the project grows.
-   **Type Safety**: Built with **TypeScript** for better developer experience and code reliability.
-   **Database Agnostic**: While it comes with **Sequelize**, the repository pattern allows you to switch databases with minimal impact on business logic.
-   **Ready-to-use Features**: Includes Docker support, linting, migration tools, and more.

## ✨ Features

-   **Clean Architecture Layers**:
    -   **Entities**: Enterprise business rules.
    -   **Use Cases**: Application business rules.
    -   **Interface Adapters**: Controllers, Gateways, Presenters.
    -   **Frameworks & Drivers**: Web Framework (Express), Database (Sequelize), etc.
-   **Tech Stack**:
    -   **Runtime**: Bun v1.3+
    -   **Language**: TypeScript (Native Support)
    -   **Framework**: Hono (High Performance)
    -   **ORM**: Sequelize (SQL)
    -   **Containerization**: Docker (Bun Alpine)
    -   **Testing**: Bun Test (Native)
    -   **HTTP Client**: Native Fetch API
    -   **File Upload**: Bun Native (Zero-copy)
    -   **Logging**: Winston
    -   **Validation**: Joi

## 📂 Folder Structure

The project structure is organized to reflect the Clean Architecture layers:

```text
src/
├── config/             # Environment variables and configuration
├── cron/               # Cron jobs
├── database/           # Database migrations, seeds, and repositories
│   └── repository/     # Data access implementation
├── examples/           # Developer examples (Tests, Patterns)
├── external/           # External API integrations (Redis, etc.)
├── helpers/            # Utility functions
├── modules/            # Business logic (The Core)
│   └── [module_name]/
│       ├── entity/     # Domain entities/interfaces/schemas
│       ├── delivery/   # HTTP Handlers (Hono context)
│       └── usecase/    # Application business rules
├── pkg/                # Shared packages/libraries
├── transport/          # Entry points (HTTP)
│   └── http/
├── app.ts              # Application entry point (Bun.serve)
└── migrater.ts         # Migration runner (Umzug)
```

## 🛠️ Installation & Setup

### Prerequisites

-   [Bun](https://bun.sh/) (v1.3 or higher)
-   [Docker](https://www.docker.com/) (optional, for containerized run)

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ayocodingit/clean-architecture-bun.git
    cd clean-architecture-bun
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Environment Configuration:**

    Copy the example environment file and update it with your credentials.

    ```bash
    cp .env.example .env
    ```

4.  **Database Setup:**

    Ensure your database is running (update `.env` with DB credentials). Then run migrations:

    ```bash
    bun run migrate
    ```

    (Optional) Seed the database:

    ```bash
    bun run seed:run --name=your-seed-filename
    ```

## 🏃 Usage

### Development Mode

Runs the application with hot-reloading.

```bash
bun run dev
```

### Production Build

Builds the TypeScript code to JavaScript.

```bash
bun run build
```

Start the built application:

```bash
bun start
```

### Docker

Build and run the application using Docker.

```bash
# Build image
docker -f docker/Dockerfile build -t my-app .

# Run container
docker run -p 3000:3000 -d my-app
```

## 🧪 Testing

Automated tests are exclusively focused on core utility functions in the `src/helpers` directory.

To run tests:

```bash
bun test
```

or

```bash
bun run test:unit
```

## 📚 Developer Examples

We have provided a set of organized tests and examples in `src/examples/tests` to help you understand the new Bun-native capabilities:

-   **`fetch_example.test.ts`**: Demonstrates how to use Bun's native `fetch` for external API requests (replaces `axios`).
-   **`storage.test.ts`**: Shows high-performance file uploading using Hono's `parseBody()` and `Bun.write()`.
-   **`redis.test.ts`**: Verification of Redis connectivity and basic Store/Get operations.
-   **`error_handling.test.ts`**: Examples of global error handling (404 and 500).
-   **`pagination_validation.test.ts`**: Demonstration of form validation and API pagination metadata.

## 📝 Tutorial: Creating a New Module

You can easily generate a new module using the built-in CLI command. This command will create the necessary files and folders following the Clean Architecture structure.

```bash
bun run make:module <module-name>
```

Example:

```bash
bun run make:module product
```

This will create:

-   `src/modules/product/product.ts`
-   `src/modules/product/delivery/http/handler.ts`
-   `src/modules/product/entity/interface.ts`
-   `src/modules/product/entity/schema.ts`
-   `src/modules/product/usecase/usecase.ts`
-   `src/database/repository/product/product.ts` (Implementation)
-   `src/database/repository/product/dto.ts` (Data Transfer Objects)

After generation, you just need to implement your specific business logic in these files.

## 📝 Tutorial: Creating a New Migration

You can generate a new TypeScript migration file using the built-in CLI command. This ensures the file is correctly named with a timestamp and follows the project's standard.

```bash
bun run make:migration
```

You will be prompted to enter a descriptive name for the migration (e.g., `create-users-table`).

Example Output:
`src/database/sequelize/migrations/20231203153000-create-users-table.ts`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
