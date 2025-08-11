FROM arm32v7/debian:bullseye-slim

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN wget -qO - https://archive.raspberrypi.org/debian/raspberrypi.gpg.key | apt-key add -
RUN echo "deb http://archive.raspberrypi.org/debian/ bullseye main" >> /etc/apt/sources.list.d/raspi.list

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libcamera0 \
    libcamera-dev \
    libcamera-apps \
    python3-libcamera \
    python3-picamera2 \
    v4l-utils \
    i2c-tools \
    libatlas-base-dev \
    libopenjp2-7 \
    libtiff5 \
    patch \
    && rm -rf /var/lib/apt/lists/*


# Create app directory
WORKDIR /app


# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir \
    --timeout 100 \
    --retries 5 \
    -r requirements.txt

# Copy application files
COPY . .

# Set environment variables to skip problematic dependencies
ENV PICAMERA2_SKIP_AV=1
ENV PICAMERA2_SKIP_PRCTL=1

# Script needs to run as root to access hardware
USER root

# Command to run the application
CMD ["python", "main.py"]