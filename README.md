### App Skeleton

This is a skeleton I use for initialising new projects.

It includes:

* Typescript through the whole thing
* A turborepo monorepo with:
* A NestJS Backend on port 3001
  - Drizzle as an ORM with users and posts tables
  - Typesafe database tables using @repo/models package
  - Auth using bitmetro persona
  - Utilities such as Zod validation
* A NextJS frontend on port 3000
  - ESLint support
  - Tailwind
  - No App Router or any of that black magic
  - Auth using bitmetro persona
* A shared `models` library with example schemas
* An access control library

--- 

## Setup

#### Initial steps

* Copy existing `.env.example` files into corresponding `.env` files
* Update values such as `APP_NAME` in `.env` files 
* Run `docker-compose up -d`
  - Modify the database name, user, password etc in `docker-compose.yml` if necessary
* Install dependencies with `yarn`
* Generate the migration files with `yarn db:generate`
* Run migrations with `yarn db:migrate`
* Start the applications with `yarn dev`


#### SuperTokens
* Go to the dashboard at http://localhost:3001/api/v1/auth/dashboard/
* Follow instructions to create a new admin user (remove API key line)
* Look up setting up email and SMS auth: https://supertokens.com/docs/thirdpartypasswordless/nestjs/guide
