// Custom Cursor Logic
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", function(e) {
    const posX = e.clientX;
    const posY = e.clientY;

    // Direct tracking for the dot
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorDot.style.transform = `translate(-50%, -50%)`;

    // Smoothed tracking for the outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
    cursorOutline.style.transform = `translate(-50%, -50%)`;

    // Parallax shards
    const shards = document.querySelectorAll(".shard");
    shards.forEach((shard, index) => {
        const speed = (index + 1) * 20;
        const x = (window.innerWidth - posX * speed) / 100;
        const y = (window.innerHeight - posY * speed) / 100;
        shard.style.transform = `translate(${x}px, ${y}px) rotate(${index * 45}deg)`;
    });
});

// Cursor active states
const interactiveElements = document.querySelectorAll("a, button, .glass, .bento-item, .project-card");
interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
});

// Magnetic Buttons
const magneticBtns = document.querySelectorAll(".btn-primary, .btn-secondary");
magneticBtns.forEach(btn => {
    btn.addEventListener("mousemove", function(e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener("mouseleave", function() {
        btn.style.transform = `translate(0px, 0px)`;
    });
});

// Typewriter Effect
const typewriterElement = document.getElementById("typewriter");
const phrases = [
    "ACTIVE_ARCHITECT",
    "CYBER SECURITY & NETWORK ADMIN",
    "MBA (LONDON MET)",
    "C&G TELECOMMUNICATIONS",
    "ATI MORATUWA (ELECTRONIC SPL)",
    "DIGYNEX FOUNDER"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Start Typewriter
setTimeout(type, 1000);

// Modern Reveal Logic using IntersectionObserver
const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            // Optional: stop observing once revealed
            // observer.unobserve(entry.target);
        }
    });
}, revealOptions);

document.querySelectorAll(".reveal").forEach(el => {
    revealObserver.observe(el);
});

// Smooth Scroll for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cursor active states refinement - REMOVED DUPLICATE

// Navbar Glass Effect on Scroll
window.addEventListener("scroll", function() {
    const nav = document.querySelector(".glass-nav");
    if (window.scrollY > 50) {
        nav.style.padding = "0.5rem 1.5rem";
        nav.style.background = "rgba(17, 24, 39, 0.8)";
    } else {
        nav.style.padding = "0.75rem 2rem";
        nav.style.background = "rgba(17, 24, 39, 0.6)";
    }
});

// Form Submission to n8n Webhook
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const btn = contactForm.querySelector("button");
        const originalText = btn.innerText;
        
        // Capture data
        const formData = {
            name: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            phone: contactForm.querySelector('input[type="tel"]').value,
            message: contactForm.querySelector('textarea').value,
            source: "Portfolio_Contact"
        };

        btn.innerText = "Transmitting Signal...";
        btn.disabled = true;

        try {
            // Placeholder URL - This would be your direct n8n webhook
            const webhookUrl = "https://n8n.digynex.se/webhook/portfolio-lead";
            
            // Note: In local development, this may hit CORS unless configured in n8n
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                btn.innerText = "Signal Received ✓";
                btn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                contactForm.reset();
            } else {
                throw new Error("Network Conflict");
            }
        } catch (error) {
            console.error("Transmision Failure:", error);
            btn.innerText = "Signal Conflict! Retry";
            btn.style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
        } finally {
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.background = ""; // Revert to CSS default
            }, 3000);
        }
    });
}

// WhatsApp Strategy Tracking
const waWidget = document.querySelector(".whatsapp-widget");
if (waWidget) {
    waWidget.addEventListener("click", () => {
        // Track event for Facebook Pixel / Google Analytics
        console.log("Strategic Signal: WhatsApp Portal Engaged.");
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', { content_name: 'WhatsApp Strategy Chat' });
        }
    });
}
