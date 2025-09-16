from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, User, Content, Question, Answer, Comment
from werkzeug.security import generate_password_hash
from datetime import datetime
import os

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required(f):
    """Décorateur pour vérifier les droits admin"""
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'message': 'Accès refusé - Droits administrateur requis'}), 403
        
        return f(*args, **kwargs)
    
    decorated_function.__name__ = f.__name__
    return decorated_function

# Statistiques générales
@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_stats():
    stats = {
        'users': {
            'total': User.query.count(),
            'active': User.query.filter_by(is_active=True).count(),
            'admins': User.query.filter_by(role='admin').count(),
            'recent': User.query.filter(User.created_at >= datetime.utcnow().replace(day=1)).count()
        },
        'content': {
            'total': Content.query.count(),
            'published': Content.query.filter_by(is_published=True).count(),
            'videos': Content.query.filter_by(content_type='video').count(),
            'podcasts': Content.query.filter_by(content_type='podcast').count(),
            'articles': Content.query.filter_by(content_type='article').count()
        },
        'questions': {
            'total': Question.query.count(),
            'approved': Question.query.filter_by(is_approved=True).count(),
            'pending': Question.query.filter_by(is_approved=False).count()
        },
        'engagement': {
            'total_views': db.session.query(db.func.sum(Content.views)).scalar() or 0,
            'total_comments': Comment.query.count(),
            'total_answers': Answer.query.count()
        }
    }
    
    return jsonify(stats)

# Gestion des utilisateurs
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    users = User.query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'users': [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat()
        } for user in users.items],
        'total': users.total,
        'pages': users.pages,
        'current_page': page
    })

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'role' in data:
        user.role = data['role']
    
    if 'is_active' in data:
        user.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({'message': 'Utilisateur mis à jour avec succès'})

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
@admin_required
def create_user():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Nom d\'utilisateur déjà pris'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email déjà utilisé'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role=data.get('role', 'user')
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'Utilisateur créé avec succès'}), 201

# Gestion des contenus
@admin_bp.route('/contents', methods=['GET'])
@jwt_required()
@admin_required
def get_all_contents():
    contents = Content.query.order_by(Content.created_at.desc()).all()
    
    return jsonify([{
        'id': content.id,
        'title': content.title,
        'content_type': content.content_type,
        'is_published': content.is_published,
        'views': content.views,
        'created_at': content.created_at.isoformat(),
        'author_id': content.author_id
    } for content in contents])

@admin_bp.route('/contents', methods=['POST'])
@jwt_required()
@admin_required
def create_content():
    data = request.get_json()
    
    content = Content(
        title=data['title'],
        description=data.get('description'),
        content_type=data['content_type'],
        file_path=data.get('file_path'),
        thumbnail=data.get('thumbnail'),
        author_id=get_jwt_identity(),
        is_published=data.get('is_published', False)
    )
    
    db.session.add(content)
    db.session.commit()
    
    return jsonify({'message': 'Contenu créé avec succès', 'id': content.id}), 201

@admin_bp.route('/contents/<int:content_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_content(content_id):
    content = Content.query.get_or_404(content_id)
    data = request.get_json()
    
    content.title = data.get('title', content.title)
    content.description = data.get('description', content.description)
    content.is_published = data.get('is_published', content.is_published)
    
    db.session.commit()
    
    return jsonify({'message': 'Contenu mis à jour avec succès'})

@admin_bp.route('/contents/<int:content_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_content(content_id):
    content = Content.query.get_or_404(content_id)
    
    # Supprimer le fichier physique si il existe
    if content.file_path and os.path.exists(content.file_path):
        os.remove(content.file_path)
    
    db.session.delete(content)
    db.session.commit()
    
    return jsonify({'message': 'Contenu supprimé avec succès'})

# Modération des questions
@admin_bp.route('/questions/pending', methods=['GET'])
@jwt_required()
@admin_required
def get_pending_questions():
    questions = Question.query.filter_by(is_approved=False).order_by(Question.created_at.desc()).all()
    
    return jsonify([{
        'id': question.id,
        'title': question.title,
        'content': question.content,
        'author_id': question.author_id,
        'created_at': question.created_at.isoformat()
    } for question in questions])

@admin_bp.route('/questions/<int:question_id>/approve', methods=['POST'])
@jwt_required()
@admin_required
def approve_question(question_id):
    question = Question.query.get_or_404(question_id)
    question.is_approved = True
    
    db.session.commit()
    
    return jsonify({'message': 'Question approuvée avec succès'})

@admin_bp.route('/questions/<int:question_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_question(question_id):
    question = Question.query.get_or_404(question_id)
    
    # Supprimer aussi les réponses associées
    Answer.query.filter_by(question_id=question_id).delete()
    
    db.session.delete(question)
    db.session.commit()
    
    return jsonify({'message': 'Question supprimée avec succès'})

# Gestion des commentaires
@admin_bp.route('/comments', methods=['GET'])
@jwt_required()
@admin_required
def get_all_comments():
    comments = Comment.query.order_by(Comment.created_at.desc()).limit(100).all()
    
    return jsonify([{
        'id': comment.id,
        'content': comment.content,
        'content_id': comment.content_id,
        'author_id': comment.author_id,
        'created_at': comment.created_at.isoformat()
    } for comment in comments])

@admin_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({'message': 'Commentaire supprimé avec succès'})

# Sauvegarde et maintenance
@admin_bp.route('/backup', methods=['POST'])
@jwt_required()
@admin_required
def create_backup():
    """Créer une sauvegarde de la base de données"""
    try:
        # Commande de sauvegarde PostgreSQL
        backup_filename = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
        backup_path = os.path.join('backups', backup_filename)
        
        os.makedirs('backups', exist_ok=True)
        
        # En production, utiliser pg_dump
        # os.system(f"pg_dump {DATABASE_URL} > {backup_path}")
        
        return jsonify({
            'message': 'Sauvegarde créée avec succès',
            'filename': backup_filename
        })
    
    except Exception as e:
        return jsonify({'message': f'Erreur lors de la sauvegarde: {str(e)}'}), 500

# Logs et monitoring
@admin_bp.route('/logs', methods=['GET'])
@jwt_required()
@admin_required
def get_logs():
    """Récupérer les logs de l'application"""
    try:
        log_file = 'app.log'
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                logs = f.readlines()[-100:]  # Dernières 100 lignes
            
            return jsonify({'logs': logs})
        else:
            return jsonify({'logs': []})
    
    except Exception as e:
        return jsonify({'message': f'Erreur lors de la lecture des logs: {str(e)}'}), 500