// ==========================================================================
// LIVE PREVIEW TEMPLATES — content shown in the "Try it" mock-up.
// The big image block shows the first letter of the business name.
// ==========================================================================
const TEMPLATES = {
  restaurant: {
    menu: ["Menu", "Reservations", "About", "Contact"],
    title: "Fresh food, made with love",
    desc: "Seasonal dishes, local ingredients and a table waiting for you every evening.",
    cta: "Book a table",
    cards: [
      { title: "Our menu", text: "Browse dishes, prices and daily specials." },
      { title: "Online booking", text: "Reserve a table in a few clicks." },
      { title: "Find us", text: "Map, opening hours and directions." },
    ],
  },
  business: {
    menu: ["Services", "About", "Clients", "Contact"],
    title: "We help businesses grow",
    desc: "Professional services tailored to your goals, from strategy to results.",
    cta: "Get a free quote",
    cards: [
      { title: "Our services", text: "Clear packages for every stage of your business." },
      { title: "Our clients", text: "Case studies and testimonials." },
      { title: "Contact form", text: "Leads go straight to your inbox." },
    ],
  },
  shop: {
    menu: ["Shop", "Categories", "Sale", "Cart"],
    title: "Quality products, delivered",
    desc: "Shop our latest collection with secure checkout and fast delivery.",
    cta: "Shop now",
    cards: [
      { title: "Fast delivery", text: "Order tracking for every purchase." },
      { title: "Secure payments", text: "Cards, PayPal and more." },
      { title: "Easy returns", text: "30-day returns, no questions asked." },
    ],
  },
  travel: {
    menu: ["Tours", "Destinations", "Offers", "Contact"],
    title: "Your next trip starts here",
    desc: "Handpicked tours and holiday packages, booked online in minutes.",
    cta: "See the tours",
    cards: [
      { title: "Holiday packages", text: "Flights, hotels and transfers together." },
      { title: "Destinations", text: "Guides for every place we visit." },
      { title: "Reviews", text: "What our travellers say." },
    ],
  },
  personal: {
    menu: ["Blog", "About", "Portfolio", "Newsletter"],
    title: "Stories, ideas and notes",
    desc: "A personal space to share your work, writing and everything in between.",
    cta: "Read the blog",
    cards: [
      { title: "Latest posts", text: "New articles, easy to publish." },
      { title: "Portfolio", text: "Show your best work." },
      { title: "Newsletter", text: "Grow your audience by email." },
    ],
  },
};

const CONTACT_EMAIL = "acesula1@gmail.com";

// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ---------- Live preview ----------
const preview = {
  name: "",
  type: "restaurant",
  color: "#2340C8",
  theme: "light",
  device: "desktop",
};

function slugify(text) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 30) || "yourbusiness"
  );
}

function renderPreview() {
  const mock = $("#mock");
  if (!mock) return;

  const t = TEMPLATES[preview.type];
  const name = preview.name.trim() || "Your Business";

  mock.style.setProperty("--demo-accent", preview.color);
  mock.dataset.theme = preview.theme;
  mock.classList.toggle("is-mobile", preview.device === "mobile");

  $("#mock-url").textContent = `${slugify(preview.name)}.com`;
  $("#mock-brand").textContent = name;
  $("#mock-footer-name").textContent = name;
  $("#mock-title").textContent = t.title;
  $("#mock-desc").textContent = t.desc;
  $("#mock-cta").textContent = t.cta;
  $("#mock-art").textContent = name.charAt(0).toUpperCase();

  const menu = $("#mock-menu");
  menu.innerHTML = "";
  t.menu.forEach((item) => menu.appendChild(el("li", "", item)));

  const cards = $("#mock-cards");
  cards.innerHTML = "";
  t.cards.forEach((c) => {
    const card = el("div", "mock-card");
    card.append(el("h4", "", c.title), el("p", "", c.text));
    cards.appendChild(card);
  });

  // Pre-filled email so visitors can request the site they just designed
  const typeLabel = $("#pv-type").selectedOptions[0].textContent;
  const subject = `Website for ${name}`;
  const body =
    `Hi Adi,\n\nI'd like a website like the one I previewed on your portfolio:\n\n` +
    `- Business name: ${name}\n- Type: ${typeLabel}\n- Brand colour: ${preview.color}\n` +
    `- Theme: ${preview.theme}\n\nA bit about my business:\n`;
  $("#pv-cta").href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function setupSegmented(groupId, key) {
  const group = $(groupId);
  if (!group) return;
  group.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]");
    if (!btn) return;
    $$("button", group).forEach((b) => b.classList.toggle("is-active", b === btn));
    preview[key] = btn.dataset.value;
    key === "theme" ? swapPreview() : renderPreview();
  });
}

// Fade the mock out, swap its content, fade it back in
let swapTimer;
function swapPreview() {
  const site = $("#mock-site");
  site.classList.add("is-swapping");
  clearTimeout(swapTimer);
  swapTimer = setTimeout(() => {
    renderPreview();
    site.classList.remove("is-swapping");
  }, 200);
}

function setupPreview() {
  if (!$("#mock")) return;

  $("#pv-name").addEventListener("input", (e) => {
    preview.name = e.target.value;
    renderPreview();
  });
  $("#pv-type").addEventListener("change", (e) => {
    preview.type = e.target.value;
    swapPreview();
  });
  $("#pv-colors").addEventListener("click", (e) => {
    const sw = e.target.closest(".swatch");
    if (!sw) return;
    $$(".swatch").forEach((s) => s.classList.toggle("is-active", s === sw));
    preview.color = sw.dataset.color;
    renderPreview();
  });
  setupSegmented("#pv-theme", "theme");
  setupSegmented("#pv-device", "device");

  renderPreview();
}

// ---------- Mobile nav toggle ----------
const navToggle = $(".nav-toggle");
const navLinks = $("#nav-links");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});
$$("a", navLinks).forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// ---------- Highlight the nav link of the section in view ----------
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$("a", navLinks).forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" } // "current" = section crossing the middle of the screen
);
$$("main section[id]").forEach((s) => sectionObserver.observe(s));

// ---------- Footer year ----------
$$(".js-year").forEach((n) => (n.textContent = new Date().getFullYear()));

// ---------- Hero headline: wrap each word so it can slide up on load ----------
function splitHeadline() {
  const title = $("#hero-title");
  if (!title) return;
  const words = title.textContent.trim().split(/\s+/);
  title.setAttribute("aria-label", words.join(" "));
  title.textContent = "";
  words.forEach((word, i) => {
    const outer = el("span", "w");
    outer.setAttribute("aria-hidden", "true");
    const inner = el("span", "", word);
    inner.style.setProperty("--i", i);
    outer.appendChild(inner);
    title.append(outer, i < words.length - 1 ? " " : "");
  });
}

// ---------- Fade sections in as they scroll into view ----------
function setupReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((n) => n.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((n) => observer.observe(n));

  // Safety net: at the bottom of the page, show anything still hidden
  const revealRest = () => {
    if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
    items.forEach((n) => n.classList.add("in"));
    window.removeEventListener("scroll", revealRest);
  };
  window.addEventListener("scroll", revealRest, { passive: true });
}

// ---------- Start ----------
splitHeadline();
setupPreview();
setupReveal();
