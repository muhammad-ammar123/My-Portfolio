const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const backToTop = document.querySelector(".back-to-top");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☼" : "◐";
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#101a28" : "#edf3f9";
}

let savedTheme;
try {
  savedTheme = localStorage.getItem("ammar-portfolio-theme");
} catch (error) {
  console.warn("Theme preference could not be loaded from local storage.", error);
}
setTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("ammar-portfolio-theme", nextTheme);
  } catch (error) {
    console.warn("Theme preference could not be saved to local storage.", error);
  }
});

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("open", !isOpen);
});

navItems.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

const sections = document.querySelectorAll("main section[id]");
const observerOptions = { rootMargin: "-35% 0px -55% 0px", threshold: 0 };

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, observerOptions);
  sections.forEach((section) => sectionObserver.observe(section));
} else {
  console.warn("Section highlighting is unavailable because IntersectionObserver is not supported.");
}

function updateScrollState() {
  const scrolled = window.scrollY > 16;
  header.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("visible", window.scrollY > 500);
}
window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const emptyFilterMessage = document.querySelector(".project-filter-empty");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    projectCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category.split(" ").includes(filter);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    emptyFilterMessage.hidden = visibleCount > 0;
  });
});

const typedRole = document.querySelector("#typed-role");
const roles = ["Aspiring Software Developer", "Front-End Developer", "Aspiring AI Engineer"];
let roleIndex = 0;
let characterIndex = 0;
let deleting = false;
typedRole.textContent = "";

function typeNextRole() {
  const phrase = roles[roleIndex];
  characterIndex += deleting ? -1 : 1;
  typedRole.textContent = phrase.slice(0, characterIndex);

  if (!deleting && characterIndex === phrase.length) {
    deleting = true;
    window.setTimeout(typeNextRole, 1800);
    return;
  }

  if (deleting && characterIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  window.setTimeout(typeNextRole, deleting ? 45 : 75);
}

if (!reducedMotion) {
  window.setTimeout(typeNextRole, 250);
} else {
  typedRole.textContent = roles[0];
}
