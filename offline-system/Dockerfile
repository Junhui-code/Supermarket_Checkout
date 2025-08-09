FROM python:3.9-slim-bullseye

# Install minimal dependencies
RUN apt-get update && apt-get install -y \
    libatlas-base-dev \
    libopenjp2-7 \
    libtiff5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]