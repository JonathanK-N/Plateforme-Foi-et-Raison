-- Script d'initialisation de la base de données Croire & Penser

-- Extension pour UUID (optionnel)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    profile_picture VARCHAR(500),
    bio TEXT,
    phone VARCHAR(20),
    date_of_birth DATE,
    preferences JSONB DEFAULT '{}'
);

-- Table des contenus
CREATE TABLE IF NOT EXISTS contents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('video', 'podcast', 'article', 'image')),
    file_path VARCHAR(500),
    thumbnail VARCHAR(500),
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    publish_date TIMESTAMP,
    duration INTEGER, -- en secondes pour vidéos/podcasts
    file_size BIGINT, -- taille du fichier en bytes
    tags TEXT[], -- array de tags
    metadata JSONB DEFAULT '{}' -- métadonnées additionnelles
);

-- Table des questions
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    category VARCHAR(50),
    priority INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0
);

-- Table des réponses
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_accepted BOOLEAN DEFAULT FALSE,
    votes INTEGER DEFAULT 0
);

-- Table des commentaires
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    content_id INTEGER REFERENCES contents(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE, -- pour les réponses aux commentaires
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE,
    likes INTEGER DEFAULT 0
);

-- Table des sondages
CREATE TABLE IF NOT EXISTS polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    allow_multiple BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT FALSE
);

-- Table des options de sondage
CREATE TABLE IF NOT EXISTS poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_text VARCHAR(200) NOT NULL,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des votes de sondage
CREATE TABLE IF NOT EXISTS poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id, option_id)
);

-- Table des likes/réactions
CREATE TABLE IF NOT EXISTS reactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('content', 'comment', 'question', 'answer')),
    target_id INTEGER NOT NULL,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'dislike', 'angry', 'sad')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSONB DEFAULT '{}'
);

-- Table des sessions utilisateur
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table des logs d'activité
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB DEFAULT '{}'
);

-- Table des publications sur réseaux sociaux
CREATE TABLE IF NOT EXISTS social_posts (
    id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES contents(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    post_id VARCHAR(200),
    post_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending',
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_contents_published ON contents(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contents_author ON contents(author_id);
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(content_type);
CREATE INDEX IF NOT EXISTS idx_questions_approved ON questions(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_reactions_target ON reactions(target_type, target_id);

-- Triggers pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion des données de test
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@foietraison.ca', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlG.', 'admin'),
('moderateur', 'mod@foietraison.ca', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlG.', 'moderator')
ON CONFLICT (username) DO NOTHING;

-- Insertion de contenus d'exemple
INSERT INTO contents (title, description, content_type, author_id, is_published) VALUES
('Bienvenue sur Croire & Penser', 'Découvrez Croire & Penser, plateforme communautaire pour une foi qui réfléchit à la lumière de la Parole.', 'article', 1, true),
('Première méditation guidée', 'Une méditation de 10 minutes pour commencer votre journée dans la paix.', 'podcast', 1, true),
('Les fondements de la foi', 'Une série vidéo explorant les bases de la spiritualité moderne.', 'video', 1, true)
ON CONFLICT DO NOTHING;

-- Insertion de questions d'exemple
INSERT INTO questions (title, content, author_id, is_approved) VALUES
('Comment concilier foi et science ?', 'Je me demande comment il est possible de maintenir une foi religieuse tout en acceptant les découvertes scientifiques modernes.', 1, true),
('Quelle est l''importance de la prière ?', 'Pouvez-vous expliquer le rôle de la prière dans la vie spirituelle quotidienne ?', 1, true)
ON CONFLICT DO NOTHING;

-- Insertion de réponses d'exemple
INSERT INTO answers (content, question_id, author_id) VALUES
('La foi et la science peuvent coexister harmonieusement. Beaucoup de grands scientifiques étaient des personnes de foi...', 1, 1),
('La prière est un moyen de communication avec le divin et de réflexion personnelle...', 2, 1)
ON CONFLICT DO NOTHING;

-- Vue pour les statistiques
CREATE OR REPLACE VIEW content_stats AS
SELECT 
    c.id,
    c.title,
    c.content_type,
    c.views,
    COUNT(DISTINCT cm.id) as comment_count,
    COUNT(DISTINCT r.id) as reaction_count,
    c.created_at
FROM contents c
LEFT JOIN comments cm ON c.id = cm.content_id
LEFT JOIN reactions r ON c.id = r.target_id AND r.target_type = 'content'
WHERE c.is_published = true
GROUP BY c.id, c.title, c.content_type, c.views, c.created_at;

-- Vue pour les questions populaires
CREATE OR REPLACE VIEW popular_questions AS
SELECT 
    q.id,
    q.title,
    q.views,
    COUNT(DISTINCT a.id) as answer_count,
    q.created_at
FROM questions q
LEFT JOIN answers a ON q.id = a.question_id
WHERE q.is_approved = true
GROUP BY q.id, q.title, q.views, q.created_at
ORDER BY q.views DESC, answer_count DESC;

-- Fonction pour nettoyer les anciennes sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer les statistiques d'engagement
CREATE OR REPLACE FUNCTION get_engagement_stats(content_id_param INTEGER)
RETURNS TABLE(
    total_views BIGINT,
    total_comments BIGINT,
    total_reactions BIGINT,
    engagement_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(c.views::BIGINT, 0) as total_views,
        COUNT(DISTINCT cm.id) as total_comments,
        COUNT(DISTINCT r.id) as total_reactions,
        CASE 
            WHEN c.views > 0 THEN 
                ROUND((COUNT(DISTINCT cm.id) + COUNT(DISTINCT r.id))::NUMERIC / c.views * 100, 2)
            ELSE 0
        END as engagement_rate
    FROM contents c
    LEFT JOIN comments cm ON c.id = cm.content_id
    LEFT JOIN reactions r ON c.id = r.target_id AND r.target_type = 'content'
    WHERE c.id = content_id_param
    GROUP BY c.id, c.views;
END;
$$ LANGUAGE plpgsql;