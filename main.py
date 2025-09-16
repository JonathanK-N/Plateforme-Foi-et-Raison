#!/usr/bin/env python3
import os
import sys

# Ajouter le répertoire backend au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import app, db, create_admin_user

if __name__ == '__main__':
    # Configuration pour Railway
    port = int(os.environ.get('PORT', 5000))
    
    # Initialiser la base de données
    with app.app_context():
        db.create_all()
        create_admin_user()
    
    # Démarrer l'application
    app.run(host='0.0.0.0', port=port, debug=False)