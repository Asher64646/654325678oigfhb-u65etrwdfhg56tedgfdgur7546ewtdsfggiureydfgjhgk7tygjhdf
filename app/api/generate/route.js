import { NextResponse } from "next/server";

function esc(s = "") {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function pageDoc({ title, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title>
<style>
  :root{
    --bg:#050008; --card:rgba(0,0,0,.55);
    --p1:#a855f7; --p2:#c084fc; --text:#f5f3ff; --muted:rgba(245,243,255,.75);
    --border:rgba(192,132,252,.25);
  }
  *{box-sizing:border-box}
  body{
    margin:0; color:var(--text); font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;
    background:
      radial-gradient(circle at 20% 20%, rgba(168,85,247,0.28), transparent 40%),
      radial-gradient(circle at 80% 30%, rgba(192,132,252,0.22), transparent 45%),
      radial-gradient(circle at 50% 80%, rgba(139,92,246,0.26), transparent 50%),
      linear-gradient(135deg, #000 0%, #14001f 45%, #000 100%);
    min-height:100vh;
  }
  .wrap{max-width:980px; margin:0 auto; padding:28px;}
  .nav{
    display:flex; justify-content:space-between; align-items:center; gap:12px;
    padding:14px 16px; border:1px solid var(--border); border-radius:16px;
    background:var(--card); backdrop-filter: blur(10px);
  }
  .brand{display:flex; align-items:center; gap:10px; font-weight:800;}
  .pill{padding:6px 10px; border-radius:999px; border:1px solid var(--border); background:rgba(0,0,0,.35); color:var(--muted); font-size:12px;}
  .hero{
    margin-top:18px; border:1px solid var(--border); border-radius:20px;
    background:var(--card); padding:22px;
  }
  h1{margin:0; font-size:34px; letter-spacing:.2px;}
  p{color:var(--muted); line-height:1.6}
  .grid{display:grid; grid-template-columns:1fr; gap:12px; margin-top:14px;}
  @media(min-width:820px){ .grid{grid-template-columns:repeat(3,1fr);} }
  .card{
    border:1px solid var(--border); border-radius:16px; background:rgba(0,0,0,.35); padding:14px;
  }
  .btn{
    display:inline-block; margin-top:10px;
    padding:10px 14px; border-radius:12px;
    border:1px solid rgba(192,132,252,.45);
    background:rgba(168,85,247,.6);
    color:var(--text); text-decoration:none; font-weight:700;
  }
  .btn:hover{background:rgba(168,85,247,.8);}
  .footer{margin-top:18px; color:rgba(245,243,255,.6); font-size:12px;}
</style>
</head>
<body>
  <div class="wrap">
    <div class="nav">
      <div class="brand">Asher AI <span class="pill">generated</span></div>
      <div class="pill">${esc(title)}</div>
    </div>
    ${body}
    <div class="footer">Built by Asher AI · Galaxy theme · Static HTML</div>
  </div>
</body>
</html>`;
}

function buildSite(briefRaw = "") {
  const brief = briefRaw.trim() || "A clean, professional website with clear sections and a strong call-to-action.";
  const b = esc(brief);

  const homeBody = `
  <div class="hero">
    <h1>Your website, professionally built.</h1>
    <p>${b}</p>
    <a class="btn" href="#contact">Get started</a>
    <div class="grid">
      <div class="card"><b>Professional layout</b><p>Clean sections, spacing, and hierarchy that feel premium.</p></div>
      <div class="card"><b>Mobile responsive</b><p>Looks great on phones, tablets, and desktops.</p></div>
      <div class="card"><b>Conversion focused</b><p>Calls-to-action and trust blocks included.</p></div>
    </div>
  </div>
  `;

  const aboutBody = `
  <div class="hero">
    <h1>About</h1>
    <p><b>Overview:</b> ${b}</p>
    <div class="grid">
      <div class="card"><b>Mission</b><p>Deliver a high-quality experience that builds trust and drives action.</p></div>
      <div class="card"><b>Values</b><p>Clarity, speed, craftsmanship, and long-term reliability.</p></div>
      <div class="card"><b>Story</b><p>Designed to look like a real brand from day one — not a template.</p></div>
    </div>
  </div>
  `;

  const servicesBody = `
  <div class="hero">
    <h1>Services</h1>
    <p>Based on your brief, here are structured offerings you can present professionally:</p>
    <div class="grid">
      <div class="card"><b>Core Service</b><p>What you do best — clearly explained with outcomes.</p></div>
      <div class="card"><b>Premium Option</b><p>More value, faster delivery, or expanded scope.</p></div>
      <div class="card"><b>Support</b><p>Ongoing help, updates, and improvement cycles.</p></div>
    </div>
    <a class="btn" href="#contact">Request a quote</a>
  </div>
  `;

  const contactBody = `
  <div class="hero" id="contact">
    <h1>Contact</h1>
    <p>Use this section to capture leads. (This is static HTML for now.)</p>
    <div class="card">
      <p><b>Email:</b> hello@yourdomain.com</p>
      <p><b>Location:</b> Your City</p>
      <p><b>Note:</b> Add a real form handler later (Formspark, Formspree, etc.).</p>
    </div>
  </div>
  `;

  return {
    title: "Asher AI Site",
    pages: [
      { path: "/", title: "Home", html: pageDoc({ title: "Home", body: homeBody }) },
      { path: "/about", title: "About", html: pageDoc({ title: "About", body: aboutBody }) },
      { path: "/services", title: "Services", html: pageDoc({ title: "Services", body: servicesBody }) },
      { path: "/contact", title: "Contact", html: pageDoc({ title: "Contact", body: contactBody }) },
    ],
  };
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const brief = body?.brief ?? body?.description ?? "";
  const manifest = buildSite(brief);
  return NextResponse.json(manifest);
}
