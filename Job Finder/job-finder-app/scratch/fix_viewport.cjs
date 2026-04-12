const fs = require('fs');
const path = 'd:/Amila/With Antigravity/DigyNex-Official/Job Finder/job-finder-app/src/App.vue';
let content = fs.readFileSync(path, 'utf8');

const targetRegex = /<!-- DYNAMIC VIEWPORT \(NATIVE COMPONENT RENDERER\) -->\s*<div[^>]*id="live-viewport"[^>]*>[\s\S]*?<!-- Glass Overlay for Texture \(Non-blocking\) -->\s*<div[^>]*><\/div>\s*<\/div>/;

const replacement = `<!-- DYNAMIC VIEWPORT (NATIVE COMPONENT RENDERER) -->
                    <div class="w-full h-[400px] bg-white rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative group-hover/viewport:border-[#C1A172]/30 transition-all"
                         id="live-viewport" :style="{ '--cv-primary': userProfile.primaryColor }">
                       
                       <div class="absolute left-1/2"
                            style="width: 800px; height: 1100px; transform: translateX(-50%) scale(0.42); transform-origin: top center; top: 15px;">
                          <component :is="activeTemplateComponent" 
                                     :userData="masterProfile" 
                                     :primaryColor="userProfile.primaryColor" />
                       </div>
                       
                       <!-- Glass Overlay for Texture (Non-blocking) -->
                       <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A2647]/5 to-transparent opacity-40 z-20"></div>
                    </div>`;

if (targetRegex.test(content)) {
    content = content.replace(targetRegex, replacement);
    fs.writeFileSync(path, content);
    console.log('SUCCESS: Viewport Realignment Applied');
} else {
    console.log('ERROR: Target viewport block not found');
}
