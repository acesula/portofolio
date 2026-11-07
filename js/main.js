// ==========================================================================
// HERO REQUEST DEMO — example requests that walk through a Laravel app.
// stages: [name, detail, ms]. body is shown as the JSON response.
// ==========================================================================
const REQUESTS = [
  {
    method: "GET",
    path: "/api/bookings?date=today",
    status: "200 OK",
    stages: [
      ["Route", "routes/api.php", 1],
      ["Middleware", "auth:sanctum, tenant", 3],
      ["Controller", "BookingController@index", 2],
      ["Eloquent", "Booking::today()->with('client')", 5],
      ["MySQL", "2 queries", 8],
    ],
    body: {
      data: [
        { id: 1042, client: "Grand Hotel", time: "10:30", status: "confirmed" },
        { id: 1043, client: "City Studio", time: "14:00", status: "pending" },
      ],
      meta: { total: 2 },
    },
  },
  {
    method: "POST",
    path: "/api/orders",
    status: "201 Created",
    stages: [
      ["Route", "routes/api.php", 1],
      ["Middleware", "auth:sanctum, throttle:60", 2],
      ["Validation", "StoreOrderRequest", 3],
      ["Controller", "OrderController@store", 2],
      ["MySQL", "insert into orders", 6],
      ["Event", "OrderPlaced, mail queued", 2],
    ],
    body: {
      id: 8812,
      items: 3,
      total: "42.50 EUR",
      status: "pending",
      paid: false,
    },
  },
  {
    method: "POST",
    path: "/api/shelf-labels/sync",
    status: "202 Accepted",
    stages: [
      ["Route", "routes/api.php", 1],
      ["Middleware", "auth:sanctum, tenant", 3],
      ["Controller", "LabelSyncController", 2],
      ["Queue", "dispatch(new SyncShelfLabels)", 4],
    ],
    body: {
      store: "Main Street",
      labels_queued: 1840,
      job: "sync-shelf-labels",
      eta_seconds: 40,
    },
  },
];

