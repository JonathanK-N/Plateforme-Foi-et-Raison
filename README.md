# Croire & Penser - Plateforme Communautaire

## 🎯 Description
Plateforme communautaire pour contenus religieux avec gestion multimédia, Q&A, et administration complète. 

**Slogan :** "Amener les croyants à penser, et les penseurs à croire"

## ✨ Nouvelles Fonctionnalités Thématiques

### 📚 Contenu Thématique Organisé
- **11 catégories thématiques** selon le plan de contenu :
  - Dieu (existence, nature, trinité)
  - Bible (authenticité, interprétation)
  - Jésus-Christ (historicité, divinité)
  - Saint-Esprit (dons, miracles)
  - Salut (foi, religions)
  - Église (communauté, culte)
  - Être humain (âme, éthique)
  - Le mal (origine, souffrance)
  - Monde invisible (anges, esprits)
  - La fin (eschatologie, éternité)
  - Éthique (morale, société)

### 🎨 Formats de Contenu Variés
- **Articles approfondis** avec références bibliques
- **Vidéos teasers** et enseignements
- **Podcasts** hebdomadaires
- **Carrousels interactifs** pour les réseaux sociaux
- **Études bibliques** structurées

### 📖 Références Bibliques Intégrées
- Système de références bibliques automatique
- Citations avec versets et contexte
- Versions multiples (LSG par défaut)

### 📧 Newsletter Thématique
- Inscription newsletter mensuelle
- Contenus sélectionnés par thème
- Notifications de nouveaux contenus

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
createdb croire_penser
python app.py  # Initialise automatiquement

# Peupler avec du contenu d'exemple
python populate_content.py
```

### Docker
```bash
docker-compose up --build
```

## 📁 Structure Mise à Jour
```
croire-et-penser/
├── backend/
│   ├── app.py              # API Flask principale
│   ├── populate_content.py # Script de peuplement
│   └── requirements.txt
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   ├── thematic-new.css  # Styles thématiques
│   │   │   └── ...
│   │   ├── js/
│   │   │   ├── thematic.js       # Gestion contenu thématique
│   │   │   └── ...
│   │   └── ...
│   └── templates/
│       └── index.html      # Interface mise à jour
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

## 🎯 Plan de Contenu 2026

### Rythme de Publication Recommandé
- **1 article ou vidéo longue** par semaine
- **1 publication courte/interactive** par semaine
- **1 live/table ronde** par mois

### Formats Diversifiés
- Chaque thème décliné en article, vidéo et podcast
- Infographies et carrousels pour la vulgarisation
- Interaction communautaire avec Q&R mensuels

## 🔑 Comptes par Défaut
- **Admin :** admin@foietraison.ca / admin123

## 🌐 API Endpoints Thématiques
- `GET /api/thematic/categories` - Liste des catégories
- `GET /api/thematic/content` - Contenu thématique (avec filtres)
- `GET /api/thematic/content/<slug>` - Détail d'un contenu
- `POST /api/newsletter/subscribe` - Inscription newsletter
- `POST /api/admin/thematic/content` - Création de contenu (admin)

## 📱 Fonctionnalités Interface
- **Page Thématiques** avec navigation par catégories
- **Filtres avancés** par type de contenu
- **Modal de détail** avec références bibliques
- **Système de likes** et statistiques
- **Newsletter intégrée** dans l'interface