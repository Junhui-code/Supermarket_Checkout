FROM arm32v7/debian:bullseye-slim

# --- Core system ---
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    udev \
    libglib2.0-0 \
    libxkbcommon0 \
    libdrm2 \
    libexif12 \
    libjpeg62-turbo \
    && rm -rf /var/lib/apt/lists/*

# --- Raspberry Pi repository setup ---
RUN wget -qO - https://archive.raspberrypi.org/debian/raspberrypi.gpg.key | apt-key add - && \
    echo "deb http://archive.raspberrypi.org/debian/ bullseye main" > /etc/apt/sources.list.d/raspi.list

# --- Camera tools ---
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libcamera0 \
    libcamera-apps \
    python3-picamera2 \
    v4l-utils \
    i2c-tools \
    && rm -rf /var/lib/apt/lists/*

# --- App setup ---
WORKDIR /app
COPY camera_test.py .

CMD ["python3", "camera_test.py"]
