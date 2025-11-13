import json
import os
from datetime import datetime

class PageEditor:
    def __init__(self):
        self.changes_file = 'page_changes.json'
        self.load_changes()
    
    def load_changes(self):
        if os.path.exists(self.changes_file):
            with open(self.changes_file, 'r', encoding='utf-8') as f:
                self.changes = json.load(f)
        else:
            self.changes = {}
    
    def save_change(self, page, selector, content_type, value):
        if page not in self.changes:
            self.changes[page] = {}
        
        self.changes[page][selector] = {
            'type': content_type,
            'value': value,
            'timestamp': datetime.now().isoformat()
        }
        
        with open(self.changes_file, 'w', encoding='utf-8') as f:
            json.dump(self.changes, f, ensure_ascii=False, indent=2)
    
    def get_changes(self, page):
        return self.changes.get(page, {})
    
    def apply_changes_to_template(self, template_content, page):
        changes = self.get_changes(page)
        modified_content = template_content
        
        for selector, change in changes.items():
            if change['type'] == 'text':
                # Simple text replacement for demo
                modified_content = modified_content.replace(
                    f'id="{selector}"', 
                    f'id="{selector}" data-modified="true"'
                )
        
        return modified_content

editor = PageEditor()