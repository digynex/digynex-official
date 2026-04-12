
import sys

filepath = r"d:\Amila\With Antigravity\DigyNex-Official\Job Finder\job-finder-app\src\App.vue"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Matches Container Padding
content = content.replace('activeTab === \'matches\'" class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">\n         <div class="mt-4 flex-1 overflow-y-auto px-4 pb-24 custom-scrollbar">', 
                          'activeTab === \'matches\'" class="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">\n         <div class="mt-4 flex-1 overflow-y-auto px-4 pb-[102px] custom-scrollbar">')

# 2. Update card padding in Matches view (Discovery Hub cards usually have p-5 or p-6)
# Match anything like <div class="... p-5 ..." inside the matches section
# We'll target the Matches area specifically
matches_start = content.find('activeTab === \'matches\'')
matches_end = content.find('activeTab === \'profile\'')
matches_area = content[matches_start:matches_end]

# Usually Discovery Hub Card has bg-gradient-to-br from-[#0A2647] ... p-5
matches_area = matches_area.replace(' p-5 ', ' px-5 pt-2 pb-2.5 ')
matches_area = matches_area.replace(' p-6 ', ' px-5 pt-2 pb-2.5 ')

# Combine back
content = content[:matches_start] + matches_area + content[matches_end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matches Hub compactness sync complete.")
