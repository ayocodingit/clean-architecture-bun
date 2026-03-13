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

## 📂 Folder Structure & Architecture

This boilerplate strictly adheres to the **Clean Architecture** pattern. The core principle is the **Dependency Rule**: _Dependencies only point inwards._ Inner layers (Entities & Use Cases) have no knowledge of outer layers (Frameworks & Drivers).

### 🏗️ Directory Overview

```text
src/
├── config/             # App configuration & ENV management
├── cron/               # Background & Scheduled tasks
├── database/           # Data Persistence Layer
│   ├── repository/     # Interface Adapters: Database implementations
│   └── sequelize/      # Infrastructure: Models & Migrations
├── helpers/            # Pure utility functions (Dates, Request parsing)
├── modules/            # BUSINESS CORE (Encapsulated feature modules)
├── pkg/                # Shared internal library (Logger, JWT, Error)
├── transport/          # Outer Layer: HTTP Server setup & Routing
├── app.ts              # Entry point: App Bootstrapper
└── migrater.ts         # CLI Tool: Database Migration engine
```

### 🛡️ Clean Architecture Layers

#### 1. Entities (`src/modules/*/entity`)

**Enterprise Business Rules**: The most stable layer. Contains data structures (Interfaces) and business validation rules (Joi Schemas).

-   **Interface**: Defines the shape of the data used across the module.
-   **Schema**: Joi validation schemas for incoming data (Store, Update, Params).

#### 2. Use Cases (`src/modules/*/usecase`)

**Application Business Logic**: Orchestrates the flow of data to and from entities.

-   Implements specific business rules.
-   Interacts with **Repository interfaces** to perform data operations.
-   Throws meaningful errors that are caught by the delivery layer.

#### 3. Interface Adapters (`src/database/repository` & `src/modules/*/delivery`)

**The Bridges**:

-   **Delivery (HTTP Handler)**: Translates Elysia context (params, body, query) into Use Case inputs. It handles HTTP status codes and response formatting.
-   **Repositories**: Implements data persistence logic. It interacts with Sequelize models to perform CRUD operations.

#### 4. Frameworks & Drivers (`src/transport/http` & `src/database/sequelize`)

**The Infrastructure**:

-   **Transport**: Configuration of the Elysia server, global middlewares, and route registration.
-   **Sequelize**: Database connection, connection pooling, and model definitions.

### 🧩 Module Deep-Dive

Each directory in `src/modules/` is a self-contained feature module:

-   `[module].ts`: The **Module Registry**. It performs manual dependency injection by instantiating the Repository, Usecase, and Handler, then registers the routes.
-   `usecase/usecase.ts`: Centralizes logic for the feature.
-   `delivery/http/handler.ts`: Handles ElysiaJS requests.
-   `entity/interface.ts`: Defines TypeScript interfaces.
-   `entity/schema.ts`: Defines Joi validation schemas.

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
docker build -t my-app -f docker/Dockerfile .

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
