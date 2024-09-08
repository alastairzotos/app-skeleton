### App Skeleton

This is a skeleton I use for initialising new projects.

It includes:

* Typescript through the whole thing
* A turborepo monorepo with:
* A NestJS Backend on port 3001
  - Drizzle as an ORM, with a created Users table and empty relations
  - Auth using Passport, with local, Google and Facebook strategies
  - Utilities such as Zod validation
* A NextJS frontend on port 3000
  - ESLint support
  - Tailwind
  - No App Router or any of that black magic
* A shared `models` library with user schemas etc
