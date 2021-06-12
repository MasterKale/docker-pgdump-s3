# iamkale/docker-pgdump-s3
[![Docker Hub Version Shield](https://img.shields.io/docker/v/iamkale/docker-pgdump-s3/latest?label=Docker%20Hub&style=flat-square)](https://hub.docker.com/r/iamkale/docker-pgdump-s3)

## Overview

A Docker image for scheduling regular backups of Postgres to S3 via `pgdump`.

The service utilizes AWS S3 multi-part uploads & streaming. This means there is no need for large amounts of local storage where
the docker container is running, as the data is proxied directly to AWS without being written to disk. This results in a low memory footprint (~50mb) for the running service during backup, and fairly low CPU usage (~5% when testing during dumping).

The architecture looks like:

```
[Postgres DB] ---> [docker-pgdump-s3] ---> [AWS S3 bucket]
```

## Requirements

- S3 bucket
- AWS credentials to push to S3 bucket
- Postgres host, username, password

### A warning about `pgdump`

**`pgdump` will fail to back up your database if there is a version discrepancy!** Make sure the version of this project you use is built with the same **major** version of Postgres as your current database.

For example, if you upgrade your Postgres database from 12 to **13**, then you must *also* upgrade your reference to this Docker image to one built with Postgres **13**.

**Current Docker image Postgres version:**
- Postgres 13.3

Check [Releases](https://github.com/MasterKale/docker-pgdump-s3/releases) for older versions to confirm the version of `pgdump` they contain.

## Quick Start

You can quickly get started with a single `docker run` command:

`docker run -d --env-file=service.env iamkale/docker-pgdump-s3`

If you use Docker Compose you can use the following service definition instead:

```yaml
services:
  dbbackup:
    image: iamkale/docker-pgdump-s3
    depends_on:
      - db
    networks:
      - database_network
    environment:
      - PGHOST=db
      - PGUSER=${POSTGRES_USER}
      - PGPASSWORD=${POSTGRES_PASSWORD}
      - PGDATABASE=postgres
      - S3_BUCKET=db-backups
      - S3_REGION=us-west-1
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      # Everyday @ 1AM
      - CRON_SCHEDULE="0 1 * * *"
```
> NOTE: values surrounded by `${...}` represent environment variables provided by your project's **.env** file

## Environment Variables

The following environment variables are available for configuration, and are **required** unless marked optional.
- `PGHOST`: Database hostname
- `PGUSER`: Database username
- `PGPASSWORD`: Database password
- `PGDATABASE`: Database name
- `S3_BUCKET`: S3 bucket name
- `S3_REGION`: S3 bucket's region
- `AWS_ACCESS_KEY_ID`: AWS access key ID with access to the bucket
- `AWS_SECRET_ACCESS_KEY`: Corresponding AWS secret access key
- `CRON_SCHEDULE`: A [valid cron schedule](https://crontab.guru/) to perform backups, wrapped in double-quotes (e.g. `"0 1 * * *"`)
- (optional) `S3_STORAGE_CLASS`: One of the following values (see [here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html) for more info)
  - `STANDARD` (default)
  - `REDUCED_REDUNDANCY`
  - `STANDARD_IA`
  - `ONEZONE_IA`
  - `INTELLIGENT_TIERING`
  - `GLACIER`
  - `DEEP_ARCHIVE`
  - `OUTPOSTS`
- (optional) `S3_URL`: AWS S3 URL to upload to
- (optional) `PG_PARAMS`: Parameters to pass to `pgdump`
- (optional) `BACKUP_EXTENSION`: Backup file extension (defaults to `backup`)
