## Frontend

### Description
Application React de gestion de caméras de surveillance en temps réel avec capture d'images et vérification de visages.

### Stack technologique
- **React** avec TypeScript
- **Vite** (ou ton build tool)
- **Axios** pour les appels API
- **API Python externe** pour la détection de visages

### Installation

```bash
cd frontend
npm install

## Backend

Le backend se trouve dans le dossier `backend/`.

### Installation

Se placer dans le dossier backend :

```bash
cd backend
```

Créer l’environnement virtuel :

```bash
python -m venv .venv
```

Activer l’environnement virtuel :

```bash
source .venv/bin/activate
```

Sur Windows PowerShell :

```powershell
.venv\Scripts\Activate.ps1
```

Installer les dépendances :

```bash
pip install -r requirements.txt
```

### Configuration

Créer un fichier `.env` à partir du fichier `.env.example` :

```bash
cp .env.example .env
```

Le fichier `.env` doit contenir au minimum :

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:PORT/DB_NAME
FRONTEND_URL=http://localhost:5173
```

Le fichier `.env` ne doit jamais être envoyé sur GitHub.

### Lancement

Lancer le serveur backend :

```bash
fastapi dev app/main.py
```

Ou :

```bash
uvicorn app.main:app --reload
```

API disponible sur :

```txt
http://localhost:8000
```

Documentation Swagger :

```txt
http://localhost:8000/docs
```

Tant que la BDD n’est pas active, seules les routes qui ne dépendent pas de PostgreSQL peuvent être testées, comme :

```txt
GET /health
GET /docs
```

---

## BDD

La base de données utilisée par le backend est PostgreSQL.

Lorsque le serveur PostgreSQL sera disponible, il faudra récupérer auprès de l’équipe :

- l’adresse du serveur ;
- le port PostgreSQL ;
- le nom de la base ;
- l’utilisateur ;
- le mot de passe.

Ces informations serviront à compléter le fichier `backend/.env` :

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:PORT/DB_NAME
FRONTEND_URL=http://localhost:5173
```

### Mise en place de la base

Depuis la racine du projet, définir les variables nécessaires :

```bash
export PGHOST="adresse-du-serveur"
export PGPORT="5432"

export PGADMIN_USER="postgres"
export PGADMIN_PASSWORD="mot_de_passe_admin"

export APP_DB_NAME="inov_i2"
export APP_DB_USER="inov_i2_api"
export APP_DB_PASSWORD="mot_de_passe_api"
```

Puis lancer le script :

```bash
./backend/scripts/setup_db.sh
```

Ce script sert à créer/configurer la base PostgreSQL et les tables nécessaires au backend.

### Après configuration

Une fois la BDD disponible et le fichier `.env` correctement renseigné, relancer le backend :

```bash
cd backend
source .venv/bin/activate
fastapi dev app/main.py
```

Les routes liées à la BDD pourront alors être testées depuis :

```txt
http://localhost:8000/docs
```