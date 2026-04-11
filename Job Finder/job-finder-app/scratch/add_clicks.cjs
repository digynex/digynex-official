const fs = require('fs');
const path = 'D:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue';
let content = fs.readFileSync(path, 'utf8');

// Add @click to filteredJobs loop
content = content.replace('v-for="(app, i) in filteredJobs" :key="i" class="', 'v-for="(app, i) in filteredJobs" :key="i" @click="openJobDetail(app)" class="cursor-pointer ');

// Add @click to filteredMatches loop
content = content.replace('v-for="(match, i) in filteredMatches" :key="i"', 'v-for="(match, i) in filteredMatches" :key="i" @click="openJobDetail(match)"');
content = content.replace('shadow-[0_45px_100px_-30px_rgba(0,0,0,0.3)]', 'cursor-pointer shadow-[0_45px_100px_-30px_rgba(0,0,0,0.3)]');

fs.writeFileSync(path, content);
console.log("Job Detail Click Interactivity Added.");
