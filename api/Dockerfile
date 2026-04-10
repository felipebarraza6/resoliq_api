# Base image.
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working dir.
WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Add python requirements file.
COPY requirements.txt /code/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /code/

# Create directories for static and media files
RUN mkdir -p /code/static /code/media

# Copy entrypoint script
COPY entrypoint.sh /code/
RUN chmod +x /code/entrypoint.sh

# Expose port
EXPOSE 8000

# Set entrypoint and default command
ENTRYPOINT ["/code/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "60", "api.wsgi:application"]
