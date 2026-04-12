import re

path = r'd:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue'
with open(path, 'r', encoding='utf8') as f:
    content = f.read()

# 1. Fix the redundant closing div mess
content = content.replace('                       </div></div></div></div></div></div>', '''                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>''')

# 2. Fix the split v-else-if attribute
# We match specifically the split sequence
content = re.sub(r'<div v-else-if="\s+</div>\s+activeTab === \'applications\'"', '<div v-else-if="activeTab === \'applications\'"', content, flags=re.MULTILINE)

with open(path, 'w', encoding='utf8') as f:
    f.write(content)

print("Template logic fixed!")
