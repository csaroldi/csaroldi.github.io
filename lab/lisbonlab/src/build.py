# Monta ../index.html a partir dos arquivos desta pasta. Rodar com: python3 build.py
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
html=open('head.html').read()+open('base.css').read()+open('extra.css').read()+'</style>\n</head>\n'+open('body.html').read()+'\n<script>\n'+open('data.js').read()+'\n'+open('app.js').read()+'\n'+open('print.js').read()+'\n</script>\n</body>\n</html>\n'
assert '—' not in html and '–' not in html, 'travessão'
open('../index.html','w').write(html); print('index.html', len(html))
