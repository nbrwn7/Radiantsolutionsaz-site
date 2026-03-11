# Radiant Window Solutions — CMS Setup Guide
## Edit your website from any browser, no code required

---

## What you have

```
radiant-site/
├── index.html          ← Your website
├── cms-inject.js       ← Pulls data from _data/ into the page
├── netlify.toml        ← Netlify config
├── admin/
│   ├── index.html      ← CMS editor interface (go to /admin)
│   └── config.yml      ← Defines all editable fields
└── _data/
    ├── settings.yml    ← Business name, phone, email, address
    ├── hero.yml        ← Hero headline, subtext, buttons, stats
    ├── testimonials.yml← Customer reviews
    └── (more auto-created as you edit in the CMS)
```

---

## One-Time Setup (20 minutes total)

### Step 1 — Push to GitHub (5 min)

The CMS saves edits back to your files via GitHub. You need a free account.

1. Go to github.com → create free account
2. Click **New Repository** → name it `radiant-site` → Public → Create
3. On your computer, open Terminal (Mac) or Command Prompt (Windows):

```bash
cd ~/Desktop/radiant-site    # or wherever your folder is
git init
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOURUSERNAME/radiant-site.git
git push -u origin main
```

### Step 2 — Deploy to Netlify from GitHub (5 min)

1. Go to netlify.com → Log in → **Add new site → Import from Git**
2. Choose **GitHub** → select `radiant-site`
3. Build settings: leave everything blank (no build command needed)
4. Click **Deploy site**
5. Your site is live at a `.netlify.app` URL within 60 seconds

### Step 3 — Enable Netlify Identity (for CMS login) (3 min)

1. In Netlify dashboard → your site → **Identity** tab
2. Click **Enable Identity**
3. Under **Registration** → change to **Invite only** (so only you can log in)
4. Under **External providers** → optionally add Google login
5. Scroll down to **Git Gateway** → click **Enable Git Gateway**
6. Go to **Identity** → **Invite users** → enter your email → Send invite
7. Check your email → click the invite link → set your password

### Step 4 — Access the CMS

Go to: `https://your-site.netlify.app/admin`

Log in with the credentials you just set up.

You'll see a clean dashboard with sections:
- ⚙️ Site Settings
- 🏠 Hero Section
- ✅ Trust Strip
- ⚡ Problem Cards
- 🧮 Calculator Section
- 📋 Lead Form
- 🏆 Why Us Cards
- 📋 How It Works Steps
- ⭐ Testimonials
- 🎯 Final CTA Section

---

## How to Edit (30 seconds per change)

1. Go to `yoursite.com/admin`
2. Click the section you want to edit (e.g., **⭐ Testimonials**)
3. Make your changes in the form fields
4. Click **Save** (top right)
5. Netlify automatically redeploys — your site updates in ~15 seconds

**That's it.** No FTP, no code, no re-uploading files.

---

## Most Common Edits

### Add your phone number
Settings → Business Info → Phone Number → Save

### Add your ROC license number
Settings → Business Info → ROC License Number → Save

### Add a new testimonial
Testimonials → Reviews → Add Item → fill in quote, name, city, savings badge → Save

### Update the hero headline
Hero Section → Headline Line 1/2/3 → Save

### Change a button label
Hero Section → Primary Button Text → Save

### Add your GoHighLevel webhook
Lead Form → GoHighLevel Webhook URL → paste URL → Save
(This makes form submissions go directly into your GHL pipeline)

---

## Connect Your Custom Domain

In Netlify → Domain Settings → Add custom domain → enter `radiantsolutionsaz.com`
Then update your DNS at Cloudflare/Namecheap/Northwest to point to Netlify.
(Full DNS instructions in the hosting guide)

---

## Bookmark This URL

Save `yoursite.netlify.app/admin` to your phone's home screen.
You can make copy changes from your phone between customer visits.
