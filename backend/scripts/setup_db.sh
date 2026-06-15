#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SCHEMA_FILE="$BACKEND_DIR/sql/schema.sql"

: "${PGHOST:?Variable PGHOST manquante}"
: "${PGADMIN_USER:?Variable PGADMIN_USER manquante}"
: "${PGADMIN_PASSWORD:?Variable PGADMIN_PASSWORD manquante}"
: "${APP_DB_PASSWORD:?Variable APP_DB_PASSWORD manquante}"

PGPORT="${PGPORT:-5432}"
APP_DB_NAME="${APP_DB_NAME:-inov_i2}"
APP_DB_USER="${APP_DB_USER:-inov_i2_api}"

echo "Connexion au serveur PostgreSQL : $PGHOST:$PGPORT"
echo "Base cible : $APP_DB_NAME"
echo "Utilisateur applicatif : $APP_DB_USER"

export PGPASSWORD="$PGADMIN_PASSWORD"

echo "Création du rôle et de la base si nécessaire..."

psql \
  -v ON_ERROR_STOP=1 \
  -h "$PGHOST" \
  -p "$PGPORT" \
  -U "$PGADMIN_USER" \
  -d postgres \
  -v db_name="$APP_DB_NAME" \
  -v app_user="$APP_DB_USER" \
  -v app_password="$APP_DB_PASSWORD" <<'SQL'

SELECT format(
  'CREATE ROLE %I WITH LOGIN PASSWORD %L',
  :'app_user',
  :'app_password'
)
WHERE NOT EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = :'app_user'
)\gexec

SELECT format(
  'ALTER ROLE %I WITH LOGIN PASSWORD %L',
  :'app_user',
  :'app_password'
)\gexec

SELECT format(
  'CREATE DATABASE %I OWNER %I',
  :'db_name',
  :'app_user'
)
WHERE NOT EXISTS (
  SELECT 1 FROM pg_database WHERE datname = :'db_name'
)\gexec

SELECT format(
  'GRANT ALL PRIVILEGES ON DATABASE %I TO %I',
  :'db_name',
  :'app_user'
)\gexec

SQL

echo "Attribution des droits sur le schema public..."

psql \
  -v ON_ERROR_STOP=1 \
  -h "$PGHOST" \
  -p "$PGPORT" \
  -U "$PGADMIN_USER" \
  -d "$APP_DB_NAME" \
  -v app_user="$APP_DB_USER" <<'SQL'

GRANT USAGE, CREATE ON SCHEMA public TO :"app_user";

SQL

echo "Création des tables avec l'utilisateur applicatif..."

export PGPASSWORD="$APP_DB_PASSWORD"

psql \
  -v ON_ERROR_STOP=1 \
  -h "$PGHOST" \
  -p "$PGPORT" \
  -U "$APP_DB_USER" \
  -d "$APP_DB_NAME" \
  -f "$SCHEMA_FILE"

echo ""
echo "Base de données prête."
echo ""
echo "DATABASE_URL à mettre dans backend/.env :"
echo "postgresql+psycopg://$APP_DB_USER:TON_MOT_DE_PASSE@$PGHOST:$PGPORT/$APP_DB_NAME"