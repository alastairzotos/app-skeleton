## Setup

#### Initial steps

* Copy existing `.env.example` files into corresponding `.env` files
* Update `.env` files
* Run `docker-compose up -d`
  - Modify the database name, user, password etc in `docker-compose.yml` if necessary
* Install dependencies with `yarn`
* Build common packages with `cd libs/common && yarn build`
* Generate the migration files with `yarn db:generate`
* Run migrations with `yarn db:migrate`
* Start the applications with `yarn dev`
