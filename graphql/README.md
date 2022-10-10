# Prisma example for seeding and GraphQL

## Setup

* `yarn install`
```shell
yarn prisma db push
```

## Seeding

* Create file: [](./prisma/seed.ts)
* Add following to package.json:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```
* Install faker: `yarn add @faker-js/faker`
* Run seed script:
```shell
yarn prisma db seed
```
