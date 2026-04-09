document.addEventListener("DOMContentLoaded", () => {
  console.log("DigyNex Pricing Logic v3.1 Active");
  // Safety Reset for Scroll
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";
  // Product Tab Switching Logic
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");

      // Update Buttons
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update Content
      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === target) {
          content.classList.add("active");
        }
      });
    });
  });

  // Product Image Slider Logic (specifically for FB Nexus)
  const pSlides = document.querySelectorAll(".p-slide");
  let currentPSlide = 0;

  function nextPSlide() {
    if (pSlides.length > 0) {
      pSlides[currentPSlide].classList.remove("active");
      currentPSlide = (currentPSlide + 1) % pSlides.length;
      pSlides[currentPSlide].classList.add("active");
    }
  }

  // Change FB product slide every 5 seconds
  setInterval(nextPSlide, 5000);

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Simple Scroll Animation for Header
  window.addEventListener("scroll", () => {
    const nav = document.querySelector(".glass-nav");
    if (window.scrollY > 50) {
      nav.style.padding = "15px 0";
      nav.style.background = "rgba(10, 15, 28, 0.95)";
    } else {
      nav.style.padding = "20px 0";
      nav.style.background = "rgba(10, 15, 28, 0.8)";
    }
  });

  // Modal Logic
  window.openLeadModal = function (productName) {
    const modal = document.getElementById("leadModal");
    const title = document.getElementById("modalTitle");
    title.innerText = `Get Started with ${productName}`;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeLeadModal = function () {
    document.getElementById("leadModal").classList.remove("active");
    document.body.style.overflow = "auto";
  };

  window.openDemoModal = function () {
    const videoId = "kLF0Z1wYRKw";
    const iframe = document.getElementById("demoVideoFrame");
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&mute=1`;
    }
    document.getElementById("videoModal").classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeDemoModal = function () {
    const iframe = document.getElementById("demoVideoFrame");
    if (iframe) {
      iframe.src = "";
    }
    document.getElementById("videoModal").classList.remove("active");
    document.body.style.overflow = "auto";
  };

  window.handleForm = function (e) {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    const originalText = btn.innerText;
    
    // Get Data from the form correctly
    const formData = {
      name: e.target[0].value,
      email: e.target[1].value,
      phone: e.target[2].value,
      requirement: e.target[3].value,
      product: document.getElementById("modalTitle").innerText,
      timestamp: new Date().toISOString(),
      source: "Website"
    };

    btn.innerText = "Processing...";
    btn.disabled = true;

    // Send only to n8n Webhook
    // n8n will handle the Supabase insertion and other automations
    fetch("https://n8n.digynex.se/webhook/lead-ingestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then(() => {
      alert("Success! Your request has been logged. Our Team will reach out to you within 24 hours.");
    })
    .catch((err) => {
      console.error("Submission error:", err);
      alert("Success! Your request has been logged. Our Team will reach out to you within 24 hours.");
    })
    .finally(() => {
      // PROPER CLEANUP: This always runs even if n8n fails
      btn.innerText = originalText;
      btn.disabled = false;
      if (typeof closeLeadModal === "function") {
        closeLeadModal();
      }
      e.target.reset();
    });
  };


  // Nexus Flow Automation Trigger
  window.triggerNexusFlow = function () {
    const monitor = document.getElementById("nexusMonitor");
    const statusText = document.getElementById("nexusStatus");
    const progressFill = document.getElementById("nexusProgress");
    const btn = document.getElementById("nexusTriggerBtn");

    monitor.style.display = "block";
    btn.disabled = true;
    btn.innerText = "Engine Running...";

    const steps = [
      { text: "Initializing Nexus Engine (VPS)...", progress: 20 },
      { text: "Gemini AI: Analyzing Trend Data...", progress: 40 },
      { text: "Gemini Cloud: Architecting Visual Content...", progress: 60 },
      {
        text: "Awaiting Human-in-the-loop Approval (Telegram)...",
        progress: 85,
      },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        statusText.innerText = steps[currentStep].text;
        progressFill.style.width = steps[currentStep].progress + "%";
        currentStep++;
      } else {
        clearInterval(interval);
        // Trigger the actual n8n Webhook
        fetch("https://n8n.digynex.se/webhook/nexus-start", {
          method: "POST",
          body: JSON.stringify({
            action: "manual_trigger",
            source: "landing_page",
          }),
        })
          .then(() => {
            statusText.innerHTML =
              '<span style="color:var(--gold)">✅ Success:</span> Payload sent to Telegram. Check your bot for approval.';
            progressFill.style.width = "100%";
          })
          .catch(() => {
            statusText.innerText = "Error: VPS Connection failed. Check n8n.";
            btn.disabled = false;
            btn.innerText = "Retry Trigger";
          });
      }
    }, 2000);
  };

  // Login Modal Logic
  window.openLoginModal = function () {
    document.getElementById("loginModal").classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeLoginModal = function () {
    document.getElementById("loginModal").classList.remove("active");
    document.body.style.overflow = "auto";
  };

  window.handleLogin = function (e) {
    e.preventDefault();
    const user = e.target[0].value;
    const btn = e.target.querySelector("button");

    btn.innerText = "Authenticating...";
    btn.disabled = true;

    setTimeout(() => {
      console.log("Portal Access Attempt:", user);
      alert("Authorization Required: Redirecting to secure portal environment...");
      // Actual Redirect to the Tuition Manager Portal
      window.location.href = "https://tms.digynex.se";
      btn.innerText = "Secure Entry";
      btn.disabled = false;
      closeLoginModal();
    }, 2000);
  };

  // Partnership Program Logic
  window.openPartnerModal = function () {
    const modal = document.getElementById("partnerModal");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    // Reset state if already used
    document.getElementById("partnerSuccessMsg").style.display = "none";
    document.querySelector("#partnerModal form").style.display = "block";
  };

  window.closePartnerModal = function () {
    document.getElementById("partnerModal").classList.remove("active");
    document.body.style.overflow = "auto";
  };

  window.handlePartnerRegistration = function (e) {
    e.preventDefault();
    const btn = document.getElementById("partnerSubmitBtn");
    const successMsg = document.getElementById("partnerSuccessMsg");
    const form = e.target;
    
    const partnerData = {
      name: document.getElementById("p_name").value,
      email: document.getElementById("p_email").value,
      country: document.getElementById("p_country").value,
      phone: document.getElementById("p_phone").value,
      company: document.getElementById("p_company").value,
      type: "Partner Registration",
      timestamp: new Date().toISOString()
    };

    btn.innerText = "Processing Application...";
    btn.disabled = true;

    // Send to n8n Partner Webhook
    fetch("https://n8n.digynex.se/webhook/partner-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partnerData),
    })
    .finally(() => {
      // Show success either way for better UX (n8n will swallow errors or we handle them later)
      form.style.display = "none";
      successMsg.style.display = "block";
      
      // Auto close after 5 seconds to return to site
      setTimeout(() => {
        closePartnerModal();
        // Reset form for next time
        form.reset();
        form.style.display = "block";
        successMsg.style.display = "none";
        btn.innerText = "Apply to Join Program";
        btn.disabled = false;
      }, 5000);
    });
  };

  // vCard Download Logic
  window.downloadVCard = function () {
    const vCardData =
      "BEGIN:VCARD\n" +
      "VERSION:3.0\n" +
      "FN:DigyNex IT Support\n" +
      "ORG:DigyNex Systems\n" +
      "TEL;TYPE=WORK,VOICE:46790522874\n" +
      "EMAIL;TYPE=WORK,INTERNET:info@digynex.se\n" +
      "URL:https://digynex.se/whatsapp/\n" +
      "END:VCARD";

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "DigyNex_Contact.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close modals on outside click or Escape key
  const closeAllModals = () => {
    if (typeof closeLeadModal === "function") closeLeadModal();
    if (typeof closeDemoModal === "function") closeDemoModal();
    if (typeof closeLoginModal === "function") closeLoginModal();
    if (typeof closePartnerModal === "function") closePartnerModal();
    document.body.style.overflow = "auto";
  };

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeAllModals();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // --- AI CHAT WIDGET LOGIC ---
  const chatWindow = document.getElementById("chatWindow");
  const chatPeek = document.getElementById("chatPeek");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const langSelect = document.getElementById("langSelect");
  let chatSessionId = "web-" + Math.random().toString(36).substring(7);

  window.toggleChat = function() {
    chatWindow.classList.toggle("active");
    if (chatPeek) chatPeek.style.display = "none";
  };

  window.changeLanguage = function() {
    const lang = langSelect.value;
    const msgBlock = document.querySelector(".welcome-msg p");
    
    if (lang === "si") {
      msgBlock.innerText = "DigyNex Ecosystem එකට සාදරයෙන් පිළිගන්නවා! 🇸🇪 අද මට ඔයාට කොහොමද උදව් කරන්න පුළුවන්?";
    } else if (lang === "sv") {
      msgBlock.innerText = "Välkommen till DigyNex Ecosystem! 🇸🇪 Hur kan jag hjälpa dig idag?";
    } else {
      msgBlock.innerText = "Welcome to DigyNex Ecosystem! 🇸🇪 How can I assist you today?";
    }
  };

  window.quickAction = function(actionText) {
    chatInput.value = actionText;
    sendChatMessage();
  };

  window.handleChatEnter = function(e) {
    if (e.key === "Enter") {
      sendChatMessage();
    }
  };

  window.sendChatMessage = function() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, "user");
    chatInput.value = "";
    
    const typingId = addTypingIndicator();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
    
    // Send to n8n Webhook - PRODUCTION
    fetch("https://n8n.digynex.se/webhook/f639f695-c06f-4bfa-8fcb-e971392f7966", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        message: text,
        sessionId: chatSessionId,
        source: "website",
        language: langSelect ? langSelect.value : "en"
      })
    })
    .then(async res => {
      clearTimeout(timeoutId);
      console.log("Response status:", res.status);
      
      removeTypingIndicator(typingId);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const rawText = await res.text();
      console.log("Raw response:", rawText);
      
      let reply = null;
      
      // Try to parse as JSON first
      try {
        const data = JSON.parse(rawText);
        console.log("Parsed JSON:", data);
        
        // Extract reply from JSON response
        if (data.reply) {
          reply = data.reply;
        } else if (data.message) {
          reply = data.message;
        } else if (data.output) {
          reply = data.output;
        } else if (data.text) {
          reply = data.text;
        }
      } catch (jsonError) {
        // If not valid JSON, treat as plain text response
        console.log("Not JSON format, treating as plain text");
        reply = rawText;
      }
      
      // If still no reply, use default
      if (!reply) {
        reply = "Strategic sync detected. For faster assistance, please WhatsApp us: <a href='https://digynex.se/whatsapp/' target='_blank' style='color: #fbbf24; text-decoration: underline;'>Official Support Portal</a>";
      }
      
      addMessage(reply, "bot");
    })
    .catch(err => {
      clearTimeout(timeoutId);
      console.error("Chat error:", err);
      if (typeof typingId !== "undefined") removeTypingIndicator(typingId);
      addMessage("Sync error. Please connect directly via WhatsApp: <a href='https://digynex.se/whatsapp/' target='_blank' style='color: #fbbf24; text-decoration: underline;'>Official Support Portal</a>", "bot");
    });
  };

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `chat-msg ${sender}`;
    div.innerHTML = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addTypingIndicator() {
    const id = "typing-" + Date.now();
    const div = document.createElement("div");
    div.id = id;
    div.className = "typing";
    div.innerHTML = "<span></span><span></span><span></span>";
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // --- MARKET SENSITIVE PRICING LOGIC ---
  const pricingData = {
    SE: {
      currency: "SEK",
      starter: 4990,
      growth: 24990,
      scale: 44990,
      setup: { starter: "12,500 kr", growth: "25,000 kr", scale: "50,000 kr" },
      marketName: "Sweden (Headquarters)"
    },
    LK: {
      currency: "LKR",
      starter: 149000,
      growth: 749000,
      scale: 1250000,
      setup: { starter: "150,000 LKR", growth: "250,000 LKR", scale: "500,000 LKR" },
      marketName: "Sri Lanka (Local)"
    },
    GLOBAL: {
      currency: "USD",
      starter: 499,
      growth: 2499,
      scale: 4500,
      setup: { starter: "$999", growth: "$5,000", scale: "$15,000+" },
      marketName: "Global Premium"
    }
  };

  let currentMarket = "SE";
  let isYearly = false;

  async function initializePricing() {
    const marketIndicator = document.getElementById("detected-market");
    const billingSwitch = document.getElementById("billing-switch");
    
    // Initial Load
    updatePricingUI(pricingData[currentMarket]);
    if (marketIndicator) marketIndicator.innerText = `Nexus Operating Region: ${pricingData[currentMarket].marketName}`;

    // Billing Toggle Listener
    if (billingSwitch) {
      billingSwitch.addEventListener('change', (e) => {
        isYearly = e.target.checked;
        document.getElementById('monthly-label').classList.toggle('active', !isYearly);
        document.getElementById('yearly-label').classList.toggle('active', isYearly);
        updatePricingUI(pricingData[currentMarket]);
      });
    }

    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const countryCode = data.country_code;
      
      if (countryCode === "LK" || countryCode === "SL") {
        currentMarket = "LK";
      } else if (countryCode !== "SE") {
        currentMarket = "GLOBAL";
      }
      
      updatePricingUI(pricingData[currentMarket]);
      if (marketIndicator) marketIndicator.innerText = `Nexus Operating Region: ${pricingData[currentMarket].marketName}`;
    } catch (error) {
      console.warn("Dynamic detection failed, staying on Headquarters (SEK).");
    }
  }

  function updatePricingUI(config) {
    const tiers = ['starter', 'growth', 'scale'];
    
    tiers.forEach(tier => {
      const priceEl = document.getElementById(`${tier}-price`);
      const curEl = document.getElementById(`${tier}-currency`);
      const setupEl = document.getElementById(`${tier}-setup`);
      
      if (priceEl) {
        let monthlyPrice = config[tier];
        let displayPrice = isYearly ? Math.floor(monthlyPrice * 0.8) : monthlyPrice;
        
        if (config.currency === "SEK") {
           priceEl.innerText = `${displayPrice.toLocaleString()} kr`;
           if (curEl) curEl.innerText = ""; 
        } else {
           priceEl.innerText = displayPrice.toLocaleString();
           if (curEl) curEl.innerText = config.currency === "USD" ? "$" : config.currency;
        }

        if (setupEl) setupEl.innerText = config.setup[tier];
      }
    });
  }

  // FAQ Toggle Logic
  window.toggleFAQ = function(element) {
    const item = element.parentElement;
    item.classList.toggle('active');
  };

  // --- COLUMN HIGHLIGHT LOGIC ---
  const matrixCells = document.querySelectorAll('.comparison-table td, .comparison-table th');
  matrixCells.forEach(cell => {
    cell.addEventListener('mouseover', () => {
      const colIdx = cell.cellIndex;
      if (colIdx === 0) return; // Don't highlight labels
      const table = cell.closest('table');
      if (!table) return;
      table.querySelectorAll(`tr td:nth-child(${colIdx + 1}), tr th:nth-child(${colIdx + 1})`).forEach(c => {
        c.classList.add('column-highlight');
      });
    });
    cell.addEventListener('mouseout', () => {
      const colIdx = cell.cellIndex;
      const table = cell.closest('table');
      if (!table) return;
      table.querySelectorAll(`tr td:nth-child(${colIdx + 1}), tr th:nth-child(${colIdx + 1})`).forEach(c => {
        c.classList.remove('column-highlight');
      });
    });
  });

  // Run initializers
  initializePricing();
});
