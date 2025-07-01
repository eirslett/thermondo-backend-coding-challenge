#!/bin/sh
DATABASE_NAME="eirslett-movie-ratings"

psql postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${DATABASE_NAME}' AND pid <> pg_backend_pid()"
psql postgres -c "drop database if exists \"${DATABASE_NAME}\""
psql postgres -c "drop user if exists \"${DATABASE_NAME}\""

# Create new database and user
psql postgres -c "create database \"${DATABASE_NAME}\""
psql postgres -c "create user \"${DATABASE_NAME}\" with password '${DATABASE_NAME}'"
psql postgres -c "alter database \"${DATABASE_NAME}\" owner to \"${DATABASE_NAME}\""

npm run db:testdata
