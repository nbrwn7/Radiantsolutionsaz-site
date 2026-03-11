/**
 * Radiant Window Solutions — CMS Data Injector
 * Reads _data/*.yml files and injects content into the page.
 * Runs on every page load. No build step required.
 */

// Minimal YAML parser for simple key: value and lists
function parseYAML(text) {
  const result = {};
  const lines = text.split('\n');
  let currentKey = null;
  let currentList = null;
  let currentListItem = null;
  let inMultilineString = false;
  let multilineKey = null;
  let multilineParent = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.length - line.trimStart().length;

    // Top-level key: value
    if (indent === 0) {
      currentListItem = null;
      const m = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
      const listStart = line.match(/^(\w+):\s*$/);

      if (listStart) {
        currentKey = listStart[1];
        currentList = [];
        result[currentKey] = currentList;
      } else if (m) {
        currentKey = m[1];
        currentList = null;
        result[currentKey] = m[2].replace(/^["']|["']$/g, '');
      }
    }

    // List item (- )
    else if (indent === 2 && line.trim().startsWith('- ')) {
      const val = line.trim().slice(2).replace(/^["']|["']$/g, '');
      if (currentList !== null) {
        // Check if it's a simple value or start of object
        if (val.includes(':')) {
          // object with first key inline: "- key: value"
          currentListItem = {};
          currentList.push(currentListItem);
          const parts = val.match(/^(\w+):\s*"?(.+?)"?\s*$/);
          if (parts) currentListItem[parts[1]] = parts[2].replace(/^["']|["']$/g, '');
        } else if (val) {
          currentList.push(val);
          currentListItem = null;
        } else {
          currentListItem = {};
          currentList.push(currentListItem);
        }
      }
    }

    // Nested key inside list item
    else if (indent === 4 && currentListItem !== null) {
      const m = line.match(/^\s+(\w+):\s*"?(.+?)"?\s*$/);
      if (m) {
        currentListItem[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  }

  return result;
}

async function loadYAML(path) {
  try {
    const r = await fetch(path + '?v=' + Date.now());
    if (!r.ok) return null;
    return parseYAML(await r.text());
  } catch (e) {
    return null;
  }
}

function set(selector, text) {
  const el = document.querySelector(selector);
  if (el && text) el.textContent = text;
}

function setHTML(selector, html) {
  const el = document.querySelector(selector);
  if (el && html) el.innerHTML = html;
}

function setAttr(selector, attr, val) {
  const el = document.querySelector(selector);
  if (el && val) el.setAttribute(attr, val);
}

async function injectCMSData() {
  // ── SETTINGS ──
  const settings = await loadYAML('/_data/settings.yml');
  if (settings) {
    set('.nav-name', settings.business_name);
    set('.service-area', settings.service_area);
    set('.footer-business', `© 2026 ${settings.business_name}`);
    set('.footer-address', settings.footer_address);
    set('.footer-roc', `AZ ROC #${settings.roc_number}`);
    document.querySelectorAll('.phone-number').forEach(el => {
      el.textContent = settings.phone;
      el.href = 'tel:' + settings.phone.replace(/\D/g,'');
    });
    document.querySelectorAll('.email-address').forEach(el => {
      el.textContent = settings.email;
    });
  }

  // ── HERO ──
  const hero = await loadYAML('/_data/hero.yml');
  if (hero) {
    set('.urgency-text', hero.urgency_text);
    set('#h1-line1', hero.h1_line1);
    set('#h1-line2', hero.h1_line2);
    set('#h1-line3', hero.h1_line3);
    set('.hero-sub-text', hero.subheadline);
    set('.proof-text-inner', hero.proof_text);
    set('.btn-cta', hero.btn_primary);
    set('.btn-soft', hero.btn_secondary);
    set('.hero-disclaimer', hero.disclaimer);

    if (hero.stats && Array.isArray(hero.stats)) {
      const nums = document.querySelectorAll('.stat-num');
      const lbls = document.querySelectorAll('.stat-lbl');
      hero.stats.forEach((s, i) => {
        if (nums[i]) nums[i].textContent = s.num;
        if (lbls[i]) lbls[i].textContent = s.lbl;
      });
    }
  }

  // ── TESTIMONIALS ──
  const tdata = await loadYAML('/_data/testimonials.yml');
  if (tdata && tdata.reviews) {
    const cards = document.querySelectorAll('.tcard');
    tdata.reviews.forEach((r, i) => {
      if (!cards[i]) return;
      const q = cards[i].querySelector('.tcard-quote');
      const n = cards[i].querySelector('.tcard-name');
      const c = cards[i].querySelector('.tcard-city');
      const b = cards[i].querySelector('.tcard-badge');
      if (q) q.textContent = '\u201c' + r.quote + '\u201d';
      if (n) n.textContent = r.name;
      if (c) c.textContent = r.city;
      if (b) b.textContent = r.savings;
    });
  }

  // ── FORM ──
  const form = await loadYAML('/_data/form.yml');
  if (form) {
    set('.form-headline', form.headline);
    set('.form-subtext', form.subtext);
    set('.fsubmit', form.button);
    set('.form-trust', form.trust_line);
    set('.fsuccess-title', form.success_title);
    set('.fsuccess-body', form.success_body);
    // Inject GHL webhook if set
    if (form.ghl_webhook) {
      window.GHL_WEBHOOK = form.ghl_webhook;
    }
  }

  // ── FINAL CTA ──
  const cta = await loadYAML('/_data/cta.yml');
  if (cta) {
    set('.scarcity-txt', cta.scarcity);
    set('.final-title', cta.title);
    set('.final-sub', cta.subtext);
    set('.final-cta-note-text', cta.phone_note);
  }
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectCMSData);
} else {
  injectCMSData();
}
