
# Authentication and Authorization in NestJS using Passport and OAuth2

A full-featured NestJS project implementing **authentication and authorization** using Passport.js with **OAuth2 (Google)** and JWT.

---

## Features

- User authentication with Google OAuth2
- JWT access and refresh tokens
- Role-based authorization
- Policiy-based authorization RBAC

- Secure password handling
- Prisma ORM integration with PostgreSQL

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
FRONTEND_URL=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
REFRESH_JWT_SECRET=
REFRESH_JWT_EXPIRE_IN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
````

**Description:**

* `FRONTEND_URL` – Your frontend application URL
* `DATABASE_URL` – PostgreSQL connection string
* `JWT_SECRET` – Secret key for signing access tokens
* `JWT_EXPIRES_IN` – Access token expiration (e.g., `1h`)
* `REFRESH_JWT_SECRET` – Secret key for refresh tokens
* `REFRESH_JWT_EXPIRE_IN` – Refresh token expiration (e.g., `7d`)
* `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` – Google OAuth2 credentials
* `GOOGLE_CALLBACK_URL` – Google OAuth callback URL (e.g., `http://localhost:3000/api/auth/google/callback`)

---

## Installation

```bash
# Install dependencies
npm install
```

---

## Running the Project

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Watch mode
npm run start
```

---

## Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## Deployment

Refer to [NestJS deployment docs](https://docs.nestjs.com/faq/deployment) for production setup.
You can deploy to any Node.js compatible cloud service.

---

## License

This project is licensed under the MIT License.

```