// ==========================================================================
// LIVE PREVIEW TEMPLATES — content of the mock website.
// {name} is replaced with the visitor's business name.
// ==========================================================================
const TEMPLATES = {
  restaurant: {
    menu: ["Menu", "Reservations", "About", "Contact"],
    navCta: "Book a table",
    title: "Fresh food, made with love",
    desc: "Seasonal dishes, local ingredients and a table waiting for you every evening.",
    cta: "Book a table",
    cta2: "See the menu",
    facts: [["Open every day", "12:00 to 23:00"], ["Book online", "Confirmed in a minute"], ["Private dinners", "Up to 40 guests"]],
    cardsTitle: "Why people come back",
    cards: [
      ["Our menu", "Browse dishes, prices and daily specials."],
      ["Online booking", "Reserve a table in a few clicks."],
      ["Find us", "Map, opening hours and directions."],
    ],
    quote: ["The best dinner we had all summer. We booked again for the next weekend.", "Anna, a guest at {name}"],
    band: "Hungry? Your table at {name} is ready.",
  },
  business: {
    menu: ["Services", "About", "Clients", "Contact"],
    navCta: "Get a quote",
    title: "We help businesses grow",
    desc: "Professional services tailored to your goals, from strategy to results.",
    cta: "Get a free quote",
    cta2: "Our services",
    facts: [["Free first call", "30 minutes, no strings"], ["Clear pricing", "Fixed packages"], ["Local team", "Based in your city"]],
    cardsTitle: "What we do",
    cards: [
      ["Our services", "Clear packages for every stage of your business."],
      ["Our clients", "Case studies and testimonials."],
      ["Contact form", "Leads go straight to your inbox."],
    ],
    quote: ["{name} understood what we needed after one meeting.", "David, a client of {name}"],
    band: "Let's talk about your next step.",
  },
  shop: {
    menu: ["Shop", "Categories", "Sale", "Cart"],
    navCta: "Cart (0)",
    title: "Quality products, delivered",
    desc: "Shop our latest collection with secure checkout and fast delivery.",
    cta: "Shop now",
    cta2: "New arrivals",
    facts: [["Fast delivery", "1 to 3 working days"], ["Secure checkout", "Cards and PayPal"], ["Easy returns", "Within 30 days"]],
    cardsTitle: "Shop by category",
    cards: [
      ["New in", "The latest products, added every week."],
      ["Best sellers", "What other customers love most."],
      ["Gift cards", "Let them choose for themselves."],
    ],
    quote: ["Ordered on Monday, it arrived on Wednesday. Exactly as in the photos.", "Sarah, a customer of {name}"],
    band: "Free delivery on your first order at {name}.",
  },
  travel: {
    menu: ["Tours", "Destinations", "Offers", "Contact"],
    navCta: "Book a trip",
    title: "Your next trip starts here",
    desc: "Handpicked tours and holiday packages, booked online in minutes.",
    cta: "See the tours",
    cta2: "Special offers",
    facts: [["Small groups", "Up to 12 people"], ["Local guides", "Who know every corner"], ["Flexible dates", "Change for free"]],
    cardsTitle: "Popular trips",
    cards: [
      ["Holiday packages", "Flights, hotels and transfers together."],
      ["Day tours", "Mountains, beaches and old towns."],
      ["Reviews", "What our travellers say."],
    ],
    quote: ["Everything was organised, so we just enjoyed the trip.", "Tom, travelled with {name}"],
    band: "Plan your next trip with {name}.",
  },
  personal: {
    menu: ["Blog", "About", "Portfolio", "Newsletter"],
    navCta: "Subscribe",
    title: "Stories, ideas and notes",
    desc: "A personal space to share your work, writing and everything in between.",
    cta: "Read the blog",
    cta2: "About me",
    facts: [["New posts", "Every week"], ["Newsletter", "Once a month"], ["Portfolio", "Selected work"]],
    cardsTitle: "Latest posts",
    cards: [
      ["Getting started", "Why I finally started writing."],
      ["Behind the work", "How a recent project came together."],
      ["Reading list", "Books that changed how I think."],
    ],
    quote: ["I read every new post the day it comes out.", "A reader of {name}"],
    band: "Get new posts from {name} by email.",
  },
};

// Hero illustration for each type (fills come from the brand colour in CSS)
const ART = {
  restaurant: `<svg viewBox="0 0 200 200"><rect width="200" height="200" class="f3"/><circle cx="100" cy="104" r="70" class="f4"/><circle cx="100" cy="104" r="52" class="f2"/><circle cx="84" cy="94" r="10" class="f1"/><circle cx="114" cy="114" r="8" class="f1"/><circle cx="110" cy="86" r="5" class="f4"/><circle cx="88" cy="122" r="5" class="f4"/><rect x="14" y="40" width="9" height="124" rx="4.5" class="f1"/><rect x="177" y="40" width="9" height="124" rx="4.5" class="f1"/><path class="s1" d="M80 24 q6 8 0 16 M100 20 q6 8 0 16 M120 24 q6 8 0 16" style="stroke-width:5"/></svg>`,
  business: `<svg viewBox="0 0 200 200"><rect width="200" height="200" class="f3"/><rect x="36" y="118" width="26" height="52" rx="6" class="f2"/><rect x="74" y="92" width="26" height="78" rx="6" class="f2"/><rect x="112" y="62" width="26" height="108" rx="6" class="f1"/><path class="s1" d="M40 96 L84 66 L118 40 L160 26" style="stroke-width:6"/><circle cx="160" cy="26" r="9" class="f1"/><rect x="150" y="130" width="28" height="40" rx="6" class="f4"/></svg>`,
  shop: `<svg viewBox="0 0 200 200"><rect width="200" height="200" class="f3"/><circle cx="160" cy="44" r="22" class="f2"/><path class="s1" d="M74 74 V62 a26 26 0 0 1 52 0 V74"/><rect x="46" y="70" width="108" height="108" rx="16" class="f1"/><circle cx="100" cy="122" r="18" class="f4"/><rect x="18" y="140" width="34" height="38" rx="8" class="f2"/></svg>`,
  travel: `<svg viewBox="0 0 200 200"><rect width="200" height="200" class="f3"/><circle cx="142" cy="58" r="22" class="f2"/><path d="M0 158 L58 86 L96 130 L128 96 L200 164 V200 H0Z" class="f1"/><path d="M58 86 L72 104 L62 100 L52 108 Z" class="f4"/><path d="M0 172 Q50 160 100 172 T200 172 V200 H0Z" class="f2"/></svg>`,
  personal: `<svg viewBox="0 0 200 200"><rect width="200" height="200" class="f3"/><rect x="42" y="40" width="108" height="136" rx="12" class="f2" transform="rotate(-7 96 108)"/><rect x="54" y="30" width="108" height="136" rx="12" class="f4"/><rect x="70" y="52" width="48" height="10" rx="5" class="f1"/><rect x="70" y="74" width="76" height="6" rx="3" class="f2"/><rect x="70" y="88" width="66" height="6" rx="3" class="f2"/><rect x="70" y="102" width="72" height="6" rx="3" class="f2"/><circle cx="132" cy="140" r="14" class="f1"/></svg>`,
};

