#!/usr/bin/env python3
import os
import sys

# Ajouter le répertoire backend au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import app, db, create_admin_user

if __name__ == '__main__':
    # Configuration pour Railway
    port = int(os.environ.get('PORT', 5000))
    
    try:
        # Initialiser la base de données
        with app.app_context():
            print("Tentative de connexion à la base de données...")
            db.create_all()
            print("Tables créées avec succès")
            create_admin_user()
            print("Utilisateur admin créé")
        
        print(f"Démarrage de l'application sur le port {port}")
        # Démarrer l'application
        app.run(host='0.0.0.0', port=port, debug=False)
        
    except Exception as e:
        print(f"Erreur lors du démarrage: {e}")
        # Démarrer quand même l'application
        app.run(host='0.0.0.0', port=port, debug=False)