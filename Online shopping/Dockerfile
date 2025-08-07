# Use official AMD64 Node image
FROM arm32v7/node:20-bullseye-slim

# Create app directory
WORKDIR /usr/src/app

# Copy application files
COPY server.js .
COPY index.html .

# Install Node dependencies
RUN npm install express pg

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]