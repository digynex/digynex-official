import re

content = open(r'd:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue', encoding='utf8').read()
views = [
    ('DASHBOARD', 'activeTab === \'dashboard\'', 'activeTab === \'applications\''),
    ('APPLICATIONS', 'activeTab === \'applications\'', 'activeTab === \'matches\''),
    ('MATCHES', 'activeTab === \'matches\'', 'activeTab === \'profile\''),
    ('PROFILE', 'activeTab === \'profile\'', ' PLACEHOLDERS FOR OTHER TABS '),
    ('PLACEHOLDERS', ' PLACEHOLDERS FOR OTHER TABS ', 'GLOBAL DISCOVERY OVERLAY'),
    ('OVERLAY', 'GLOBAL DISCOVERY OVERLAY', 'GLOBAL BRANDING FOOTER')
]

for name, start, end in views:
    try:
        block = content.split(start)[1].split(end)[0]
        o = block.count('<div')
        c = block.count('</div')
        print(f"{name}: {o} opens, {c} closes. Mismatch: {o-c}")
    except:
        print(f"{name}: Split failed")
