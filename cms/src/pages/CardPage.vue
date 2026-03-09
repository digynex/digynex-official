<template>
  <q-page class="card-page">
    <img src="logo.svg" alt="DigyNex Logo" class="nav-logo-svg" />
    <div class="card">
      <div class="lang-switch">
        <button class="lang-btn" :class="{ active: lang === 'en' }" @click="lang = 'en'">EN</button>
        <button class="lang-btn" :class="{ active: lang === 'sw' }" @click="lang = 'sw'">SW</button>
      </div>

      <div class="logo-wrap">
        <img src="/Logo.png" class="logo-img" />
      </div>

      <h1>DigyNex</h1>

      <div class="hero-text">
        <template v-if="lang === 'en'">
          Trusted IT support for seniors, homes, and small businesses —<br />
          local visits in Gothenburg and remote help across Nordic & USA.
        </template>
        <template v-else>
          Trygg IT-hjälp för seniorer, hem och småföretag —<br />
          hembesök i Göteborg och fjärrsupport i Norden & USA.
        </template>
      </div>

      <div class="exp-save-wrap">
        <div class="experience">18+ Years of IT Expertise</div>
        <a @click="downloadVCard" class="prime-save-btn">
          <i class="fa-solid fa-user-plus"></i> Save Contact
        </a>
      </div>

      <div class="section-title">About Us</div>
      <div class="about-text">
        We provide calm, reliable IT support for seniors, homes, and small businesses. With over 18
        years of hands-on experience, DigyNex helps you fix problems, stay secure, and use
        technology with confidence — without technical stress.
      </div>

      <div class="section-title">Our Services</div>
      <div class="services-list">
        <div class="service-item">
          <i class="fa-solid fa-laptop-medical service-icon"></i> IT Support & Repairs – computers &
          phones
        </div>
        <div class="service-item">
          <i class="fa-solid fa-shield-halved service-icon"></i> Cyber Security – email & data
          protection
        </div>
        <div class="service-item">
          <i class="fa-solid fa-network-wired service-icon"></i> Network & WiFi Setup – fast, stable
          internet
        </div>
        <div class="service-item">
          <i class="fa-solid fa-video service-icon"></i> CCTV & Smart Home – installation & support
        </div>
      </div>

      <a href="tel:46790522874" class="btn">
        <i class="fa-solid fa-phone icon-gold"></i> Call Me
      </a>
      <a href="https://wa.me/46790522874" class="btn">
        <i class="fa-brands fa-whatsapp icon-whatsapp"></i> WhatsApp
      </a>
      <a href="mailto:info@digynex.se" class="btn">
        <i class="fa-solid fa-envelope icon-gold"></i> info@digynex.se
      </a>

      <p class="explanation">We explain clearly — no technical language.</p>

      <div class="qr-container">
        <div class="qr-wrapper">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://digynex.se"
            class="qr-img"
          />
          <img src="/Logo.png" class="qr-logo" />
        </div>
        <div class="qr-text">SCAN TO VISIT</div>
      </div>

      <div class="footer">digynex.se | Teknik utan krångel</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const lang = ref('en')

const downloadVCard = () => {
  const v =
    'BEGIN:VCARD\nVERSION:3.0\nFN:DigyNex IT Support\nTEL:46790522874\nEMAIL:info@digynex.se\nURL:https://digynex.se\nEND:VCARD'
  const b = new Blob([v], { type: 'text/vcard' })
  const url = URL.createObjectURL(b)
  const a = document.createElement('a')
  a.href = url
  a.download = 'DigyNex.vcf'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.card-page {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #cfcfcf;
  font-family: Montserrat, sans-serif;
  padding: 20px 10px;
}

.nav-logo-svg {
  position: fixed;
  top: -55px;
  left: 0.5rem;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: logo-spin 12s linear infinite;
  filter: drop-shadow(0 0 55px rgba(212, 175, 55, 0.7));
  z-index: 9999;
  pointer-events: none;
}

@keyframes logo-spin {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}

.card {
  position: relative;
  max-width: 400px;
  width: 100%;
  padding: 40px 26px 35px;
  border-radius: 30px;
  text-align: center;
  color: #fff;
  background: linear-gradient(to bottom, #1d2d47, #0a0f1c);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-wrap {
  width: 135px;
  height: 135px;
  margin: auto;
  padding: 3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #bf953f, #fcf6ba, #aa771c);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.logo-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #0a0f1c;
  padding: 4px;
  object-fit: contain;
}

h1 {
  margin: 8px 0 6px;
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #bf953f, #fcf6ba, #aa771c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lang-switch {
  position: absolute;
  top: 18px;
  right: 18px;
  display: flex;
  gap: 6px;
}

.lang-btn {
  background: transparent;
  border: 1px solid #bf953f;
  color: #bf953f;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
}

.lang-btn.active {
  background: #bf953f;
  color: #0a0f1c;
}

.hero-text {
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
  margin: 6px 0 16px;
}

.exp-save-wrap {
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.experience {
  padding: 6px 20px;
  border-radius: 30px;
  background: rgba(191, 149, 63, 0.15);
  color: #bf953f;
  font-size: 14px;
  font-weight: 600;
}

.prime-save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(191, 149, 63, 0.4);
  color: #bf953f;
  font-size: 13px;
  text-decoration: none;
  cursor: pointer;
}

.section-title {
  margin: 15px 0 8px;
  font-size: 13px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.about-text {
  background: rgba(255, 255, 255, 0.05);
  padding: 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
}

.services-list {
  text-align: left;
  margin: 20px 0 30px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 12px 0;
  font-weight: 600;
}

.service-icon {
  color: #bf953f;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 15px;
  margin: 10px 0;
  border-radius: 15px;
  text-decoration: none;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: 0.3s;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.icon-gold {
  color: #bf953f;
  font-size: 18px;
}

.icon-whatsapp {
  color: #25d366;
  font-size: 20px;
}

.explanation {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
}

.qr-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.qr-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  background: #fff;
  padding: 5px;
  border-radius: 12px;
}

.qr-img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.qr-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25px;
  height: 25px;
  background: #0a0f1c;
  border-radius: 50%;
  padding: 3px;
  border: 2px solid #fff;
}

.qr-text {
  font-size: 10px;
  color: #bf953f;
  letter-spacing: 1px;
}

.footer {
  margin-top: 25px;
  font-size: 11px;
  color: #bf953f;
  letter-spacing: 1px;
}
</style>
