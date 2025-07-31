<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

# 🧰 Job Listing API (NestJS)

A RESTful API built with **NestJS** to fetch job position every morning and retrieve job listings with powerful filtering, pagination, and documentation support via Swagger.

---

## 🚀 Features

- Get job listings with filters:

| Name          | Type   | Description                      |
| ------------- | ------ | -------------------------------- |
| `jobName`     | string | Filter by job title              |
| `companyName` | string | Filter by company name           |
| `minSalary`   | number | Minimum salary filter            |
| `maxSalary`   | number | Maximum salary filter            |
| `page`        | number | Page number for pagination       |
| `limit`       | number | Number of items per page (limit) |


- Pagination support (page & limit)
- Swagger documentation
- Data validation using class-validator & class-transformer
- Clean architecture with providers and DTOs
- E2E test support

---

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
$ npm run start

$ npm run start:dev

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```
The API will be available at http://localhost:3000.

Swagger UI is available at: http://localhost:3000/api

## Stay in touch

- Author - [Farzaneh Najafipoor](fn.najafipoor@gmail.com)