const CONTACT_EMAIL = "acesula1@gmail.com";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const wait = (ms) => new Promise((r) => setTimeout(r, reducedMotion ? 0 : ms));

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- Hero request demo ----------
// Turn a value into pretty-printed JSON lines with colour spans
function jsonLines(value) {
  const lines = [];
  const prim = (v) => {
    if (typeof v === "string") return `<span class="j-str">"${esc(v)}"</span>`;
    if (typeof v === "number") return `<span class="j-num">${v}</span>`;
    return `<span class="j-bool">${v}</span>`;
  };
  const walk = (v, depth, key, comma) => {
    const pad = "  ".repeat(depth);
    const k = key !== undefined ? `<span class="j-key">"${esc(key)}"</span>: ` : "";
    const end = comma ? "," : "";
    if (v && typeof v === "object") {
      const isArr = Array.isArray(v);
      const entries = isArr ? v.map((x) => [undefined, x]) : Object.entries(v);
      lines.push(pad + k + (isArr ? "[" : "{"));
      entries.forEach(([ck, cv], i) => walk(cv, depth + 1, ck, i < entries.length - 1));
      lines.push(pad + (isArr ? "]" : "}") + end);
    } else {
      lines.push(pad + k + prim(v) + end);
    }
  };
  walk(value, 0, undefined, false);
  return lines;
}

let reqRun = 0;
async function runRequest(index) {
  const run = ++reqRun;
  const r = REQUESTS[index];

  $$(".req-ep").forEach((b, i) => {
    b.classList.toggle("is-active", i === index);
    b.setAttribute("aria-pressed", String(i === index));
  });

  const track = $("#req-track");
  track.innerHTML = "";
  const rows = r.stages.map(([name, detail, ms]) => {
    const li = el("li");
    li.innerHTML =
      `<span class="req-dot" aria-hidden="true"></span>` +
      `<span class="req-stage">${esc(name)}<span class="req-detail">${esc(detail)}</span></span>` +
      `<span class="req-ms">${ms} ms</span>`;
    track.appendChild(li);
    return li;
  });

  const status = $("#req-status");
  const json = $("#req-json");
  status.classList.remove("show");
  json.classList.remove("show");
  json.innerHTML = "";

  for (const li of rows) {
    li.classList.add("is-current");
    await wait(320);
    if (run !== reqRun) return;
    li.classList.remove("is-current");
    li.classList.add("is-done");
  }

  const total = r.stages.reduce((sum, s) => sum + s[2], 0);
  $("#req-code").textContent = r.status;
  $("#req-time").textContent = `${total} ms`;
  json.innerHTML = jsonLines(r.body)
    .map((line, i) => `<span class="jl" style="--j:${i}">${line || " "}</span>`)
    .join("");
  status.classList.add("show");
  void json.offsetWidth; // commit the hidden state so the lines transition in
  json.classList.add("show");
}

