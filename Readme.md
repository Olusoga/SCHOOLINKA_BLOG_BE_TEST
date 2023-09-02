
# SCHOOLINKA_BE_Test

The task is to Build a REST API for the blog-post management
## Development

Prerequisite

-   Installed Docker

### Start development environment

-   Create `.env` file or run `cp .env.example .env`

You can look for the example in the `.env.example` 

Next up you can choose to run your development environment entirely inside Docker or to run the app server directly on your local machine.

**Running app server inside Docker**

-   Start the development cluster

```bash
docker-compose up -d
```

-   View consolidated logs via Docker Compose

```bash
docker-compose logs -f
```

-   Log into app container

```bash
# the command below will open a shell session inside our app container
docker exec -it Leonardotest sh
# this is for executing CLI in dev env, for i.e. DB migration command like below
npm run migration:run
```

-   Shutdown development cluster

```bash
docker-compose down
```

**Running app server directly on your local machine's environment**

-   Start the db service in Docker

```bash
docker-compose up -d postgres
```

-   Start your app server

```bash
npm run start:dev
# you might also want to migrate the DB with this command below
npm run migration:run
```

-   Shutdown development cluster

```bash
docker-compose down
```

## Testing

Prerequisite

-   Installed Docker
-   Node LTS

**Run the test**

In order to run tests, you need to have a local postgresql running for your test environment:

```bash
# dockest runs a test postgres container for your tests and run migrations for you before starting the test
# dockest will also spin the container down automatically and all data will be wiped clean
npm run test:dockest
```

If you want to do TDD, run the test in watch mode or simply running the test without dockest, you can spin up the test postgres containers

```bash
# Start the test postgres container
docker-compose -f docker-compose.test.yml up -d

# Update the .env file to point to ports 54320 for the test postgres container
npm run migration:run

# Run the test
npm run test
```

## Database migration

You can reference here for the fundamentals for migration with TypeORM [here](https://medium.com/better-programming/typeorm-migrations-explained-fdb4f27cb1b3)

### On first time setting up the DB

Run migration

```bash
npm run migration:run
```

### If you made new changes to the db

It's a good idea to generate a new migration for every atomic changes made to the db

Generate migration

```bash
npm run migration:generate -- -n <migration-name> # eg. add-disbursement-column
```

### If you made a mistake on running migration

Revert will revert migration file by file

Revert migration

```bash
npm run migration:revert
```

### If you need a manual migration

For eg you need to add new extensions or simply custom migration

Create migration

```bash
npm run migration:create -- -n <MigrationName>
```

I had a lot of fun building this but there are some improvements I can still make:


## API

There are multiple endpoints that can be used to retrieve acronyms. Please find below a POSTMAN documentation for easy guide <a href="https://documenter.getpostman.com/view/7667873/2s93JtS4MD">https://documenter.getpostman.com/view/7667873/2s93JtS4MD</a>.

# Todo

I had a lot of fun building this but there are some improvements I can still make:

- Add an application Monitoring tool like sentry
- Add cache system like Redis
- Add more test cases
- add open Api for proper documentation
- Have a standard response helper
- Include a makefile to ease the execution of some common tasks