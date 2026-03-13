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
    -   **Framework**: ElysiaJS (High Performance)
    -   **ORM**: Sequelize (SQL)
    -   **Containerization**: Docker (Bun Alpine)
    -   **Testing**: Bun Test (Native)
    -   **HTTP Client**: Native Fetch API
    -   **File Upload**: Bun Native (Zero-copy)
    -   **Logging**: Winston
    -   **Validation**: Joi

## 📂 Folder Structure & Clean Architecture Layers

This boilerplate strictly follows Clean Architecture. Here's a deep dive into each layer:

### 1. `src/modules/[module_name]/entity` (Entities)

**The Core Layer**: Contains enterprise business rules.

-   **Interfaces**: Definitions of the data structures.
-   **Schemas**: Validation logic (using **Joi**).
-   _Rules_: This layer must not depend on any other layer or external libraries (except validation).

### 2. `src/modules/[module_name]/usecase` (Use Cases)

**The Business Logic Layer**: Contains application-specific business rules.

-   Orchestrates the flow of data to and from entities.
-   Interacts with Repository interfaces to fetch/save data.
-   _Rules_: Independent of database and framework.

### 3. `src/database/repository` (Interface Adapters - Repositories)

**The Data Access Layer**: Converts data from the format most convenient for the use cases and entities to the format most convenient for external agencies (Database).

-   Implements the repository interfaces defined in the core.
-   Uses **Sequelize** for SQL operations.

### 4. `src/modules/[module_name]/delivery/http` (Interface Adapters - Handlers)

**The Delivery Layer**: Converts data from the format most convenient for the web framework (Elysia context) to the format needed by Use Cases.

-   Handles requests, extracts parameters, and returns responses.
-   Implements HTTP-specific logic (Status codes, Headers).

### 5. `src/transport/http` (Frameworks & Drivers)

**The Infrastructure Layer**: Configuration of the Elysia server, middlewares, and routing.

```text
src/
├── config/             # Configuration & ENV management
├── cron/               # Scheduled background tasks
├── database/           # Persistence layer (Migrations, Repositories)
├── helpers/            # Utility functions (Date, Validation, etc.)
├── modules/            # BUSINESS CORE (Encapsulated by module)
├── pkg/                # Shared internal packages (Logger, JWT, Error)
├── transport/          # External entry points (HTTP)
├── app.ts              # App Bootstrapper
└── migrater.ts         # DB Migration engine
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
-   **`storage.test.ts`**: Shows high-performance file uploading using Elysia's `body` and `Bun.write()`.
-   **`redis.test.ts`**: Verification of Redis connectivity and basic Store/Get operations.
-   **`error_handling.test.ts`**: Examples of global error handling (404 and 500).
-   **`pagination_validation.test.ts`**: Demonstration of form validation and API pagination metadata.

## 🛠️ Generating Code (Scaffolding)

You can quickly scaffold new components using the built-in CLI commands. These commands ensure your code follows the **Clean Architecture** structure and project standards.

### 1. Generate Model (Full Stack)

Generates the complete database layer: **Migration**, **Sequelize Model**, and **Repository** (with DTO). It also automatically registers the model in the Sequelize configuration.

```bash
bun run make:model
```

_Prompts: Migration name, Repository name, Table name._

### 2. Generate Module (Logic & Routing)

Generates the business logic and API layer: **Module entry**, **Usecase**, **Handler**, and **Entities** (Interface/Schema). It also automatically registers the module in `app.ts`.

```bash
bun run make:module
```

_Prompts: Module name, Repository name (to link the logic to data)._

### 3. Generate Migration (Standalone)

Generates **only** a timestamped TypeScript migration file for manual schema changes.

```bash
bun run make:migration
```

_Prompts: Migration name, Table name._

### 4. Generate Cron Job

Generates a new background task structure in `src/cron/`.

```bash
bun run make:cron
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
