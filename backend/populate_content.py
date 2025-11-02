#!/usr/bin/env python3
"""
Script pour peupler la base de données avec du contenu thématique
selon le plan de contenu "Croire & Penser"
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, ThematicCategory, ThematicContent, BiblicalReference, User
from datetime import datetime, date
import json

def create_sample_content():
    """Crée du contenu d'exemple selon le plan thématique"""
    
    with app.app_context():
        # Vérifier qu'un utilisateur admin existe
        admin_user = User.query.filter_by(role='admin').first()
        if not admin_user:
            print("Aucun utilisateur admin trouvé. Création d'un admin...")
            admin_user = User(
                nom='Admin',
                prenom='Système',
                sexe='M',
                telephone='0000000000',
                email='admin@foietraison.ca',
                date_naissance=date(1990, 1, 1),
                accepte_jesus='oui',
                baptise='oui',
                annee_bapteme=2000,
                password_hash='admin123',
                role='admin'
            )
            db.session.add(admin_user)
            db.session.commit()

        # Récupérer les catégories
        categories = {cat.slug: cat for cat in ThematicCategory.query.all()}
        
        # Contenu d'exemple pour chaque catégorie
        sample_contents = [
            {
                'title': 'Comment pouvons-nous être sûrs de l\'existence de Dieu ?',
                'slug': 'existence-de-dieu',
                'category': 'dieu',
                'content_type': 'article',
                'format_type': 'long-form',
                'content': '''
                <h2>Introduction</h2>
                <p>La question de l'existence de Dieu est fondamentale pour tout croyant. Comment pouvons-nous avoir une certitude raisonnable de Son existence ?</p>
                
                <h3>Les preuves philosophiques</h3>
                <p>Depuis des siècles, les philosophes ont développé plusieurs arguments rationnels pour l'existence de Dieu :</p>
                <ul>
                    <li><strong>L'argument cosmologique :</strong> Tout ce qui existe a une cause. L'univers existe, donc il a une cause première.</li>
                    <li><strong>L'argument téléologique :</strong> La complexité et l'ordre de l'univers suggèrent un dessein intelligent.</li>
                    <li><strong>L'argument moral :</strong> L'existence de valeurs morales objectives pointe vers un législateur moral absolu.</li>
                </ul>
                
                <h3>Le témoignage de la création</h3>
                <p>La Bible nous enseigne que la création elle-même témoigne de l'existence de Dieu. Comme l'écrit l'apôtre Paul dans Romains 1:20, "les perfections invisibles de Dieu, sa puissance éternelle et sa divinité, se voient comme à l'œil nu, depuis la création du monde, quand on les considère dans ses ouvrages."</p>
                
                <h3>L'expérience personnelle</h3>
                <p>Au-delà des arguments rationnels, beaucoup de croyants témoignent d'une expérience personnelle de Dieu qui confirme leur foi. Cette expérience, bien que subjective, n'en est pas moins réelle pour celui qui la vit.</p>
                
                <h2>Conclusion</h2>
                <p>La certitude de l'existence de Dieu repose sur une combinaison d'arguments rationnels, de témoignages bibliques et d'expérience personnelle. La foi n'est pas aveugle, mais s'appuie sur des fondements solides.</p>
                ''',
                'excerpt': 'Exploration des arguments philosophiques, bibliques et expérientiels qui nous permettent d\'avoir une certitude raisonnable de l\'existence de Dieu.',
                'reading_time': 8,
                'is_featured': True,
                'biblical_refs': [
                    {'book': 'Romains', 'chapter': 1, 'verse_start': 20, 'text': 'En effet, les perfections invisibles de Dieu, sa puissance éternelle et sa divinité, se voient comme à l\'œil nu, depuis la création du monde, quand on les considère dans ses ouvrages.'},
                    {'book': 'Psaumes', 'chapter': 19, 'verse_start': 1, 'text': 'Les cieux racontent la gloire de Dieu, Et l\'étendue manifeste l\'œuvre de ses mains.'}
                ]
            },
            {
                'title': 'La théorie de l\'évolution et la foi chrétienne sont-elles compatibles ?',
                'slug': 'evolution-foi-chretienne',
                'category': 'dieu',
                'content_type': 'article',
                'format_type': 'long-form',
                'content': '''
                <h2>Une question complexe</h2>
                <p>La relation entre la théorie de l'évolution et la foi chrétienne suscite de nombreux débats. Peut-on être à la fois chrétien et accepter l'évolution ?</p>
                
                <h3>Différentes approches</h3>
                <p>Les chrétiens adoptent diverses positions sur cette question :</p>
                <ul>
                    <li><strong>Créationnisme jeune-terre :</strong> Lecture littérale de Genèse, terre âgée de quelques milliers d'années</li>
                    <li><strong>Créationnisme vieille-terre :</strong> Acceptation de l'âge scientifique de la terre, mais rejet de l'évolution</li>
                    <li><strong>Évolution théiste :</strong> Dieu utilise l'évolution comme moyen de création</li>
                </ul>
                
                <h3>Principes d'interprétation</h3>
                <p>Il est important de distinguer entre les vérités théologiques essentielles de Genèse (Dieu est créateur, l'homme est créé à son image) et les détails du processus de création.</p>
                
                <h2>Conclusion</h2>
                <p>Cette question nécessite humilité et respect mutuel entre chrétiens ayant des positions différentes, tout en maintenant les vérités centrales de la foi.</p>
                ''',
                'excerpt': 'Analyse des différentes positions chrétiennes sur l\'évolution et exploration des moyens de concilier science et foi.',
                'reading_time': 12,
                'is_featured': False,
                'biblical_refs': [
                    {'book': 'Genèse', 'chapter': 1, 'verse_start': 1, 'text': 'Au commencement, Dieu créa les cieux et la terre.'},
                    {'book': 'Genèse', 'chapter': 1, 'verse_start': 27, 'text': 'Dieu créa l\'homme à son image, il le créa à l\'image de Dieu, il créa l\'homme et la femme.'}
                ]
            },
            {
                'title': 'En quoi un livre vieux de 2000 ans peut-il me concerner ?',
                'slug': 'bible-actualite',
                'category': 'bible',
                'content_type': 'article',
                'format_type': 'interactive',
                'content': '''
                <h2>Une question légitime</h2>
                <p>Beaucoup se demandent pourquoi un livre ancien comme la Bible pourrait avoir une pertinence pour notre époque moderne.</p>
                
                <h3>L'universalité de la condition humaine</h3>
                <p>Bien que les contextes changent, les questions fondamentales de l'humanité restent les mêmes : Qui suis-je ? Pourquoi suis-je là ? Comment vivre une vie qui a du sens ?</p>
                
                <h3>Des principes intemporels</h3>
                <p>La Bible contient des principes moraux et spirituels qui transcendent les époques :</p>
                <ul>
                    <li>L'amour du prochain</li>
                    <li>La justice et la compassion</li>
                    <li>Le pardon et la réconciliation</li>
                    <li>L'espoir face à l'adversité</li>
                </ul>
                
                <h3>Une sagesse pratique</h3>
                <p>Les enseignements bibliques offrent une sagesse pratique pour naviguer dans les défis de la vie moderne, des relations interpersonnelles à l'éthique professionnelle.</p>
                
                <h2>Conclusion</h2>
                <p>La Bible reste pertinente car elle s'adresse aux besoins profonds et universels de l'âme humaine, qui ne changent pas avec le temps.</p>
                ''',
                'excerpt': 'Découvrez pourquoi la Bible, malgré son âge, reste d\'une actualité saisissante pour notre époque moderne.',
                'reading_time': 6,
                'is_featured': True,
                'biblical_refs': [
                    {'book': '2 Timothée', 'chapter': 3, 'verse_start': 16, 'text': 'Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice.'},
                    {'book': 'Hébreux', 'chapter': 4, 'verse_start': 12, 'text': 'Car la parole de Dieu est vivante et efficace, plus tranchante qu\'une épée quelconque à deux tranchants.'}
                ]
            },
            {
                'title': 'Jésus a-t-il vraiment existé ?',
                'slug': 'existence-historique-jesus',
                'category': 'jesus-christ',
                'content_type': 'article',
                'format_type': 'long-form',
                'content': '''
                <h2>Une question historique</h2>
                <p>L'existence historique de Jésus est-elle un fait établi ou une croyance religieuse ? Que disent les historiens ?</p>
                
                <h3>Le consensus historique</h3>
                <p>La grande majorité des historiens, qu'ils soient chrétiens ou non, s'accordent sur l'existence historique de Jésus de Nazareth. Même les historiens sceptiques comme Bart Ehrman affirment cette réalité.</p>
                
                <h3>Les sources historiques</h3>
                <p>Plusieurs types de sources attestent de l'existence de Jésus :</p>
                <ul>
                    <li><strong>Sources chrétiennes :</strong> Les Évangiles et les lettres du Nouveau Testament</li>
                    <li><strong>Sources juives :</strong> Flavius Josèphe, le Talmud</li>
                    <li><strong>Sources païennes :</strong> Tacite, Suétone, Pline le Jeune</li>
                </ul>
                
                <h3>Critères d'authenticité historique</h3>
                <p>Les historiens utilisent plusieurs critères pour évaluer l'authenticité des récits sur Jésus :</p>
                <ul>
                    <li>Critère d'embarras (éléments gênants pour les premiers chrétiens)</li>
                    <li>Critère de discontinuité (éléments uniques à Jésus)</li>
                    <li>Critère d'attestation multiple (rapporté par plusieurs sources indépendantes)</li>
                </ul>
                
                <h2>Conclusion</h2>
                <p>L'existence historique de Jésus est un fait largement accepté par la communauté historique. La question n'est pas "a-t-il existé ?" mais plutôt "que pouvons-nous savoir de lui historiquement ?"</p>
                ''',
                'excerpt': 'Examen des preuves historiques de l\'existence de Jésus et du consensus académique sur cette question.',
                'reading_time': 10,
                'is_featured': True,
                'biblical_refs': [
                    {'book': 'Luc', 'chapter': 1, 'verse_start': 1, 'verse_end': 4, 'text': 'Plusieurs ayant entrepris de composer un récit des événements qui se sont accomplis parmi nous...'},
                    {'book': 'Jean', 'chapter': 1, 'verse_start': 14, 'text': 'Et la parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité.'}
                ]
            },
            {
                'title': 'La contraception est-elle un péché ?',
                'slug': 'contraception-ethique-chretienne',
                'category': 'ethique',
                'content_type': 'article',
                'format_type': 'long-form',
                'content': '''
                <h2>Une question éthique complexe</h2>
                <p>La contraception soulève des questions importantes pour les couples chrétiens. Comment aborder cette question à la lumière de la foi ?</p>
                
                <h3>Différentes perspectives chrétiennes</h3>
                <p>Les Églises chrétiennes ont des positions variées :</p>
                <ul>
                    <li><strong>Église catholique :</strong> Opposition à la contraception artificielle</li>
                    <li><strong>Églises protestantes :</strong> Généralement acceptation de la contraception dans le mariage</li>
                    <li><strong>Églises orthodoxes :</strong> Position nuancée, accent sur la responsabilité parentale</li>
                </ul>
                
                <h3>Principes bibliques à considérer</h3>
                <p>Bien que la Bible ne traite pas explicitement de la contraception moderne, plusieurs principes peuvent guider la réflexion :</p>
                <ul>
                    <li>La bénédiction des enfants (Psaume 127:3)</li>
                    <li>La responsabilité parentale (1 Timothée 5:8)</li>
                    <li>L'amour conjugal (1 Corinthiens 7:3-5)</li>
                    <li>La sagesse dans la planification (Proverbes 27:14)</li>
                </ul>
                
                <h3>Facteurs à considérer</h3>
                <p>Les couples chrétiens peuvent prendre en compte :</p>
                <ul>
                    <li>Leur situation économique et sociale</li>
                    <li>Leur santé physique et mentale</li>
                    <li>Leur capacité à élever des enfants</li>
                    <li>Leur conviction personnelle devant Dieu</li>
                </ul>
                
                <h2>Conclusion</h2>
                <p>Cette question nécessite une réflexion prayerful et une recherche de la volonté de Dieu pour chaque couple, dans le respect des convictions de chacun.</p>
                ''',
                'excerpt': 'Exploration des différentes perspectives chrétiennes sur la contraception et des principes bibliques à considérer.',
                'reading_time': 8,
                'is_featured': False,
                'biblical_refs': [
                    {'book': 'Psaumes', 'chapter': 127, 'verse_start': 3, 'text': 'Voici, des fils sont un héritage de l\'Éternel, Le fruit des entrailles est une récompense.'},
                    {'book': '1 Timothée', 'chapter': 5, 'verse_start': 8, 'text': 'Si quelqu\'un n\'a pas soin des siens, et principalement de ceux de sa famille, il a renié la foi, et il est pire qu\'un infidèle.'}
                ]
            }
        ]
        
        # Créer le contenu
        for content_data in sample_contents:
            # Vérifier si le contenu existe déjà
            existing = ThematicContent.query.filter_by(slug=content_data['slug']).first()
            if existing:
                print(f"Contenu '{content_data['title']}' existe déjà, ignoré.")
                continue
            
            category = categories.get(content_data['category'])
            if not category:
                print(f"Catégorie '{content_data['category']}' non trouvée pour '{content_data['title']}'")
                continue
            
            # Créer le contenu thématique
            content = ThematicContent(
                title=content_data['title'],
                slug=content_data['slug'],
                content=content_data['content'],
                excerpt=content_data['excerpt'],
                category_id=category.id,
                content_type=content_data['content_type'],
                format_type=content_data['format_type'],
                author_id=admin_user.id,
                reading_time=content_data['reading_time'],
                is_featured=content_data['is_featured'],
                is_published=True,
                publication_date=datetime.utcnow(),
                meta_description=content_data['excerpt'][:160],
                tags=json.dumps(['foi', 'théologie', 'questions'])
            )
            
            db.session.add(content)
            db.session.flush()  # Pour obtenir l'ID
            
            # Ajouter les références bibliques
            for ref_data in content_data.get('biblical_refs', []):
                biblical_ref = BiblicalReference(
                    book=ref_data['book'],
                    chapter=ref_data['chapter'],
                    verse_start=ref_data['verse_start'],
                    verse_end=ref_data.get('verse_end'),
                    text=ref_data['text'],
                    version='LSG',
                    thematic_content_id=content.id
                )
                db.session.add(biblical_ref)
            
            print(f"Contenu créé : {content_data['title']}")
        
        # Créer du contenu pour les autres formats
        teaser_content = ThematicContent(
            title='Et si croire et penser n\'étaient pas incompatibles ?',
            slug='teaser-croire-penser',
            content='<p>Découvrez notre vision dans cette vidéo de présentation de la plateforme Croire & Penser.</p>',
            excerpt='Vidéo de présentation de la plateforme',
            category_id=categories['dieu'].id,
            content_type='video',
            format_type='teaser',
            author_id=admin_user.id,
            reading_time=2,
            is_featured=True,
            is_published=True,
            publication_date=datetime.utcnow(),
            meta_description='Teaser vidéo de présentation',
            tags=json.dumps(['présentation', 'vidéo', 'teaser'])
        )
        
        if not ThematicContent.query.filter_by(slug='teaser-croire-penser').first():
            db.session.add(teaser_content)
            print("Teaser vidéo créé")
        
        db.session.commit()
        print("Contenu d'exemple créé avec succès !")

if __name__ == '__main__':
    create_sample_content()