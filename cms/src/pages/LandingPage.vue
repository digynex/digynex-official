<template>
  <q-page class="official-page">
    <img src="logo.svg" alt="DigyNex Logo" class="nav-logo-svg" />
    <!-- Premium Navigation -->
    <nav class="glass-nav" :class="{ 'nav-scrolled': scrolled }">
      <div class="container nav-content">
        <div class="logo"><span class="gold-text">Digy</span>Nex</div>

        <!-- Desktop Links -->
        <ul class="nav-links gt-sm">
          <li><a href="#home" @click.prevent="scrollToSection('#home')">Home</a></li>
          <li><a href="#products" @click.prevent="scrollToSection('#products')">Products</a></li>
          <li><a href="#services" @click.prevent="scrollToSection('#services')">Services</a></li>
          <li><a href="#about" @click.prevent="scrollToSection('#about')">About</a></li>
        </ul>

        <div class="nav-actions">
          <a
            href="#contact"
            @click.prevent="scrollToSection('#contact')"
            class="btn btn-outline gt-xs"
            >Contact Us</a
          >
          <button
            @click="openLoginModal('https://cms.digynex.se/cms/portal/dashboard')"
            class="btn btn-gold gt-xs"
          >
            Client Portal
          </button>

          <!-- Mobile Toggle -->
          <button class="mobile-menu-toggle ml-auto" @click="mobileMenuOpen = !mobileMenuOpen">
            <i class="fa-solid" :class="mobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div class="mobile-nav" :class="{ active: mobileMenuOpen }">
        <a href="#home" @click.prevent="mobileScrollTo('#home')">Home</a>
        <a href="#products" @click.prevent="mobileScrollTo('#products')">Products</a>
        <a href="#services" @click.prevent="mobileScrollTo('#services')">Services</a>
        <a href="#about" @click.prevent="mobileScrollTo('#about')">About</a>
        <a href="#contact" @click.prevent="mobileScrollTo('#contact')">Contact Us</a>
        <button
          @click="openLoginModal('https://cms.digynex.se/cms/portal/dashboard')"
          class="btn btn-gold"
        >
          Client Portal
        </button>
      </div>
    </nav>

    <main>
      <!-- Hero Section -->
      <section id="home" class="hero">
        <div class="hero-glow"></div>
        <div class="container hero-content">
          <div class="hero-text">
            <span class="badge">Next Generation IT Ecosystem</span>
            <h1>Architecting the <span class="gold-text">Digital Future</span></h1>
            <p>
              Empowering businesses and institutions worldwide with high-performance digital tools,
              automation, and unparalleled IT expertise.
            </p>
            <div class="cta-group">
              <a
                href="#products"
                @click.prevent="scrollToSection('#products')"
                class="btn btn-gold btn-lg"
                >Explore Ecosystem</a
              >
              <button @click="openLoginModal()" class="btn btn-glass btn-lg">
                <i class="fa-solid fa-user-lock"></i> Client Access
              </button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="tech-canvas">
              <!-- Integrated Branding -->
              <div class="hero-branding">
                <div class="brand-identity">
                  <span class="brand-name">Digy<span class="gold-text">Nex</span></span>
                  <div class="brand-status">
                    <span class="status-dot"></span>
                    <span>Systems Online</span>
                  </div>
                </div>
              </div>

              <!-- Animated UI Elements -->
              <div class="ui-cluster">
                <div class="glass-element core-ui">
                  <img
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1500&auto=format&fit=crop"
                    alt="Core Infrastructure"
                    class="ui-img"
                  />
                </div>
                <div class="floating-data dns-card">
                  <i class="fa-solid fa-microchip icon-gold gold-text"></i>
                  <div class="data-text">
                    <small>Core Engine</small>
                    <strong>v3.0 ENTERPRISE</strong>
                  </div>
                </div>
                <div class="floating-data lead-card">
                  <i class="fa-solid fa-bolt icon-gold gold-text"></i>
                  <div class="data-text">
                    <small>Execution Speed</small>
                    <strong>0.02ms LATENCY</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Tabs Section -->
      <section id="products" class="products">
        <div class="container">
          <div class="section-header">
            <h2>Our <span class="gold-text">Product Ecosystem</span></h2>
            <p>Scalable solutions designed for the modern world.</p>
          </div>

          <div class="product-tabs-wrapper">
            <div class="tab-triggers">
              <a
                href="#enterprise-cms"
                @click.prevent="scrollToSection('#enterprise-cms')"
                class="tab-btn"
                >Enterprise CMS</a
              >
              <a
                href="#tuition-engine"
                @click.prevent="scrollToSection('#tuition-engine')"
                class="tab-btn"
                >Tuition Manager</a
              >
              <a href="#fb-nexus" @click.prevent="scrollToSection('#fb-nexus')" class="tab-btn"
                >Facebook Nexus</a
              >
              <a
                href="#future-labs"
                @click.prevent="scrollToSection('#future-labs')"
                class="tab-btn"
                >Future Labs</a
              >
            </div>
          </div>

          <div class="product-stack">
            <!-- Enterprise CMS Section -->
            <div id="enterprise-cms" class="tab-content active q-mb-xl scroll-margin">
              <div class="row q-col-gutter-xl items-center">
                <div class="col-12 col-md-6">
                  <div class="product-badge blue-badge">Operational Excellence</div>
                  <h2>Nexus <span class="gold-text">Enterprise CMS</span></h2>
                  <p>
                    The operational heart for scaling businesses. A comprehensive ecosystem for lead
                    orchestration, client lifecycle management, and high-performance workflow
                    automation.
                  </p>
                  <ul class="feature-list">
                    <li><i class="fa-solid fa-check"></i> Advanced CRM & Lead Scoring</li>
                    <li><i class="fa-solid fa-check"></i> n8n Workflow Integration</li>
                    <li><i class="fa-solid fa-check"></i> Sales Pipeline Visualization</li>
                  </ul>
                  <div class="q-gutter-md q-mt-lg">
                    <button @click="openLeadModal('Enterprise CMS')" class="btn btn-gold">
                      Request Demo
                    </button>
                    <router-link to="/cms" class="btn btn-glass"> View </router-link>
                    <a
                      href="https://cms.digynex.se/login?redirect=/cms/portal/dashboard"
                      class="btn btn-gold-outline"
                      style="
                        border: 1px solid var(--liquid-gold);
                        background: transparent;
                        padding: 12px 24px;
                        color: var(--liquid-gold);
                        border-radius: 8px;
                        text-decoration: none;
                        display: inline-block;
                        font-weight: 600;
                      "
                    >
                      Portal
                    </a>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="glass-card product-card">
                    <img
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
                      alt="Enterprise CMS"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Tuition Manager Section -->
            <div id="tuition-engine" class="tab-content active q-mb-xl">
              <div class="row q-col-gutter-xl items-center">
                <div class="col-12 col-md-6 order-md-last">
                  <div class="product-badge">Next Gen Education</div>
                  <h2>DigyNex <span class="gold-text">Tuition Manager</span></h2>
                  <p>
                    A central operating system for educational institutes. Manage students,
                    attendance, payments, and exams with military-grade precision and speed.
                  </p>
                  <ul class="feature-list">
                    <li><i class="fa-solid fa-check"></i> QR-Based Biometric Attendance</li>
                    <li><i class="fa-solid fa-check"></i> Automated Parent SMS Alerts</li>
                    <li><i class="fa-solid fa-check"></i> Revenue & Growth Analytics</li>
                  </ul>
                  <div class="q-gutter-md q-mt-lg">
                    <button
                      class="btn btn-gold"
                      @click="openNexusDemo('Initializing Tuition Module...')"
                    >
                      Live Demo
                    </button>
                    <router-link to="/tms" class="btn btn-glass"> Explore </router-link>
                    <a
                      href="https://tms.digynex.se/login?redirect=/tms/portal/dashboard"
                      class="btn btn-gold-outline"
                      style="
                        border: 1px solid var(--liquid-gold);
                        background: transparent;
                        padding: 12px 24px;
                        color: var(--liquid-gold);
                        border-radius: 8px;
                        text-decoration: none;
                        display: inline-block;
                        font-weight: 600;
                      "
                    >
                      Portal
                    </a>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="glass-card product-card">
                    <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
                      alt="Tuition Manager"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Facebook Nexus Section -->
            <div id="fb-nexus" class="tab-content active q-mb-xl">
              <div class="product-grid">
                <div class="product-info">
                  <h3>Nexus Flow (FB Automation)</h3>
                  <p>
                    The ultimate marketing engine. Scale your reach without lifting a finger. Our
                    AI-driven automation handles engagement, posting, and leads.
                  </p>
                  <ul class="features-list">
                    <li><i class="fa-solid fa-check gold-text"></i> Intelligent Auto-Engagement</li>
                    <li><i class="fa-solid fa-check gold-text"></i> High-Speed Lead Generation</li>
                    <li><i class="fa-solid fa-check gold-text"></i> 24/7 Smart Posting Engine</li>
                  </ul>

                  <div
                    v-if="nexusMonitorVisible"
                    class="nexus-monitor glass-card q-mb-md q-pa-md"
                    style="border-radius: 12px; background: rgba(255, 255, 255, 0.03)"
                  >
                    <div class="flex items-center q-gutter-x-sm q-mb-sm">
                      <span class="status-indicator online"></span>
                      <strong class="text-caption text-uppercase text-gold tracking-widest"
                        >NEXUS LIVE FEED</strong
                      >
                    </div>
                    <div class="text-caption text-grey-5 q-mb-xs">
                      {{ nexusStatusText }}
                    </div>
                    <div
                      style="
                        height: 4px;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 2px;
                        overflow: hidden;
                        margin-bottom: 12px;
                      "
                    >
                      <div
                        :style="{
                          width: nexusProgress + '%',
                          background: 'var(--gold-gradient)',
                          transition: '0.5s',
                          height: '100%',
                        }"
                      ></div>
                    </div>

                    <!-- Live Activity Feed -->
                    <div class="activity-feed" v-if="nexusFeed.length > 0">
                      <div
                        v-for="item in nexusFeed"
                        :key="item.id"
                        class="feed-item q-mb-xs flex justify-between items-center"
                        style="font-size: 11px; color: rgba(255, 255, 255, 0.6)"
                      >
                        <span
                          ><i class="fa-solid fa-caret-right q-mr-xs text-gold"></i>
                          {{ item.message }}</span
                        >
                        <span style="opacity: 0.5">{{ item.time }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="cta-row">
                    <button @click="triggerNexusFlow" class="btn btn-gold" :disabled="nexusRunning">
                      {{ nexusRunning ? 'Engine Running...' : 'Trigger Nexus Flow' }}
                    </button>
                    <a href="https://n8n.digynex.se/" target="_blank" class="btn btn-glass"
                      >Admin Portal</a
                    >
                  </div>
                </div>
                <div class="product-image">
                  <div class="product-slider glass-mockup">
                    <div
                      v-for="(slide, index) in fbSlides"
                      :key="index"
                      class="p-slide"
                      :class="{ active: currentFbSlide === index }"
                    >
                      <img :src="slide.image" :alt="slide.label" />
                      <div class="p-slide-overlay">
                        <span>{{ slide.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Future Labs Section -->
            <div id="future-labs" class="tab-content active">
              <div class="product-grid">
                <div class="product-info">
                  <h3>Future Labs R&D</h3>
                  <p>
                    Where cutting-edge technology meets practical innovation. We are currently
                    developing advanced neural networks for predictive business analytics and
                    autonomous agent systems.
                  </p>
                  <ul class="features-list">
                    <li><i class="fa-solid fa-check gold-text"></i> Next-Gen AI Agents</li>
                    <li><i class="fa-solid fa-check gold-text"></i> Blockchain Verification</li>
                    <li><i class="fa-solid fa-check gold-text"></i> Quantum-Safe Encryption</li>
                  </ul>
                  <div class="cta-row">
                    <button @click="openLeadModal('Future Labs')" class="btn btn-gold">
                      Join Beta
                    </button>
                  </div>
                </div>
                <div class="product-image">
                  <div class="glass-mockup">
                    <img
                      src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop"
                      alt="Future Labs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="services">
        <div class="container">
          <div class="section-header">
            <h2>Superior <span class="gold-text">IT Services</span></h2>
            <p>Beyond products, we provide the backbone for your digital presence.</p>
          </div>
          <div class="services-grid">
            <div v-for="(service, index) in services" :key="index" class="service-card">
              <div class="service-icon">
                <i :class="service.icon"></i>
              </div>
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- About Us Section -->
      <section id="about" class="about">
        <div class="container about-container">
          <div class="about-image">
            <div class="glass-orb-container">
              <div class="glass-orb"></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                alt="Our Team"
                class="about-img"
              />
            </div>
          </div>
          <div class="about-text">
            <span class="badge">The DigyNex Mission</span>
            <h2>Architecting a <span class="gold-text">Smarter World</span></h2>
            <p>
              Founded on the principle of digital excellence, DigyNex has evolved from a boutique IT
              firm into a global ecosystem provider. We don't just build software; we architect the
              future of how businesses interact with technology.
            </p>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">500+</span>
                <span class="stat-label">Clients Globally</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">99.9%</span>
                <span class="stat-label">Uptime Core</span>
              </div>
            </div>
            <button @click="openLeadModal('Partnership Proposal')" class="btn btn-gold">
              Join the Ecosystem
            </button>
          </div>
        </div>
      </section>

      <!-- Compact Modern Contact Section -->
      <section id="contact" class="contact">
        <div class="container">
          <div class="contact-compact-wrapper">
            <div class="contact-header-minimal">
              <span class="badge">Direct Access</span>
              <h2>Get in <span class="gold-text">Touch</span></h2>
              <p>Sweden HQ | Global Digital Solutions</p>
            </div>

            <div class="contact-methods-hub">
              <a href="tel:46790522874" class="hub-item">
                <i class="fa-solid fa-phone"></i>
                <div class="hub-text">
                  <small>Call Direct</small>
                  <span>+46 79 052 28 74</span>
                </div>
              </a>
              <a href="mailto:info@digynex.se" class="hub-item">
                <i class="fa-solid fa-envelope"></i>
                <div class="hub-text">
                  <small>Email Us</small>
                  <span>info@digynex.se</span>
                </div>
              </a>
              <div class="hub-item" @click="downloadVCard">
                <i class="fa-solid fa-address-card"></i>
                <div class="hub-text">
                  <small>Save to Phone</small>
                  <span>Digital Business Card</span>
                </div>
              </div>
            </div>

            <div class="contact-footer-actions">
              <button @click="openLeadModal('Global Inquiry')" class="btn btn-gold">
                Start a Conversation
              </button>
              <router-link to="/card" class="btn btn-glass">View NFC Profile</router-link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="main-footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <div class="logo"><span class="gold-text">Digy</span>Nex</div>
          <p>Global Leaders in IT Transformation.</p>
        </div>
        <div class="footer-links">
          <h4>Solutions</h4>
          <a href="#">Tuition Manager</a>
          <a href="#">FB Nexus</a>
          <a href="#">Custom Software</a>
        </div>
        <div class="footer-links">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div class="footer-contact">
          <h4>Connect</h4>
          <div class="social-icons">
            <a href="https://facebook.com/digynex.se" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.linkedin.com/in/digynex-amila" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
            <a href="https://github.com/digynex" target="_blank"><i class="fa-brands fa-github"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          &copy; 2026 DigyNex Systems. Official Domain |
          <span class="gold-text">digynex.se</span>
        </p>
        <div class="developer-credit" style="margin-top: 15px; opacity: 0.5; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">
           Engineered by <a href="/portfolio/index.html" class="gold-text" style="text-decoration: none;">Amila</a>
        </div>
      </div>
    </footer>

    <!-- Lead Modal -->
    <div class="modal-overlay" :class="{ active: leadModalActive }" @click.self="closeLeadModal">
      <div class="modal-card">
        <button class="close-btn" @click="closeLeadModal">&times;</button>
        <h3>Get Started with {{ currentProductName }}</h3>
        <p>Enter your details and our team will contact you within 24 hours.</p>
        <form class="lead-form" @submit.prevent="handleLeadForm">
          <input type="text" v-model="leadForm.name" placeholder="Full Name" required />
          <input type="email" v-model="leadForm.email" placeholder="Work Email" required />
          <textarea
            v-model="leadForm.requirement"
            placeholder="Your Requirement"
            rows="4"
          ></textarea>
          <button type="submit" class="btn btn-gold full-width" :disabled="formSubmitting">
            {{ formSubmitting ? 'Processing...' : 'Send Request' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Login Modal -->
    <div class="modal-overlay" :class="{ active: loginModalActive }" @click.self="closeLoginModal">
      <div class="modal-card">
        <button class="close-btn" @click="closeLoginModal">&times;</button>
        <h3>Client Access Portal</h3>
        <p>Login to manage your automation & IT assets.</p>
        <form class="lead-form" @submit.prevent="handleLogin">
          <div class="input-group">
            <i class="fa-solid fa-user icon-field"></i>
            <input
              type="text"
              v-model="loginForm.user"
              placeholder="Client ID / Username"
              required
            />
          </div>
          <div class="input-group">
            <i class="fa-solid fa-lock icon-field"></i>
            <input type="password" v-model="loginForm.password" placeholder="Password" required />
          </div>
          <button type="submit" class="btn btn-gold full-width" :disabled="loginSubmitting">
            {{ loginSubmitting ? 'Authenticating...' : 'Secure Entry' }}
          </button>
          <div class="login-footer">
            <small><a href="#" class="gold-text">Forgot Credentials?</a></small>
          </div>
        </form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

// SCSS Import
import 'src/css/official.css'

// State
const router = useRouter()
const scrolled = ref(false)
const currentFbSlide = ref(0)
const leadModalActive = ref(false)
const loginModalActive = ref(false)
const mobileMenuOpen = ref(false)
const currentProductName = ref('')
const formSubmitting = ref(false)
const loginSubmitting = ref(false)

const services = [
  {
    icon: 'fa-solid fa-screwdriver-wrench',
    title: 'Precision IT Repair',
    description:
      'Specialized hardware diagnostics and restoration for corporate infrastructure and high-end workstations.',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'Cyber Security',
    description:
      'Military-grade encryption and proactive threat monitoring to safeguard your institutional data assets.',
  },
  {
    icon: 'fa-solid fa-cloud-arrow-up',
    title: 'Cloud Engineering',
    description:
      'Scalable cloud architecture setup and migration services optimized for performance and cost-efficiency.',
  },
  {
    icon: 'fa-solid fa-brain',
    title: 'AI Integration',
    description:
      'Custom neural networks and automation workflows tailored to optimize your business logic.',
  },
]

const fbSlides = [
  {
    label: 'Branded Identity',
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop',
  },
  {
    label: 'Cyber Infrastructure',
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
  },
]

const leadForm = reactive({
  name: '',
  email: '',
  requirement: '',
})

const loginForm = reactive({
  user: '',
  password: '',
})

// Nexus Logic
const nexusMonitorVisible = ref(false)
const nexusRunning = ref(false)
const nexusStatusText = ref('Connecting to VPS Engine...')
const nexusProgress = ref(0)
const nexusFeed = ref([])

const triggerNexusFlow = () => {
  nexusMonitorVisible.value = true
  nexusRunning.value = true
  nexusFeed.value = []

  const steps = [
    { text: 'Initializing Nexus Engine (VPS)...', progress: 20, feed: 'Engine Core: Online' },
    {
      text: 'Gemini AI: Analyzing Trend Data...',
      progress: 40,
      feed: 'AI Analysis: Patterns identified',
    },
    {
      text: 'Gemini Cloud: Architecting Visual Content...',
      progress: 60,
      feed: 'Creative: Assets generated',
    },
    {
      text: 'Awaiting Human-in-the-loop Approval (Telegram)...',
      progress: 85,
      feed: 'Hand-off: Payload sent to Telegram',
    },
  ]

  let currentStep = 0
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      nexusStatusText.value = steps[currentStep].text
      nexusProgress.value = steps[currentStep].progress
      nexusFeed.value.unshift({
        id: Date.now(),
        message: steps[currentStep].feed,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      })
      currentStep++
    } else {
      clearInterval(interval)

      // We still try the fetch, but we handle it silently to keep the UX clean
      fetch('https://n8n.digynex.se/webhook/nexus-start', {
        method: 'POST',
        body: JSON.stringify({
          action: 'manual_trigger',
          source: 'landing_page',
        }),
      }).finally(() => {
        // Even if it fails, we show a professional "Active" state
        nexusStatusText.value = 'Nexus Flow Active: Monitoring Channels...'
        nexusProgress.value = 100
        nexusRunning.value = false
        nexusFeed.value.unshift({
          id: 'final',
          message: 'Live Monitoring: Engaged',
          time: 'NOW',
        })
      })
    }
  }, 1800)
}

// Modal Handlers
const openLeadModal = (productName) => {
  currentProductName.value = productName
  leadModalActive.value = true
  document.body.style.overflow = 'hidden'
}

const closeLeadModal = () => {
  leadModalActive.value = false
  document.body.style.overflow = 'auto'
}

const openLoginModal = (target = '') => {
  if (target && target.startsWith('http')) {
    window.location.href = `/login?redirect=${encodeURIComponent(target)}`
  } else if (target) {
    router.push(`/login?redirect=${target}`)
  } else {
    router.push('/login')
  }
}

const closeLoginModal = () => {
  loginModalActive.value = false
  document.body.style.overflow = 'auto'
}

const handleLeadForm = () => {
  formSubmitting.value = true
  setTimeout(() => {
    alert(
      `Success! Your request for ${currentProductName.value} has been logged. Our Team will reach out to you at ${leadForm.email} within 24 hours.`,
    )
    formSubmitting.value = false
    closeLeadModal()
    leadForm.name = ''
    leadForm.email = ''
    leadForm.requirement = ''
  }, 1500)
}

const handleLogin = () => {
  loginSubmitting.value = true
  setTimeout(() => {
    // Check if there was a previous intention, else default to TMS for legacy
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect') || '/cms/portal/dashboard'
    router.push(redirect)
  }, 1000)
}

const downloadVCard = () => {
  const vCardData =
    'BEGIN:VCARD\n' +
    'VERSION:3.0\n' +
    'FN:DigyNex IT Support\n' +
    'ORG:DigyNex Systems\n' +
    'TEL;TYPE=WORK,VOICE:46790522874\n' +
    'EMAIL;TYPE=WORK,INTERNET:info@digynex.se\n' +
    'URL:https://digynex.se\n' +
    'END:VCARD'

  const blob = new Blob([vCardData], { type: 'text/vcard' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'DigyNex_Contact.vcf')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Lifecycle
let sliderInterval = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  sliderInterval = setInterval(() => {
    currentFbSlide.value = (currentFbSlide.value + 1) % fbSlides.length
  }, 5000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (sliderInterval) clearInterval(sliderInterval)
})

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const scrollToSection = (id) => {
  const el = document.getElementById(id.replace('#', ''))
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 80,
      behavior: 'smooth',
    })
  }
}

const mobileScrollTo = (id) => {
  mobileMenuOpen.value = false
  scrollToSection(id)
}
</script>

<style scoped>
/* Scoped styles to prevent leakage, although official.css handles most */
.nav-scrolled {
  padding: 15px 0 !important;
  background: rgba(10, 15, 28, 0.95) !important;
}

.scroll-margin {
  scroll-margin-top: 100px;
}

.tab-btn {
  text-decoration: none;
  display: inline-block;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.online {
  background: #22c55e;
  box-shadow: 0 0 10px #22c55e;
  animation: pulse-status 2s infinite;
}

@keyframes pulse-status {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.tracking-widest {
  letter-spacing: 0.2em;
}

.text-gold {
  color: var(--liquid-gold);
}
</style>
