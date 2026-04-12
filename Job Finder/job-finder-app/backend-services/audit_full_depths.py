path = r'd:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue'
with open(path, 'r', encoding='utf8') as f:
    content = f.read()

markers = [
    ('DASHBOARD_END', 'activeTab === \'applications\''),
    ('APPLICATIONS_END', 'activeTab === \'matches\''),
    ('MATCHES_END', 'activeTab === \'profile\''),
    ('PROFILE_END', '<!-- PLACEHOLDERS FOR OTHER TABS -->'),
    ('PLACEHOLDERS_END', '<!-- GLOBAL DISCOVERY OVERLAY -->')
]

for name, m in markers:
    parts = content.split(m)
    head = parts[0]
    opens = head.count('<div')
    closes = head.count('</div')
    diff = opens - closes
    print(f"{name}: Depth {diff}")
