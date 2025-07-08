FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache postgresql-client openssl

# Create app directory
WORKDIR /app

# Copy package files FIRST
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma/schema.prisma ./prisma/schema.prisma

# Generate Prisma client
RUN npx prisma generate

# Copy all other files
COPY . .

# Set execute permission
RUN chmod +x entrypoint.sh

# Expose port
EXPOSE 5000

# Use entrypoint script
ENTRYPOINT ["./entrypoint.sh"]