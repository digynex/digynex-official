// Performance Optimized Cursor Logic
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth trailing effect
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    cursorOutline.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

    // Parallax shards logic
    const shards = document.querySelectorAll(".shard");
    shards.forEach((shard, index) => {
        const speed = (index + 1) * 0.05;
        const x = (window.innerWidth / 2 - mouseX) * speed;
        const y = (window.innerHeight / 2 - mouseY) * speed;
        shard.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${index * 45}deg)`;
    });

    requestAnimationFrame(animateCursor);
}

// Start animation loop
requestAnimationFrame(animateCursor);

// Magnetic elements & Hover states
const interactiveElements = document.querySelectorAll("a, button, .glass, .project-card");
interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
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
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

setTimeout(type, 1000);

// Reveal Logic
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Form Submission
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const btn = contactForm.querySelector("button");
        const originalText = btn.innerText;
        
        const formData = {
            name: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            phone: contactForm.querySelector('input[type="tel"]').value,
            message: contactForm.querySelector('textarea').value,
            source: "Portfolio_Contact"
        };

        btn.innerText = "Transmitting...";
        btn.disabled = true;

        try {
            const webhookUrl = "https://n8n.digynex.se/webhook/portfolio-lead";
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                btn.innerText = "Success ✓";
                contactForm.reset();
            } else {
                throw new Error("Conflict");
            }
        } catch (error) {
            btn.innerText = "Error! Retry";
        } finally {
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            }, 3000);
        }
    });
}
