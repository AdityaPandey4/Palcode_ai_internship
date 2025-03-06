# Backend Dockerfile
FROM python:3.10-slim

# ---------- FIX 1: Remove problematic `sed` commands ----------
# The `python:3.9-slim` image uses Debian Bullseye, which doesn't have "stretch" repositories.
# The `/etc/apt/sources.list` file either doesn't exist or doesn't need modification here.
# DELETE THESE LINES:
# RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list \
#     && sed -i 's/security.debian.org/archive.debian.org/g' /etc/apt/sources.list \
#     && sed -i '/stretch-updates/d' /etc/apt/sources.list

# Set working directory
WORKDIR /app

# ---------- FIX 2: Simplify dependency installation ----------
# Use `apt-get` directly (no need for complex retry logic here)
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        build-essential \
        postgresql-client \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements file
COPY requirements.txt .

# ---------- FIX 3: Simplify pip install (retries are better handled externally) ----------
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port 8000
EXPOSE 8000

# Use entrypoint script for more robust startup
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]