function setupRequestDemo() {
  const box = $("#req-endpoints");
  if (!box) return;
  REQUESTS.forEach((r, i) => {
    const b = el("button", "req-ep");
    b.type = "button";
    b.dataset.method = r.method;
    b.innerHTML = `<b>${r.method}</b>${esc(r.path)}`;
    b.addEventListener("click", () => runRequest(i));
    box.appendChild(b);
  });

  // play the first request once the panel is on screen
  const panel = $(".req");
  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    setTimeout(() => runRequest(0), reducedMotion ? 0 : 900);
  }, { threshold: 0.3 });
  io.observe(panel);
}

// ---------- Live preview ----------
const preview = {
  name: "",
  type: "restaurant",
  color: "#2340C8",
  font: "modern",
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

const displayName = () => preview.name.trim() || "Your Business";

// Build the whole mock page (only when the type changes; other options are CSS)
function buildSite() {
  const t = TEMPLATES[preview.type];
  const nm = `<span data-bind="name">${esc(displayName())}</span>`;
  const fill = (s) => esc(s).replace("{name}", nm);
  let k = 0;
  const blk = () => `class="m-block" style="--k:${k++}"`;

  $("#mock-site").innerHTML = `
    <header class="m-nav">
      <span class="m-brand"><span class="m-logo" data-bind="initial"></span>${nm}</span>
      <ul class="m-menu">${t.menu.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
      <span class="m-nav-btn">${esc(t.navCta)}</span>
      <span class="m-burger" aria-hidden="true"></span>
    </header>
    <div ${blk()}>
      <div class="m-hero">
        <div>
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.desc)}</p>
          <div class="m-btns"><span class="m-btn">${esc(t.cta)}</span><span class="m-btn m-btn-ghost">${esc(t.cta2)}</span></div>
        </div>
        <div class="m-art">${ART[preview.type]}</div>
      </div>
    </div>
    <div ${blk()}>
      <div class="m-facts">${t.facts.map(([a, b]) => `<div class="m-fact"><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join("")}</div>
    </div>
    <div ${blk()}>
      <div class="m-section">
        <h4>${esc(t.cardsTitle)}</h4>
        <div class="m-cards">${t.cards.map(([a, b], i) => `<div class="m-card"><div class="m-thumb t${i}"></div><div class="m-card-body"><h5>${esc(a)}</h5><p>${esc(b)}</p></div></div>`).join("")}</div>
      </div>
    </div>
    <div ${blk()}>
      <div class="m-quote"><blockquote>${fill(t.quote[0])}</blockquote><p class="m-by">${fill(t.quote[1])}</p></div>
    </div>
    <div ${blk()}>
      <div class="m-band"><h4>${fill(t.band)}</h4><span class="m-btn">${esc(t.cta)}</span></div>
    </div>
    <footer class="m-footer"><span>&copy; ${new Date().getFullYear()} ${nm}</span><span>Privacy policy</span></footer>`;
  $("#mock-site").scrollTop = 0;
  updateName();
}

// Name, colour, theme, font and device update in place, without a rebuild
function updateName() {
  const name = displayName();
  $$('[data-bind="name"]').forEach((n) => (n.textContent = name));
  $$('[data-bind="initial"]').forEach((n) => (n.textContent = name.charAt(0).toUpperCase()));
  $("#mock-url").textContent = `${slugify(preview.name)}.com`;
  updateMailto();
}

function applyOptions() {
  const mock = $("#mock");
  mock.style.setProperty("--demo-accent", preview.color);
  mock.dataset.theme = preview.theme;
  mock.dataset.font = preview.font;
  mock.classList.toggle("is-mobile", preview.device === "mobile");
  updateMailto();
}

// Pre-filled email so visitors can request the site they just designed
function updateMailto() {
  const name = displayName();
  const typeLabel = $("#pv-type").selectedOptions[0].textContent;
  const subject = `Website for ${name}`;
  const body =
    `Hi Adi,\n\nI'd like a website like the one I previewed on your portfolio:\n\n` +
    `- Business name: ${name}\n- Type: ${typeLabel}\n- Brand colour: ${preview.color}\n` +
    `- Font style: ${preview.font}\n- Theme: ${preview.theme}\n\nA bit about my business:\n`;
  $("#pv-cta").href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// "Ask about this site": fill the contact form with the preview choices.
// Without JS the button keeps its mailto link.
function previewToForm(e) {
  const form = $("#contact-form");
  if (!form) return;
  e.preventDefault();
  const typeLabel = $("#pv-type").selectedOptions[0].textContent;
  const msg = $("#cf-message");
  msg.value =
    `I'd like a website like the one I previewed:\n` +
    `- Business name: ${displayName()}\n- Type: ${typeLabel}\n- Brand colour: ${preview.color}\n` +
    `- Font style: ${preview.font}\n- Theme: ${preview.theme}\n\nA bit about my business:\n`;
  $("#cf-type").value = "A website";
  msg.classList.add("is-filled");
  setTimeout(() => msg.classList.remove("is-filled"), 2500);
  $("#contact").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  setTimeout(() => $("#cf-name").focus({ preventScroll: true }), reducedMotion ? 0 : 600);
}

// ---------- Contact form (Web3Forms) ----------
function setupContactForm() {
  const form = $("#contact-form");
  if (!form) return;
  const status = $("#cf-status");
  const button = $("#cf-submit");
  const setStatus = (text, kind) => {
    status.textContent = text;
    status.className = `form-status ${kind ? `is-${kind}` : ""}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.botcheck.checked) return; // a bot filled the hidden field

    if (form.access_key.value === "YOUR_WEB3FORMS_ACCESS_KEY") {
      setStatus(`The form isn't connected yet. Please email ${CONTACT_EMAIL} instead.`, "error");
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    setStatus("");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Request failed");
      form.reset();
      setStatus("Message sent. I'll get back to you soon.", "ok");
    } catch {
      setStatus(`Your message didn't send. Please try again, or email ${CONTACT_EMAIL}.`, "error");
    } finally {
      button.disabled = false;
      button.textContent = "Send message";
    }
  });
}

