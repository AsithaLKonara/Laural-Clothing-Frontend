import os
import re

directories = ['app', 'components']

color_map = {
    '#1C1917': 'primary',
    '#292524': 'primary-hover',
    '#C19A5B': 'accent',
    '#FAFAF9': 'background'
}

text_map = {
    '12px': 'xs',
    '13px': 'xs', # approximate
    '14px': 'sm',
    '15px': 'sm', # approximate
    '16px': 'base',
    '18px': 'lg',
    '20px': 'xl',
    '24px': '2xl',
    '28px': '3xl',
    '32px': '4xl',
    '40px': '5xl',
    '48px': '5xl', # approximate
    '56px': '6xl'
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    new_content = content

    # Replace colors
    for hex_val, token in color_map.items():
        # Case insensitive hex match
        pattern = r'(bg|text|border|ring)-\[\#?' + hex_val.lstrip('#') + r'\]'
        new_content = re.sub(pattern, r'\1-' + token, new_content, flags=re.IGNORECASE)

    # Replace text sizes
    for px_val, token in text_map.items():
        pattern = r'text-\[' + px_val + r'\]'
        new_content = re.sub(pattern, 'text-' + token, new_content)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                process_file(os.path.join(root, file))
