const fs = require('fs');
const path = 'D:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue';
let content = fs.readFileSync(path, 'utf8');

// 1. Link search inputs to v-model="searchQuery"
content = content.replace(/:placeholder="t\('apps.searchPlaceholder'\)"/g, `v-model="searchQuery" :placeholder="t('apps.searchPlaceholder')"`);

// 2. Apps loop: Replace hardcoded with filteredJobs
const oldAppsLoop = `v-for="(app, i) in [
               {c: 'Google', r: 'Senior AI Engineer', l: 'Zurich, CH', s: 'interview', m: 98, icon: Zap, color: '#73BBA3'},
               {c: 'Spotify', r: 'Lead Developer', l: 'Stockholm, SE', s: 'review', m: 92, icon: Briefcase, color: '#1DB954'},
               {c: 'Tesla', r: 'Systems Architect', l: 'Oslo, NO', s: 'offer', m: 89, icon: LayoutDashboard, color: '#E81C23'},
               {c: 'Amazon', r: 'Senior AI Platform', l: 'Madrid, ES', s: 'applied', m: 84, icon: Star, color: '#FF9900'}
            ]"`;

// We'll use a more flexible replacement for the apps loop
const appsLoopRegex = /v-for="\(app, i\) in \[\s+\{c: 'Google'[\s\S]+?\}\s+\]"/;
content = content.replace(appsLoopRegex, `v-for="(app, i) in filteredJobs"`);

// 3. Matches loop: Replace hardcoded with filteredMatches
const matchesLoopRegex = /v-for="\(match, i\) in \[\s+\{ company: 'TechCorp'[\s\S]+?\}\s+\]"/;
content = content.replace(matchesLoopRegex, `v-for="(match, i) in filteredMatches"`);

fs.writeFileSync(path, content);
console.log("Global Search & Filtering Logic Applied Successfully.");
