#!/usr/bin/env python3
import os
import sys

# Ajouter le répertoire backend au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import app, db, create_admin_user, User, Content
from datetime import datetime

def create_sample_data():
    # Créer du contenu de démonstration
    if Content.query.count() == 0:
        admin = User.query.filter_by(username='admin').first()
        if admin:
            contents = [
                Content(
                    title="Bienvenue dans Foi et Raison",
                    description="Découvrez notre communauté chrétienne dédiée à l'approfondissement de la foi.",
                    content_type="article",
                    author_id=admin.id,
                    is_published=True
                ),
                Content(
                    title="La prière quotidienne",
                    description="L'importance de la prière dans la vie chrétienne.",
                    content_type="article",
                    author_id=admin.id,
                    is_published=True
                ),
                Content(
                    title="Étude biblique",
                    description="Approfondissons ensemble la Parole de Dieu.",
                    content_type="video",
                    author_id=admin.id,
                    is_published=True
                )
            ]
            for content in contents:
                db.session.add(content)
            db.session.commit()

if __name__ == '__main__':
    # Configuration pour Railway
    port = int(os.environ.get('PORT', 5000))
    
    # Initialiser la base de données
    with app.app_context():
        db.create_all()
        create_admin_user()
        create_sample_data()
    
    # Démarrer l'application
    app.run(host='0.0.0.0', port=port, debug=False)