### App Skeleton

This is a skeleton I use for initialising new projects.

It includes:

* A turborepo monorepo with:
* A NestJS Backend
  - Drizzle as an ORM, with a created Users table and empty relations
  - Auth using Passport, with local, Google and Facebook strategies
  - Utilities such as Zod validation
* A NextJS frontend
* A shared `models` library with user schemas etc
