/* 
 * TEMPLATE SERVICE (Modular V1.0 - Commercial SaaS Architecture)
 * Orchestrates CV Template selection, DB persistence, and High-Fidelity specimen rendering.
 * Strictly follows ORFL Separation of Concerns.
 */
import { supabase } from '../lib/supabase'
import { profileService } from './profileService'

export const templateService = {
  /**
   * Fetches the complete list of available CV templates from the database.
   */
  async getTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching templates:', error.message);
      return [];
    }
    return data;
  },

  /**
   * Persists the user's selected template choice to their global profile.
   */
  async setSelectedTemplate(user, templateId) {
    if (!user) return { error: 'No authenticated user available for sync' };
    
    return await supabase.from('profiles')
      .update({ selected_template: templateId })
      .eq('id', user.id);
  },

  /**
   * High-Fidelity Specimen Engine: Fetches and paints HTML specimens with custom branding.
   * This provides the "Visual Confidence" needed for conversion.
   */
  async getSpecimenHtml(templateId, colors, profile, labels) {
    const cvLabels = labels || {
      experience: 'Professional Experience',
      expertise: 'Technical Expertise',
      skills: 'Technical Skills',
      projects: 'Key Projects',
      languages: 'Languages',
      education: 'Education',
      declaration: 'I hereby declare that the info provided is true and correct.'
    };

    const templateMap = {
      1: 'specimen-classic-elite.html',
      2: 'specimen-sidebar-modern.html',
      3: 'specimen-executive-one.html',
      4: 'specimen-minimalist-pure.html',
      5: 'specimen-titan-professional.html',
      6: 'specimen-nano-streamline.html',
      7: 'specimen-nexus-technical.html',
      8: 'specimen-creative-authority.html'
    };

      const fileName = templateMap[templateId] || 'specimen-classic-elite.html';
      
      // 0. High-Fidelity Density Scoring Engine (V12.9)
      const calculateDensity = (p) => {
        let charCount = (p.bio?.length || 0);
        (p.experiences || []).forEach(e => charCount += (e.role?.length || 0) + (e.company?.length || 0) + (e.achievements?.length || 0));
        (p.education || []).forEach(e => charCount += (e.title?.length || 0) + (e.institution?.length || 0));
        const totalItems = (p.experiences?.length || 0) + (p.education?.length || 0);
        
        if (totalItems === 0 || charCount < 1000) return 'sparse';
        if (totalItems > 6 || charCount > 4500) return 'dense';
        return 'optimal';
      };

      const density = calculateDensity(profile);

      try {
      const response = await fetch(`/templates/${fileName}`);
      if (!response.ok) throw new Error(`Template load error: ${response.status}`);
      let html = await response.text();

      // Neural Aesthetic Injection (Viewport & Branding Calibration)
      const styleInjection = `
        <style>
          :root {
            --cv-primary: ${colors.primary || '#0A2647'} !important;
            --cv-secondary: ${colors.secondary || '#C1A172'} !important;
          }
          body, html { 
            margin: 0 !important; 
            padding: 0 !important; 
            overflow: hidden !important;
            width: 100%;
            height: 100%;
            -webkit-print-color-adjust: exact;
          }
          .page {
              box-shadow: none !important;
              margin: 0 auto !important;
              width: 210mm !important;
              height: 297mm !important;
          }
        </style>
      `;

      /* High-Fidelity Aesthetic Calibration (V12.9 Density Layer) */
      const getDensityStyles = (mode) => {
        if (mode === 'sparse') return `
          :root { --cv-gap: 30px; --cv-line-height: 1.8; --cv-font-scale: 1.05; }
          .experience-item { margin-bottom: 35px !important; }
          .education-item { margin-bottom: 25px !important; }
        `;
        if (mode === 'dense') return `
          :root { --cv-gap: 12px; --cv-line-height: 1.35; --cv-font-scale: 0.94; }
          body { font-size: 94% !important; }
          .experience-item { margin-bottom: 18px !important; }
          .section-title { margin-top: 20px !important; margin-bottom: 15px !important; }
        `;
        return `:root { --cv-gap: 24px; --cv-line-height: 1.6; --cv-font-scale: 1; }`;
      };

      const dynamicStyles = `
        <style>
          ${getDensityStyles(density)}
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        </style>
      `;
      
      html = html.replace('</head>', `${styleInjection}${dynamicStyles}</head>`);
      
      // --- NEURAL SECTION BUILDERS (V12.9.1 - SMART FALLBACK) ---
      const buildExp = (exps, mode) => {
        // Smart Sanitization: Filter out truly empty initial objects from App.vue
        let list = (exps || []).filter(e => e.role || e.company || e.achievements);
        let isTruncated = false;
        
        // Aesthetic Fallback logic: If no real data, show elite specimens
        if (list.length === 0) {
          list = [
            { role: 'Chief Operational Strategist', company: 'Nexus Global Infrastructure', start: '2022', end: 'Present', achievements: 'Engineering high-fidelity neural operational strategies resulting in a 45% efficiency yield across global business units.\nOrchestrating complex specimen-driven growth metrics and converting elite performance vectors into measurable commercial success.' },
            { role: 'Senior Infrastructure Lead', company: 'Titan Engineering Systems', start: '2019', end: '2022', achievements: 'Managed a cross-functional squad of 50+ elite engineers to deliver world-class cloud-native infrastructure solutions.\nOptimized legacy frameworks for hyper-scale readiness and ensured 99.99% operational continuity during global migrations.' },
            { role: 'Project Management Specimen', company: 'Creative Solutions Hub', start: '2016', end: '2019', achievements: 'Derived data-driven roadmap insights for Fortune 500 stakeholders using agile neural frameworks.\nAccelerated deployment velocity by 30% through surgical process optimization.' }
          ];
        } else if (mode === 'dense' && list.length > 5) {
          list = list.slice(0, 5);
          isTruncated = true;
        }

        let html = list.map(exp => `
          <div class="experience-item" style="margin-bottom: var(--cv-gap); break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <h3 style="font-size: calc(13.5px * var(--cv-font-scale)); font-weight: 800; color: var(--cv-primary); text-transform: uppercase; margin: 0;">${exp.role}</h3>
              <span style="font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${exp.start || ''} — ${exp.end || 'Present'}</span>
            </div>
            <p style="font-size: 11px; font-weight: 700; color: var(--cv-secondary); margin: 2px 0 8px 0; font-style: italic;">${exp.company}</p>
            <div style="font-size: 10.5px; line-height: var(--cv-line-height); color: #475569; text-align: justify; white-space: pre-line;">${exp.achievements}</div>
          </div>
        `).join('');

        if (isTruncated) {
          html += `<div style="font-size: 9px; color: #94a3b8; font-style: italic; text-align: center; padding: 10px; border-top: 1px dashed #e2e8f0; margin-top: 10px;">+ Additional professional history highlights restricted for optimal layout density</div>`;
        }
        return html;
      };

      const buildEdu = (edus) => {
        let list = (edus || []).filter(e => e.title || e.institution);
        if (list.length === 0) {
          list = [
            { title: 'MBA | Strategic Management & Leadership', institution: 'Elite Business School Specimen', year: '2020' },
            { title: 'BSc Computer Science & Engineering', institution: 'Global Technical Institute', year: '2016' }
          ];
        }
        return list.map(edu => `
          <div class="education-item" style="margin-bottom: 20px; break-inside: avoid;">
            <div style="font-size: 11.5px; font-weight: 800; color: var(--cv-primary); line-height: 1.2;">${edu.title}</div>
            <div style="font-size: 9.5px; color: #475569; font-weight: 600; margin: 2px 0;">${edu.institution}</div>
            <div style="font-size: 9px; color: #94a3b8; font-weight: 800;">${edu.year || ''}</div>
          </div>
        `).join('');
      };

      const buildProjects = (projects) => {
        let list = (projects || []).filter(p => p.name);
        if (list.length === 0) {
          list = [
            { name: 'Neural CV Engine V12.0 Deployment', link: 'github.com/digynex/neural-cv' },
            { name: 'Enterprise SaaS Scaling Orchestration', link: 'specimen.hub/scaling' }
          ];
        }
        return list.map(proj => `
          <div class="project-item" style="margin-bottom: 12px; break-inside: avoid;">
            <div style="font-size: 11px; font-weight: 800; color: var(--cv-primary);">${proj.name}</div>
            ${proj.link ? `<div style="font-size: 9px; color: var(--cv-secondary); font-family: monospace;">${proj.link}</div>` : ''}
          </div>
        `).join('');
      };

      const buildLanguages = (langs) => {
        let list = (langs || []).filter(l => l && l.trim());
        if (list.length === 0) list = ['English (Professional)', 'German (Conversational)', 'Spanish (Basic)'];
        return `
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${list.map(lang => `<span style="font-size: 10px; font-weight: 700; color: #475569;">▪ ${lang}</span>`).join('')}
          </div>
        `;
      };

      const buildSkills = (skills, primary) => {
        let all = [];
        if (skills) {
          all = [...(skills.hard || []), ...(skills.soft || []), ...(skills.tools || [])].filter(s => s && s.trim());
        }
        
        if (all.length === 0) {
          all = ['Strategic Leadership', 'Neural Systems', 'Process Optimization', 'Global Operations', 'Enterprise Scaling', 'Agile Orchestration'];
        }

        return all.map(skill => `
          <span style="display: inline-block; background: ${primary}10; border: 1px solid ${primary}25; color: ${primary}; font-size: 9.5px; font-weight: 700; padding: 3px 10px; border-radius: 6px; margin-right: 6px; margin-bottom: 6px; text-transform: uppercase;">${skill}</span>
        `).join('');
      };

      // --- IDENTITY ENGINE INJECTION (V12.5 - FULL DATA) ---
      if (profile) {
          // 1. Basic Identity
          const basic = profile.basic || {};
          const fullName = basic.fullName || 'Professional Identity';
          const headline = basic.headline || 'Strategic Consultant';
          const email = basic.email || 'identity@digynex.ai';
          const phone = basic.phone || '';
          const location = basic.location || '';

          html = html.replace(/\[FULL_NAME\]/g, fullName).replace(/AMILA PERERA/g, fullName).replace(/TITAN PROFESSIONAL/g, fullName).replace(/NANO STREAMLINE/g, fullName).replace(/NEXUS TECHNICAL/g, fullName).replace(/CREATIVE AUTHORITY/g, fullName);
          html = html.replace(/\[HEADLINE\]/g, headline).replace(/Project Manager \| Telecommunication Strategist/g, headline).replace(/Creative Authority/g, headline).replace(/Senior Project Manager \| Telco Strategist/g, headline).replace(/Senior Infrastructure Lead/g, headline).replace(/Cloud-Native Engineering Specimen/g, headline).replace(/Brand Strategy Specimen/g, headline);
          html = html.replace(/\[EMAIL\]/g, email).replace(/amilawijayantha858@gmail.com/g, email).replace(/amila\.p@workmail\.com/g, email).replace(/creative@digynex\.com/g, email).replace(/nano@digynex\.com/g, email).replace(/nexus@digynex\.com/g, email).replace(/titan@digynex\.com/g, email);
          html = html.replace(/\[PHONE\]/g, phone).replace(/\+46769703311/g, phone).replace(/\+46 700 000 003/g, phone).replace(/\+46 700 000 002/g, phone).replace(/\+46 700 000 001/g, phone).replace(/\+46 700 000 000/g, phone);
          html = html.replace(/\[LOCATION\]/g, location).replace(/Stockholm, SE/g, location).replace(/Stockholm, Sweden/g, location);

          // 1b. Social Links
          const linkedin = (profile.socialLinks || []).find(l => l.platform === 'LinkedIn')?.url || '';
          const portfolio = (profile.socialLinks || []).find(l => l.platform === 'Portfolio')?.url || '';
          html = html.replace(/\[LINKEDIN\]/g, linkedin).replace(/linkedin\.com\/in\/amila-perera/g, linkedin);
          html = html.replace(/\[PORTFOLIO\]/g, portfolio);

          // 2. Complex Section Injections
          html = html.replace(/{{BIO}}/g, profile.bio || 'Seasoned professional with a proven track record of delivering high-impact strategic initiatives. Specialized in neural system orchestration and complex specimen-driven architecture.');
          html = html.replace(/{{EXPERIENCE_LIST}}/g, buildExp(profile.experiences, density));
          html = html.replace(/{{EDUCATION_LIST}}/g, buildEdu(profile.education));
          html = html.replace(/{{SKILLS_GRID}}/g, buildSkills(profile.skills, colors.primary));
          html = html.replace(/{{PROJECTS_LIST}}/g, buildProjects(profile.projects));
          html = html.replace(/{{LANGUAGES_LIST}}/g, buildLanguages(profile.languages));
      }

      // 3. Neural Keyword Injection (Surgical Stealth Divider Sync)
      if (profile && profile.secretKeywords) {
          const keywords = Array.isArray(profile.secretKeywords) ? profile.secretKeywords.join(' ') : profile.secretKeywords;
          html = html.replace(/PROJECT MANAGER TELECOM 5G PMP SWEDEN ARTHA TESHAN DIALOG PMO AI CLOUD PYTHON JAVA SCRUM AGILE NFV SDN/g, keywords);
          html = html.replace(/BRAND-STRATEGY VISUAL-IDENTITY NEURAL-UX CREATIVE-OPS/g, keywords);
      }

      // 4. Multilingual Label Injection (V13.1)
      html = html.replace(/Professional Experience/g, cvLabels.experience);
      html = html.replace(/Technical Expertise/g, cvLabels.expertise);
      html = html.replace(/Technical Skills/g, cvLabels.skills);
      html = html.replace(/Key Projects/g, cvLabels.projects);
      html = html.replace(/Languages/g, cvLabels.languages);
      html = html.replace(/Education/g, cvLabels.education);
      html = html.replace(/I hereby declare that the info provided is true and correct\./g, cvLabels.declaration);
      
      return html;
    } catch (error) {
       console.error('Specimen Engine Fail:', error);
       return `
          <div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #0A2647; color: rgba(255,255,255,0.4); font-family: sans-serif; text-align: center; padding: 20px;">
            <div>
              <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
              <div style="font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Specimen Preview Unstable</div>
              <div style="font-size: 10px; margin-top: 5px; opacity: 0.5;">Engine Sync Interrupted</div>
            </div>
          </div>
       `;
    }
  },

  /**
   * Cover Letter Specimen Engine: Generates a professional document preview.
   * Matches the user's visual identity for maximum brand coherence.
   */
  async getCoverLetterHtml(text, colors, profile) {
    const primary = colors.primary || '#0A2647';
    const secondary = colors.secondary || '#C1A172';
    const name = profile?.basic?.fullName || profile?.name || 'Professional Identity';
    const email = profile?.basic?.email || profile?.email || '';
    const phone = profile?.basic?.phone || '';
    const location = profile?.basic?.location || '';
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: ${primary};
            --secondary: ${secondary};
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            -webkit-print-color-adjust: exact;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            background: white;
            padding: 25mm 25mm;
            margin: 0 auto;
            position: relative;
            box-sizing: border-box;
            overflow: hidden;
          }
          .accent-bar {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 12px;
            background: var(--primary);
          }
          .header {
            margin-top: 15px;
            border-bottom: 2.5px solid var(--secondary);
            padding-bottom: 35px;
            margin-bottom: 45px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .identity {
            flex: 1;
          }
          .name {
            font-family: 'Playfair Display', serif;
            font-size: 32pt;
            color: var(--primary);
            margin: 0;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            font-weight: 900;
            line-height: 1;
          }
          .contact {
            font-size: 9pt;
            color: #64748b;
            margin-top: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .date-block {
            margin-bottom: 50px;
          }
          .date {
            font-weight: 800;
            color: var(--primary);
            font-size: 11pt;
            text-transform: uppercase;
            letter-spacing: 0.15em;
          }
          .salutation {
            margin-bottom: 25px;
            font-weight: 800;
            color: #1e293b;
            font-size: 12pt;
          }
          .content {
            white-space: pre-line;
            color: #334155;
            text-align: justify;
            font-size: 10.8pt;
            line-height: 1.85;
            font-weight: 400;
          }
          .footer {
            margin-top: 80px;
          }
          .closing {
            font-size: 11pt;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 12px;
          }
          .signature-name {
            font-family: 'Playfair Display', serif;
            font-size: 16pt;
            color: var(--primary);
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 0.05em;
          }
          .watermark {
            position: absolute;
            bottom: 20mm;
            right: 25mm;
            font-size: 8pt;
            font-weight: 900;
            color: #e2e8f0;
            text-transform: uppercase;
            letter-spacing: 0.4em;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="accent-bar"></div>
          <div class="header">
            <div class="identity">
              <h1 class="name">${name}</h1>
              <div class="contact">
                ${email ? `<span>📧 ${email}</span>` : ''}
                ${phone ? `<span>📞 ${phone}</span>` : ''}
                ${location ? `<span>📍 ${location}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="date-block">
            <div class="date">${date}</div>
          </div>
          <div class="salutation">Dear Hiring Manager,</div>
          <div class="content">${text || 'AI is currently synthesizing your professional narrative into a high-fidelity cover letter specimen...'}</div>
          <div class="footer">
            <div class="closing">Sincerely,</div>
            <div class="signature-name">${name}</div>
          </div>
          <div class="watermark">DIGYNEX ENGINE V12.0</div>
        </div>
      </body>
      </html>
    `;
  }
};