function setupSegmented(groupId, key) {
  const group = $(groupId);
  group.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]");
    if (!btn) return;
    $$("button", group).forEach((b) => b.classList.toggle("is-active", b === btn));
    preview[key] = btn.dataset.value;
    applyOptions();
  });
}

function setupPreview() {
  if (!$("#mock")) return;

  $("#pv-name").addEventListener("input", (e) => {
    preview.name = e.target.value;
    updateName();
  });
  $("#pv-type").addEventListener("change", (e) => {
    preview.type = e.target.value;
    buildSite();
  });
  $("#pv-colors").addEventListener("click", (e) => {
    const sw = e.target.closest(".swatch");
    if (!sw) return;
    $$(".swatch").forEach((s) => s.classList.toggle("is-active", s === sw));
    preview.color = sw.dataset.color;
    applyOptions();
  });
  $("#pv-cta").addEventListener("click", previewToForm);
  setupSegmented("#pv-font", "font");
  setupSegmented("#pv-theme", "theme");
  setupSegmented("#pv-device", "device");

  applyOptions();
  // build when the studio comes into view, so the blocks animate in then
  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    buildSite();
  }, { threshold: 0.2 });
  io.observe($(".studio-stage"));
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
  { rootMargin: "-45% 0px -50% 0px" }
);
$$("main > section[id]").forEach((s) => sectionObserver.observe(s));

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

  const revealRest = () => {
    if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
    items.forEach((n) => n.classList.add("in"));
    window.removeEventListener("scroll", revealRest);
  };
  window.addEventListener("scroll", revealRest, { passive: true });
}

// ---------- Start ----------
splitHeadline();
setupRequestDemo();
setupPreview();
setupContactForm();
setupReveal();
