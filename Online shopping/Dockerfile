# Use ARM-compatible Node image for Raspberry Pi
FROM balenalib/raspberrypi3-node:20-bullseye

# Install OS dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

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