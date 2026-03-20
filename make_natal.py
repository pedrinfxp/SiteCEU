import os

# Create HTML
with open('fotos-festa-kardec.html', 'r', encoding='utf-8') as f:
    content = f.read()

prefix = content[:content.find('<div class="lectures-grid">') + len('<div class="lectures-grid">')]
suffix = content[content.find('</div>\n\n                <div class="final-cta text-center animate-fade-in"'):]

prefix = prefix.replace('Fotos Festa de Kardec', 'Fotos Distribuição de Natal')
prefix = prefix.replace('<h1>Fotos da Festa de Kardec</h1>', '<h1>Fotos da Distribuição de Natal</h1>')
prefix = prefix.replace('EVENTOS MARCANTES', 'AMOR EM AÇÃO')
prefix = prefix.replace('A <strong>Festa de Kardec</strong> é um momento de união, alegria e celebração no <strong>Centro Espírita União</strong>.', 'A <strong>Distribuição de Natal</strong> é um momento de união, alegria e solidariedade no <strong>Centro Espírita União</strong>.')

# Generate filters
filters = '<div class="filter-container animate-fade-in" style="margin-bottom: 60px;">\n'
years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2017, 2016, 2015, 2014, 2013]
for idx, y in enumerate(years):
    active = ' active' if idx == 0 else ''
    filters += f'                    <button class="filter-btn{active}" data-year="{y}">{y}</button>\n'
filters += '                </div>'

import re
prefix = re.sub(r'<div class="filter-container.*?</button>\s*</div>', filters, prefix, flags=re.DOTALL)

images_html = ""
files_2014 = os.listdir('assets/DistribuiçãoNatal2014')
for f in files_2014:
    if f.endswith('.png') or f.endswith('.jpg'):
        images_html += f'''
                    <div class="lecture-card revealed" data-year="2014" style="display: none;">
                        <a href="assets/DistribuiçãoNatal2014/{f}" data-lightbox="natal-2014" data-title="Distribuição de Natal 2014">
                            <div class="lecture-img"><img src="assets/DistribuiçãoNatal2014/{f}" style="object-fit: cover; width: 100%; height: 100%;" alt="Distribuição de Natal 2014"></div>
                        </a>
                    </div>'''

files_2013 = os.listdir('assets/DistribuiçãoNatal2013')
for f in files_2013:
    if f.endswith('.png') or f.endswith('.jpg'):
        images_html += f'''
                    <div class="lecture-card revealed" data-year="2013" style="display: none;">
                        <a href="assets/DistribuiçãoNatal2013/{f}" data-lightbox="natal-2013" data-title="Distribuição de Natal 2013">
                            <div class="lecture-img"><img src="assets/DistribuiçãoNatal2013/{f}" style="object-fit: cover; width: 100%; height: 100%;" alt="Distribuição de Natal 2013"></div>
                        </a>
                    </div>'''

with open('fotos-distribuicao-natal.html', 'w', encoding='utf-8') as f:
    f.write(prefix + images_html + suffix)

# Replace navigation links in all html files
html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        file_content = file.read()
    
    # We replace <a href="#">Distribuição de Natal</a>
    new_content = file_content.replace('<li><a href="#">Distribuição de Natal</a></li>', '<li><a href="fotos-distribuicao-natal.html">Distribuição de Natal</a></li>')
    if new_content != file_content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
