#!/bin/sh

# Wait for PostgreSQL to be ready using password authentication
until PGPASSWORD=$DB_PASSWORD psql -h db -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed the database
npm run prisma:seed

# Start application
npm start