### App Skeleton

This is a skeleton I use for initialising new projects.

It includes:

* Typescript through the whole thing
* A turborepo monorepo with:
* A NestJS Backend on port 3001
  - Drizzle as an ORM with an example table
  - Typesafe database tables using @repo/models package
  - Auth using SuperTokens
  - Utilities such as Zod validation
* A NextJS frontend on port 3000
  - ESLint support
  - Tailwind
  - No App Router or any of that black magic
  - Auth using SuperTokens
* A shared `models` library with example schemas

--- 

To setup:
* Supertokens
  - Look up setting up email and SMS auth: https://supertokens.com/docs/thirdpartypasswordless/nestjs/guide
  - Update database name, user, password in docker-compose between both db and supertokens services