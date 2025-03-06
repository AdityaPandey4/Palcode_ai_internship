#!/bin/bash

# Wait for PostgreSQL
until pg_isready -h db -p 5432 -U user -d leaveapp; do
  echo "Waiting for PostgreSQL..."
  sleep 5
done

# Create database tables
python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"

# Run migrations (if using Alembic)
# alembic upgrade head

# Start the application
# Ensure uvicorn binds to 0.0.0.0
exec uvicorn app:app --host 0.0.0.0 --port 8000 --reload