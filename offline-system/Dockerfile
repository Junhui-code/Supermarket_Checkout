FROM arm32v7/debian:bullseye-slim

# Install Raspberry Pi repo key & source
RUN apt-get update && apt-get install -y wget gnupg && rm -rf /var/lib/apt/lists/*
RUN wget -qO - https://archive.raspberrypi.org/debian/raspberrypi.gpg.key | apt-key add - 
RUN echo "deb http://archive.raspberrypi.org/debian/ bullseye main" > /etc/apt/sources.list.d/raspi.list

# Install system dependencies including pyzbar and OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-setuptools python3-wheel \
    python3-requests python3-numpy \
    python3-opencv \
    libzbar0 python3-pyzbar \
    libcamera0 libcamera-dev libcamera-apps python3-libcamera python3-picamera2 \
    v4l-utils \
    i2c-tools python3-smbus \
    python3-rpi.gpio python3-spidev \
    libjpeg62-turbo libpng16-16 libtiff5 libopenjp2-7 libatlas-base-dev \
    && rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /app

# Copy application files
COPY . .

# Picamera2 quirks inside containers
ENV PICAMERA2_SKIP_AV=1 \
    PICAMERA2_SKIP_PRCTL=1

USER root
CMD ["python3", "main.py"]
