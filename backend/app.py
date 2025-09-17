from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')
# Configuration base de données pour Railway
database_url = os.getenv('DATABASE_URL')
print(f"DATABASE_URL: {database_url}")  # Debug
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///foi_raison.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
print(f"Using database: {app.config['SQLALCHEMY_DATABASE_URI']}")  # Debug
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Modèles de base de données
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    sexe = db.Column(db.String(1), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    date_naissance = db.Column(db.Date, nullable=False)
    accepte_jesus = db.Column(db.String(3), nullable=False)
    baptise = db.Column(db.String(3), nullable=False)
    annee_bapteme = db.Column(db.Integer, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

class Content(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    content_type = db.Column(db.String(20), nullable=False)  # video, podcast, article
    file_path = db.Column(db.String(500))
    thumbnail = db.Column(db.String(500))
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    views = db.Column(db.Integer, default=0)
    is_published = db.Column(db.Boolean, default=False)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_approved = db.Column(db.Boolean, default=False)

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    content_id = db.Column(db.Integer, db.ForeignKey('content.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes d'authentification
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email déjà utilisé'}), 400
        
        # Convertir la date de naissance
        from datetime import datetime
        date_naissance = datetime.strptime(data['dateNaissance'], '%Y-%m-%d').date()
        
        user = User(
            nom=data['nom'],
            prenom=data['prenom'],
            sexe=data['sexe'],
            telephone=data['telephone'],
            email=data['email'],
            date_naissance=date_naissance,
            accepte_jesus=data['accepteJesus'],
            baptise=data['baptise'],
            annee_bapteme=int(data['anneeBapteme']) if data.get('anneeBapteme') else None,
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'Utilisateur créé avec succès'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erreur lors de l\'inscription: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['username']).first()  # Utiliser email comme username
    
    if user and check_password_hash(user.password_hash, data['password']) and user.is_active:
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=7)
        )
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': f"{user.prenom} {user.nom}",
                'role': user.role
            }
        })
    
    return jsonify({'message': 'Identifiants invalides'}), 401

# Routes de contenu
@app.route('/api/contents', methods=['GET'])
def get_contents():
    try:
        contents = Content.query.filter_by(is_published=True).order_by(Content.created_at.desc()).all()
        return jsonify([{
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'content_type': c.content_type,
            'thumbnail': c.thumbnail,
            'views': c.views,
            'created_at': c.created_at.isoformat()
        } for c in contents])
    except Exception as e:
        print(f"Error loading contents: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/contents/<int:content_id>', methods=['GET'])
def get_content(content_id):
    content = Content.query.get_or_404(content_id)
    content.views += 1
    db.session.commit()
    
    return jsonify({
        'id': content.id,
        'title': content.title,
        'description': content.description,
        'content_type': content.content_type,
        'file_path': content.file_path,
        'views': content.views
    })

@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'Aucun fichier'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'Aucun fichier sélectionné'}), 400
    
    filename = secure_filename(file.filename)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    return jsonify({'file_path': file_path})

# Routes Q&A
@app.route('/api/questions', methods=['GET'])
def get_questions():
    questions = Question.query.filter_by(is_approved=True).order_by(Question.created_at.desc()).all()
    return jsonify([{
        'id': q.id,
        'title': q.title,
        'content': q.content,
        'created_at': q.created_at.isoformat()
    } for q in questions])

@app.route('/api/questions', methods=['POST'])
@jwt_required()
def create_question():
    data = request.get_json()
    question = Question(
        title=data['title'],
        content=data['content'],
        author_id=get_jwt_identity()
    )
    
    db.session.add(question)
    db.session.commit()
    
    return jsonify({'message': 'Question soumise pour modération'}), 201

# Routes admin
@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'message': 'Accès refusé'}), 403
    
    stats = {
        'total_users': User.query.count(),
        'total_contents': Content.query.count(),
        'total_questions': Question.query.count(),
        'pending_questions': Question.query.filter_by(is_approved=False).count()
    }
    
    return jsonify(stats)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def create_admin_user():
    try:
        if not User.query.filter_by(email='admin@foietraison.ca').first():
            from datetime import date
            admin = User(
                nom='Admin',
                prenom='Système',
                sexe='M',
                telephone='0000000000',
                email='admin@foietraison.ca',
                date_naissance=date(1990, 1, 1),
                accepte_jesus='oui',
                baptise='oui',
                annee_bapteme=2000,
                password_hash=generate_password_hash('admin123'),
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            print("Utilisateur admin créé avec succès")
        else:
            print("Utilisateur admin déjà existant")
    except Exception as e:
        print(f"Erreur lors de la création de l'admin: {e}")
        db.session.rollback()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        create_admin_user()
    
    # Configuration pour Railway
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)