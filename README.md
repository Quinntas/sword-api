# Maintenance Tasks API

is a maintenance task tracking API designed to account for daily maintenance tasks performed by technicians. The
API supports two types of users:

- **Technicians:** Can create, view, and update only their own tasks.
- **Managers:** Can view all tasks, delete tasks, and receive notifications whenever a technician performs a task.

This README outlines the project’s architecture, the repository pattern implementation, automatic API documentation, and
key benefits and cons.

---

## Architecture Overview

The project follows a layered architecture organized into clear domains:

- **Contracts:** Defines common abstractions like caching and command interfaces.
- **Core:** Contains the main building blocks of the application such as controllers, methods, and types. It ensures a
  uniform approach to handling HTTP requests.
- **Infra:** Implements infrastructure concerns such as Redis caching.
- **Modules:** Organized by domain (e.g., *user*, *task*, *shared*). Each module encapsulates its resources,
  repositories, and routes.
- **Start:** Bootstraps the application with initialization of the server, database, caching, and route registrations.
- **Utils:** Utility functions for cryptography, environment variable management, and JWT handling.

This modular organization improves code readability, maintainability, and allows different team members to work on
separate domains without overlap.

---

## Repository Pattern & Command Testing

The project uses a **repository pattern** to decouple business logic from persistence logic:

- **Repository Layer:**  
  Each domain (e.g., Users, Tasks) includes a repository (e.g., `UserRepository`) responsible for interacting with the
  MySQL database. For example, the `UserRepository` provides functions like `createUser` and `getUserWithUsername` for
  CRUD operations.

- **Command Pattern:**  
  Business logic is encapsulated in command classes (e.g., `CreateUserCommand` and `LoginCommand`). These commands take
  repository functions as dependencies, which simplifies unit testing because the repository can be easily mocked. This
  separation of concerns leads to more maintainable and testable code.

- **Testing:**  
  Unit tests are implemented (using Vitest) to verify command behavior. By injecting repository functions, tests focus
  solely on the business logic, ensuring a high level of test coverage and reliability.

---

## Auto Documentation

The API includes automatic documentation support via Swagger:

- **Swagger Integration:**  
  The project registers Swagger and Swagger-UI plugins with Fastify in the `start/app.ts` file. This integration:
    - Automatically generates interactive API documentation.
    - Helps both developers and API consumers understand available endpoints, request/response schemas, and error
      messages.
- **Schema Validation:**  
  The use of **Zod** for schema definitions ensures that all endpoints are validated and well-documented, reducing
  runtime errors and improving developer productivity.

---

## Project Benefits

- **Modular Architecture:**  
  Clear separation of concerns makes the codebase easier to understand, maintain, and scale.
- **Repository & Command Patterns:**  
  Decoupling persistence logic from business logic facilitates easier unit testing and faster development cycles.
- **Built-in Caching:**  
  Redis integration and caching decorators reduce redundant processing and improve performance.
- **Automatic Documentation:**  
  Swagger integration provides an interactive UI for exploring and testing endpoints.
- **Security & Best Practices:**  
  The project uses encryption utilities, environment management, and JWT-based authentication to ensure secure
  interactions.
- **Scalable Design:**  
  The architecture supports future enhancements such as adding message brokers for decoupled notifications and
  Kubernetes deployment configurations.

---

## Project Cons & Considerations

- **Initial Complexity:**  
  The modular structure and multiple abstraction layers (contracts, core, modules) might be initially complex for
  developers unfamiliar with the patterns.
- **Setup Overhead:**  
  Integrating and configuring all the tools (Fastify, Swagger, Redis, MySQL, Vitest) may require additional effort
  during onboarding.
- **Notification Handling:**  
  Current notifications (printing to console) are non-blocking but are simplistic. For production scenarios, a robust
  message broker integration is advisable.

---

## Setup and Running the Application

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Quinntas/sword-api
   cd sword-api
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the project root and configure the following:
   ```
   DATABASE_URL=your-mysql-connection-string
   REDIS_URL=your-redis-connection-string
   PEPPER=your-pepper
   JWT_SECRET=your-jwt-secret
   ```

4. **Running in Docker:**
   Use the provided Docker setup for a local development environment with MySQL:
   ```bash
   docker-compose up -d
   ```

5. **Start the Application:**
   ```bash
   pnpm run dev
   ```
   The server listens on port `3000` and the documentation is available at `/docs`.

---

## Testing

Unit tests are implemented using Vitest:

```bash
pnpm run test
```

Tests are located alongside command implementations (e.g., `createUser.command.test.ts`, `login.command.test.ts`),
ensuring that the business logic is properly verified.

