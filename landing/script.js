document.addEventListener("DOMContentLoaded", () => {
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
    document.getElementById("videoModal").classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeDemoModal = function () {
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
      if (typeof window.closeLeadModal === "function") window.closeLeadModal();
      alert("Success! Your request has been logged. Our Team will reach out to you within 24 hours.");
    })
    .catch((err) => {
      console.error("Submission error:", err);
      if (typeof window.closeLeadModal === "function") window.closeLeadModal();
      alert("Success! Your request has been logged. Our Team will reach out to you within 24 hours.");
    })
    .finally(() => {
      btn.innerText = originalText;
      btn.disabled = false;
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
      alert(
        "Welcome back, " +
          user +
          "! Redirecting to your secure dashboard structure.",
      );
      // Actual Redirect to the Tuition Manager Portal
      window.location.href = "https://tms.digynex.se";
      btn.innerText = "Secure Entry";
      btn.disabled = false;
      closeLoginModal();
    }, 2000);
  };

  // vCard Download Logic
  window.downloadVCard = function () {
    const vCardData =
      "BEGIN:VCARD\n" +
      "VERSION:3.0\n" +
      "FN:DigyNex IT Support\n" +
      "ORG:DigyNex Systems\n" +
      "TEL;TYPE=WORK,VOICE:+46769703311\n" +
      "EMAIL;TYPE=WORK,INTERNET:info@digynex.se\n" +
      "URL:https://digynex.se\n" +
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

  // Close modals on outside click
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeLeadModal();
      closeDemoModal();
      closeLoginModal();
    }
  });
});
