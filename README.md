# Foi & Raison - Plateforme Communautaire

## 🎯 Description
Plateforme communautaire pour contenus religieux avec gestion multimédia, Q&A, et administration complète.

## 🚀 Installation

### Prérequis
- Python 3.8+
- PostgreSQL
- Docker (optionnel)

### Configuration locale
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Configuration base de données
createdb foi_raison
python app.py init-db

# Lancer le serveur
python app.py
```

### Docker
```bash
docker-compose up --build
```

## 📁 Structure
```
foi-et-raison/
├── backend/          # API Flask
├── frontend/         # Interface utilisateur
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration
Créer `.env` dans `/backend`:
```
DATABASE_URL=postgresql://user:pass@localhost/foi_raison
JWT_SECRET_KEY=your-secret-key
UPLOAD_FOLDER=uploads
```