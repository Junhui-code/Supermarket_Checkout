#!/bin/sh

# Wait for PostgreSQL to be ready using proper credentials
until PGPASSWORD=$DB_PASSWORD psql -h db -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

# Enable UUID extension
PGPASSWORD=$DB_PASSWORD psql -h db -U "$DB_USER" -d "$DB_NAME" -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed the database
npm run prisma:seed

# Start application
npm start