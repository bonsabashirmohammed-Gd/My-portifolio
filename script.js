// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAbkB-WWnYWOYwXX-odpcrzePWG5JvwQpM",
  authDomain: "my-portifolio-55e03.firebaseapp.com",
  projectId: "my-portifolio-55e03",
  storageBucket: "my-portifolio-55e03.firebasestorage.app",
  messagingSenderId: "112722864148",
  appId: "1:112722864148:web:1dc743a7007c33eefd5f01"
};

let db = null;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch (e) {
  console.warn("Firebase not configured yet. Contact form will show a demo message.");
}

// ============================================================
// TYPING ANIMATION
// ============================================================
const typingEl = document.getElementById("typingText");
const typingWords = ["Web Apps", "Mobile Apps", "REST APIs", "scalable solutions", "Firebase Apps"];
let wordIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop() {
  const word = typingWords[wordIndex];
  typingEl.textContent = isDeleting ? word.slice(0, charIndex--) : word.slice(0, charIndex++);
  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === word.length + 1) { delay = 1800; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % typingWords.length; delay = 400; }
  setTimeout(typeLoop, delay);
}
typeLoop();

// ============================================================
// FLOATING ACTION BUTTONS (FAB)
// ============================================================
const fabWrap    = document.getElementById("fabWrap");
const fabMainBtn = document.getElementById("fabMainBtn");

fabMainBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fabWrap.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!fabWrap.contains(e.target)) fabWrap.classList.remove("open");
});

// ============================================================
// SCROLL TO TOP
// ============================================================
const scrollTopBtn = document.getElementById("scrollTop");
scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ============================================================
// THEME TOGGLE
// ============================================================
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeToggle.querySelector("i").className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// ============================================================
// NAVBAR — scroll shadow + active link + scroll-to-top visibility
// ============================================================
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);

  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - navbar.offsetHeight - 60)
      current = sec.getAttribute("id");
  });
  navLinks.forEach(link =>
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`)
  );
});

// ============================================================
// HAMBURGER MENU — Side Drawer
// ============================================================
const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerClose = document.getElementById("drawerClose");
const drawerLinks = document.querySelectorAll(".drawer-link");
const drawerCta = document.getElementById("drawerCta");

function openDrawer() {
  drawer.classList.add("open");
  drawerOverlay.classList.add("active");
  hamburger.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("active");
  hamburger.classList.remove("open");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  drawer.classList.contains("open") ? closeDrawer() : openDrawer();
});

drawerClose.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

drawerLinks.forEach(link => link.addEventListener("click", closeDrawer));
if (drawerCta) drawerCta.addEventListener("click", closeDrawer);

// ============================================================
// SCROLL REVEAL ANIMATION
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll(".reveal");
      let delay = 0;
      siblings.forEach((el, idx) => { if (el === entry.target) delay = idx * 80; });
      setTimeout(() => entry.target.classList.add("visible"), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ============================================================
// SKILL BAR ANIMATION
// ============================================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".skill-fill").forEach(bar => {
        bar.style.width = bar.dataset.width + "%";
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById("skills");
if (skillsSection) skillObserver.observe(skillsSection);

// ============================================================
// CONTACT FORM — Validation + Firebase
// ============================================================
const form       = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn  = document.getElementById("submitBtn");
const btnText    = document.getElementById("btnText");
const btnIcon    = document.getElementById("btnIcon");

const fields = {
  name:    { el: document.getElementById("name"),    err: document.getElementById("nameError"),    validate: v => v.trim().length >= 2 ? "" : "Name must be at least 2 characters." },
  email:   { el: document.getElementById("email"),   err: document.getElementById("emailError"),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address." },
  message: { el: document.getElementById("message"), err: document.getElementById("messageError"), validate: v => v.trim().length >= 10 ? "" : "Message must be at least 10 characters." }
};

Object.values(fields).forEach(({ el, err, validate }) => {
  el.addEventListener("blur", () => { const m = validate(el.value); err.textContent = m; el.classList.toggle("invalid", !!m); });
  el.addEventListener("input", () => { if (el.classList.contains("invalid")) { const m = validate(el.value); err.textContent = m; el.classList.toggle("invalid", !!m); } });
});

function validateAll() {
  let valid = true;
  Object.values(fields).forEach(({ el, err, validate }) => {
    const m = validate(el.value); err.textContent = m; el.classList.toggle("invalid", !!m);
    if (m) valid = false;
  });
  return valid;
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.textContent = loading ? "Sending..." : "Send Message";
  btnIcon.className = loading ? "fas fa-spinner fa-spin" : "fas fa-paper-plane";
}

function showStatus(type, message) {
  formStatus.className = `form-status ${type}`;
  formStatus.textContent = message;
  setTimeout(() => { formStatus.className = "form-status"; formStatus.textContent = ""; }, 5000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateAll()) return;
  setLoading(true);
  const payload = {
    name: fields.name.el.value.trim(),
    email: fields.email.el.value.trim(),
    message: fields.message.el.value.trim(),
    timestamp: new Date().toISOString()
  };
  try {
    if (db) await db.collection("contacts").add(payload);
    else await new Promise(r => setTimeout(r, 1200));
    showStatus("success", "Message sent! I'll get back to you within 24 hours.");
    form.reset();
    Object.values(fields).forEach(({ el }) => el.classList.remove("invalid"));
  } catch (err) {
    console.error("Firestore error:", err);
    showStatus("error", "Something went wrong. Please try again or email me directly.");
  } finally {
    setLoading(false);
  }
});
