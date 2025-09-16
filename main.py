#!/usr/bin/env python3
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import app, db, create_admin_user

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    try:
        with app.app_context():
            print("Connexion à PostgreSQL...")
            db.create_all()
            create_admin_user()
            print("Base de données initialisée")
    except Exception as e:
        print(f"Erreur DB (continuons quand même): {e}")
    
    print(f"Démarrage sur le port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)