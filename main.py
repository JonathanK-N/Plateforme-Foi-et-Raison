#!/usr/bin/env python3
import os
from flask import Flask, render_template, jsonify

# Application Flask simple
app = Flask(__name__, template_folder='frontend/templates', static_folder='frontend/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/contents')
def get_contents():
    # Données de démonstration sans base de données
    return jsonify([
        {
            'id': 1,
            'title': 'Bienvenue dans Foi et Raison',
            'description': 'Découvrez notre communauté chrétienne dédiée à l\'approfondissement de la foi.',
            'content_type': 'article',
            'views': 0,
            'created_at': '2024-01-01T00:00:00'
        },
        {
            'id': 2,
            'title': 'La prière quotidienne',
            'description': 'L\'importance de la prière dans la vie chrétienne.',
            'content_type': 'article',
            'views': 0,
            'created_at': '2024-01-01T00:00:00'
        }
    ])

@app.route('/api/questions')
def get_questions():
    return jsonify([])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Démarrage de l'application sur le port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)