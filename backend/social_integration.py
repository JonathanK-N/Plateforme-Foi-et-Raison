import requests
import os
from datetime import datetime
from flask import current_app

class SocialMediaIntegration:
    """Intégration avec les réseaux sociaux pour republication automatique"""
    
    def __init__(self):
        self.youtube_api_key = os.getenv('YOUTUBE_API_KEY')
        self.instagram_token = os.getenv('INSTAGRAM_ACCESS_TOKEN')
        self.facebook_token = os.getenv('FACEBOOK_ACCESS_TOKEN')
    
    def publish_to_youtube(self, video_path, title, description, tags=None):
        """Publier une vidéo sur YouTube"""
        try:
            # Configuration de l'API YouTube
            # En production, utiliser google-api-python-client
            
            # Simulation pour l'exemple
            print(f"Publication YouTube: {title}")
            return {
                'success': True,
                'video_id': 'simulated_video_id',
                'url': f'https://youtube.com/watch?v=simulated_video_id'
            }
            
        except Exception as e:
            current_app.logger.error(f"Erreur publication YouTube: {e}")
            return {'success': False, 'error': str(e)}
    
    def publish_to_instagram(self, image_path, caption, is_video=False):
        """Publier sur Instagram"""
        try:
            if not self.instagram_token:
                return {'success': False, 'error': 'Token Instagram manquant'}
            
            # API Instagram Basic Display
            url = f"https://graph.instagram.com/me/media"
            
            data = {
                'image_url' if not is_video else 'video_url': image_path,
                'caption': caption,
                'access_token': self.instagram_token
            }
            
            response = requests.post(url, data=data)
            
            if response.status_code == 200:
                media_id = response.json().get('id')
                
                # Publier le média
                publish_url = f"https://graph.instagram.com/me/media_publish"
                publish_data = {
                    'creation_id': media_id,
                    'access_token': self.instagram_token
                }
                
                publish_response = requests.post(publish_url, data=publish_data)
                
                if publish_response.status_code == 200:
                    return {
                        'success': True,
                        'post_id': publish_response.json().get('id')
                    }
            
            return {'success': False, 'error': 'Erreur API Instagram'}
            
        except Exception as e:
            current_app.logger.error(f"Erreur publication Instagram: {e}")
            return {'success': False, 'error': str(e)}
    
    def publish_to_facebook(self, message, link=None, image_path=None):
        """Publier sur Facebook"""
        try:
            if not self.facebook_token:
                return {'success': False, 'error': 'Token Facebook manquant'}
            
            # API Facebook Graph
            url = f"https://graph.facebook.com/me/feed"
            
            data = {
                'message': message,
                'access_token': self.facebook_token
            }
            
            if link:
                data['link'] = link
            
            response = requests.post(url, data=data)
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'post_id': response.json().get('id')
                }
            
            return {'success': False, 'error': 'Erreur API Facebook'}
            
        except Exception as e:
            current_app.logger.error(f"Erreur publication Facebook: {e}")
            return {'success': False, 'error': str(e)}
    
    def auto_publish_content(self, content, platforms=['facebook']):
        """Publication automatique sur plusieurs plateformes"""
        results = {}
        
        for platform in platforms:
            try:
                if platform == 'youtube' and content.content_type == 'video':
                    result = self.publish_to_youtube(
                        content.file_path,
                        content.title,
                        content.description or ''
                    )
                    results['youtube'] = result
                
                elif platform == 'instagram':
                    # Instagram nécessite une image/vidéo
                    if content.thumbnail or content.file_path:
                        caption = f"{content.title}\n\n{content.description or ''}\n\n#FoiEtRaison #Spiritualité"
                        result = self.publish_to_instagram(
                            content.thumbnail or content.file_path,
                            caption,
                            content.content_type == 'video'
                        )
                        results['instagram'] = result
                
                elif platform == 'facebook':
                    message = f"{content.title}\n\n{content.description or ''}"
                    link = f"{os.getenv('SITE_URL', 'https://foietraison.ca')}/content/{content.id}"
                    
                    result = self.publish_to_facebook(message, link)
                    results['facebook'] = result
                
            except Exception as e:
                results[platform] = {'success': False, 'error': str(e)}
        
        return results

