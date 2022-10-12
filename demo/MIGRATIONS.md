# Migrations

`prisma db push` good for development:

* prototyping
* does not keep intermediate changes
* might cause data loss

To persist changes, use `prisma migrate`

* Creates new database with existing migrations (shadow database)
* Applies current state of schema to development database
* Finds difference
* Writes difference to file

```shell
yarn prisma migrate dev --name init
```

Migrations are stored in [](prisma/migrations) folder.

## Make changes to schema

Add following to Profile model in [](prisma/schema.prisma):

```
updatedAt DateTime @updatedAt
```

Generate new migrations:

```shell
yarn prisma migrate dev --name porfile-updatedAt
```

For production, use `prisma migrate deploy` instead of `prisma migrate dev`.

## Windows vs Linux vs MySQL

* By default, Prisma uses CamelCase table names
* Migrations that change existing tables derive table names from actual database.
* Windows is case-sensitive, so table `Profile` is stored as `profile` with default settings.
* This means, that create migration uses `Profile`, but alter uses `profile`
* Which is fine on Windows
* Not in Linux :sigh:
