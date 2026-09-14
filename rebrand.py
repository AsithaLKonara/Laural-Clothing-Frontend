import os
import re

directories = ['app', 'components', 'lib', 'services']
# 'Laural Clothing' -> 'SERAMAADUWEN.LK'
# 'Laural' -> 'Seramaaduwen'
# 'logo.webp' -> 'logo.png'
# 'icon.svg' -> 'icon.png'

for d in directories:
    for root, dirs, files in os.walk(d):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                new_content = content.replace('Laural Clothing', 'SERAMAADUWEN.LK')
                new_content = new_content.replace('Laural POS', 'SERAMAADUWEN.LK POS')
                new_content = new_content.replace('Laural', 'Seramaaduwen')
                new_content = new_content.replace('laural', 'seramaaduwen')
                new_content = new_content.replace('logo.webp', 'logo.png')
                new_content = new_content.replace('logo-white.png', 'logo-white.png') # just in case
                new_content = new_content.replace('icon.svg', 'icon.png')
                new_content = new_content.replace('Developed by ScriptLK Digital', '')
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Updated {path}")