class ShareButtons:
    """Génération de liens de partage pour les réseaux sociaux"""
    
    @staticmethod
    def generate_share_links(content_id, title, description=""):
        """Générer les liens de partage pour un contenu"""
        base_url = os.getenv('SITE_URL', 'https://foietraison.ca')
        content_url = f"{base_url}/content/{content_id}"
        
        # Encoder les paramètres pour les URLs
        encoded_title = requests.utils.quote(title)
        encoded_description = requests.utils.quote(description)
        encoded_url = requests.utils.quote(content_url)
        
        share_links = {
            'facebook': f"https://www.facebook.com/sharer/sharer.php?u={encoded_url}",
            'twitter': f"https://twitter.com/intent/tweet?text={encoded_title}&url={encoded_url}",
            'whatsapp': f"https://wa.me/?text={encoded_title}%20{encoded_url}",
            'linkedin': f"https://www.linkedin.com/sharing/share-offsite/?url={encoded_url}",
            'telegram': f"https://t.me/share/url?url={encoded_url}&text={encoded_title}",
            'email': f"mailto:?subject={encoded_title}&body={encoded_description}%0A%0A{encoded_url}"
        }
        
        return share_links
    
    @staticmethod
    def generate_embed_code(content_id, width=560, height=315):
        """Générer le code d'intégration pour un contenu"""
        base_url = os.getenv('SITE_URL', 'https://foietraison.ca')
        embed_url = f"{base_url}/embed/{content_id}"
        
        embed_code = f'''<iframe 
            src="{embed_url}" 
            width="{width}" 
            height="{height}" 
            frameborder="0" 
            allowfullscreen>
        </iframe>'''
        
        return embed_code

class SocialAnalytics:
    """Analyse des performances sur les réseaux sociaux"""
    
    def __init__(self):
        self.facebook_token = os.getenv('FACEBOOK_ACCESS_TOKEN')
        self.youtube_api_key = os.getenv('YOUTUBE_API_KEY')
    
    def get_facebook_insights(self, post_id):
        """Récupérer les statistiques d'un post Facebook"""
        try:
            url = f"https://graph.facebook.com/{post_id}/insights"
            params = {
                'metric': 'post_impressions,post_engaged_users,post_clicks',
                'access_token': self.facebook_token
            }
            
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                return response.json()
            
            return None
            
        except Exception as e:
            current_app.logger.error(f"Erreur analytics Facebook: {e}")
            return None
    
    def get_youtube_analytics(self, video_id):
        """Récupérer les statistiques d'une vidéo YouTube"""
        try:
            url = f"https://www.googleapis.com/youtube/v3/videos"
            params = {
                'part': 'statistics',
                'id': video_id,
                'key': self.youtube_api_key
            }
            
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('items'):
                    return data['items'][0]['statistics']
            
            return None
            
        except Exception as e:
            current_app.logger.error(f"Erreur analytics YouTube: {e}")
            return None

# Fonctions utilitaires pour l'intégration
def schedule_social_post(content_id, platforms, publish_time=None):
    """Programmer une publication sur les réseaux sociaux"""
    # En production, utiliser Celery ou une autre solution de tâches asynchrones
    
    if publish_time is None:
        publish_time = datetime.now()
    
    # Simulation de programmation
    print(f"Publication programmée pour {publish_time} sur {platforms}")
    
    return {
        'scheduled': True,
        'publish_time': publish_time.isoformat(),
        'platforms': platforms
    }

def get_social_media_templates():
    """Récupérer les modèles de publication pour les réseaux sociaux"""
    templates = {
        'facebook': {
            'video': "🎥 Nouvelle vidéo: {title}\n\n{description}\n\n#FoiEtRaison #Spiritualité #Communauté",
            'podcast': "🎧 Nouveau podcast: {title}\n\n{description}\n\n#FoiEtRaison #Podcast #Spiritualité",
            'article': "📖 Nouvel article: {title}\n\n{description}\n\n#FoiEtRaison #Article #Réflexion"
        },
        'twitter': {
            'video': "🎥 {title}\n\n{description}\n\n#FoiEtRaison #Spiritualité",
            'podcast': "🎧 {title}\n\n{description}\n\n#FoiEtRaison #Podcast",
            'article': "📖 {title}\n\n{description}\n\n#FoiEtRaison #Article"
        },
        'instagram': {
            'video': "{title}\n\n{description}\n\n#FoiEtRaison #Spiritualité #Communauté #Foi #Raison",
            'podcast': "{title}\n\n{description}\n\n#FoiEtRaison #Podcast #Spiritualité #Foi",
            'article': "{title}\n\n{description}\n\n#FoiEtRaison #Article #Réflexion #Foi"
        }
    }
    
    return templates