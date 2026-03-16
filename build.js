#!/usr/bin/env node
// Build script: reads all .md files, generates encrypted single-page HTML
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PASSWORD = '2023';
const DIR = __dirname;

// Read all markdown files in order
const mdFiles = [
  '00_INTERVIEW_GUIDE.md',
  '01_QBCC_Research.md',
  '02_Project_Stories_STAR.md',
  '03_Technical_Assessment_Prep.md',
  '04_Embellished_Projects_Note.md',
  '05_Models_and_Tech_Cheatsheet.md'
];

const sections = mdFiles.map(f => {
  const content = fs.readFileSync(path.join(DIR, f), 'utf8');
  return { file: f, content };
});

// Build the inner HTML (what gets shown after decryption)
const innerHTML = buildInnerHTML(sections);

// Encrypt
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(PASSWORD, salt, 100000, 32, 'sha256');
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(innerHTML, 'utf8');
encrypted = Buffer.concat([encrypted, cipher.final()]);
const tag = cipher.getAuthTag();

const encObj = {
  salt: salt.toString('base64'),
  iv: iv.toString('base64'),
  tag: tag.toString('base64'),
  data: encrypted.toString('base64')
};

// Build outer shell
const outerHTML = buildOuterHTML(encObj);
fs.writeFileSync(path.join(DIR, 'index.html'), outerHTML, 'utf8');
console.log('Built index.html (' + Math.round(outerHTML.length/1024) + ' KB)');

function mdToHTML(md) {
  let html = md;
  // Code blocks with language
  html = html.replace(/```(\w+)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="code-block" data-lang="${lang}"><code>${escHtml(code.trim())}</code></pre>`;
  });
  // Code blocks without language
  html = html.replace(/```\n?([\s\S]*?)```/g, (_, code) => {
    return `<pre class="code-block"><code>${escHtml(code.trim())}</code></pre>`;
  });
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (_, header, sep, body) => {
    const ths = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const tds = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    return `<div class="table-wrap"><table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });
  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // Blockquotes (multi-line)
  html = html.replace(/^(?:>\s?(.*)(?:\n|$))+/gm, (match) => {
    const text = match.replace(/^>\s?/gm, '').trim();
    return `<blockquote>${text}</blockquote>`;
  });
  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  // List items
  html = html.replace(/^(\s*)- (.+)$/gm, (_, indent, text) => {
    const depth = Math.floor(indent.length / 2);
    return `<li class="depth-${depth}">${text}</li>`;
  });
  // Numbered lists
  html = html.replace(/^\d+\.\s(.+)$/gm, '<li class="numbered">$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  // Paragraphs for remaining text
  html = html.replace(/^(?!<[huolbtdp]|<\/|<hr|<pre|<div|<ul|<li|<blockquote)(.+)$/gm, '<p>$1</p>');
  // Clean up double newlines
  html = html.replace(/\n{2,}/g, '\n');
  return html;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function buildInnerHTML(sections) {
  const navItems = sections.map((s, i) => {
    const label = s.file.replace(/^\d+_/, '').replace(/\.md$/, '').replace(/_/g, ' ');
    return `<button class="nav-btn${i===0?' active':''}" onclick="showSection(${i})">${label}</button>`;
  }).join('\n');

  const sectionDivs = sections.map((s, i) => {
    return `<div class="section${i===0?' active':''}" id="sec-${i}">${mdToHTML(s.content)}</div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QBCC Interview Prep — Mubashir Imran</title>
<style>
:root {
  --bg: #0a0e1a; --surface: #111827; --surface2: #1e293b;
  --border: #2d3748; --text: #e2e8f0; --text2: #94a3b8;
  --accent: #38bdf8; --accent2: #818cf8; --accent3: #a78bfa;
  --green: #34d399; --amber: #fbbf24; --red: #f87171;
}
* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body {
  font-family: 'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif;
  background: var(--bg); color: var(--text);
  line-height: 1.7; font-size: 15px;
  min-height: 100vh;
}

/* Top bar */
.topbar {
  position: fixed; top:0; left:0; right:0; z-index:100;
  background: rgba(10,14,26,0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0.6rem 1.5rem;
  display:flex; align-items:center; justify-content:space-between;
}
.topbar-title {
  font-size:0.95rem; font-weight:700;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
.topbar-meta { font-size:0.75rem; color:var(--text2); }
.topbar-right { display:flex; gap:0.5rem; align-items:center; }
.theme-btn {
  background:var(--surface2); border:1px solid var(--border); border-radius:8px;
  color:var(--text2); padding:0.35rem 0.7rem; font-size:0.75rem; cursor:pointer;
  transition: all 0.2s;
}
.theme-btn:hover { border-color:var(--accent); color:var(--accent); }

/* Layout */
.layout {
  display:flex; margin-top:50px; min-height:calc(100vh - 50px);
}

/* Sidebar */
.sidebar {
  width:260px; min-width:260px; background:var(--surface);
  border-right:1px solid var(--border); padding:1.2rem 0;
  position:fixed; top:50px; bottom:0; overflow-y:auto;
  transition: transform 0.3s ease;
}
.sidebar-label {
  font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em;
  color:var(--text2); padding:0.8rem 1.2rem 0.4rem; font-weight:600;
}
.nav-btn {
  display:block; width:100%; text-align:left; padding:0.65rem 1.2rem;
  background:none; border:none; color:var(--text2); font-size:0.85rem;
  cursor:pointer; transition:all 0.2s; border-left:3px solid transparent;
  font-weight:500;
}
.nav-btn:hover { background:var(--surface2); color:var(--text); }
.nav-btn.active {
  color:var(--accent); background:rgba(56,189,248,0.08);
  border-left-color:var(--accent); font-weight:600;
}

/* Main content */
.main {
  margin-left:260px; flex:1; padding:2.5rem 3rem 4rem;
  max-width:900px;
}
.section { display:none; animation: fadeUp 0.35s ease; }
.section.active { display:block; }
@keyframes fadeUp {
  from { opacity:0; transform:translateY(12px); }
  to { opacity:1; transform:translateY(0); }
}

/* Typography */
h1 {
  font-size:1.8rem; font-weight:800; margin:0 0 0.5rem;
  background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  letter-spacing:-0.02em;
}
h2 {
  font-size:1.3rem; font-weight:700; color:var(--accent);
  margin:2.2rem 0 0.8rem; padding-bottom:0.4rem;
  border-bottom:1px solid var(--border);
}
h3 {
  font-size:1.05rem; font-weight:600; color:var(--accent2);
  margin:1.5rem 0 0.6rem;
}
h4 { font-size:0.95rem; font-weight:600; color:var(--accent3); margin:1.2rem 0 0.5rem; }
p { margin:0.5rem 0; color:var(--text); }
strong { color:#fff; font-weight:600; }
em { color:var(--accent2); font-style:italic; }
hr {
  border:none; height:1px; background:var(--border);
  margin:2rem 0;
}

/* Lists */
ul { list-style:none; margin:0.5rem 0; }
li { padding:0.25rem 0 0.25rem 1.2rem; position:relative; }
li::before {
  content:''; position:absolute; left:0; top:0.65rem;
  width:6px; height:6px; border-radius:50%;
  background:var(--accent); opacity:0.7;
}
li.depth-1 { padding-left:2.4rem; }
li.depth-1::before { left:1.2rem; background:var(--accent2); width:5px; height:5px; }
li.depth-2 { padding-left:3.6rem; }
li.depth-2::before { left:2.4rem; background:var(--accent3); width:4px; height:4px; }
li.numbered { padding-left:1.5rem; }
li.numbered::before { display:none; }

/* Blockquotes */
blockquote {
  background: linear-gradient(135deg, rgba(56,189,248,0.06), rgba(129,140,248,0.06));
  border-left:3px solid var(--accent);
  border-radius:0 10px 10px 0;
  padding:1rem 1.3rem; margin:1rem 0;
  font-size:0.92rem; line-height:1.8; color:var(--text);
  white-space: pre-wrap;
}

/* Code */
pre.code-block {
  background:var(--surface); border:1px solid var(--border);
  border-radius:10px; padding:1.2rem; margin:1rem 0;
  overflow-x:auto; position:relative;
}
pre.code-block::before {
  content:attr(data-lang); position:absolute; top:0.5rem; right:0.8rem;
  font-size:0.65rem; color:var(--text2); text-transform:uppercase;
  letter-spacing:0.05em; font-weight:600;
}
pre.code-block code {
  font-family:'JetBrains Mono','Fira Code','SF Mono',monospace;
  font-size:0.82rem; line-height:1.6; color:#c9d1d9;
}
code.inline-code {
  background:var(--surface2); border:1px solid var(--border);
  border-radius:5px; padding:0.15rem 0.4rem;
  font-family:'JetBrains Mono','Fira Code',monospace;
  font-size:0.82rem; color:var(--accent);
}

/* Tables */
.table-wrap { overflow-x:auto; margin:1rem 0; border-radius:10px; border:1px solid var(--border); }
table { width:100%; border-collapse:collapse; font-size:0.85rem; }
th {
  background:var(--surface2); color:var(--accent); font-weight:600;
  text-align:left; padding:0.7rem 1rem; font-size:0.8rem;
  text-transform:uppercase; letter-spacing:0.03em;
  border-bottom:2px solid var(--border);
}
td { padding:0.6rem 1rem; border-bottom:1px solid var(--border); color:var(--text); }
tr:last-child td { border-bottom:none; }
tr:hover td { background:rgba(56,189,248,0.04); }

/* Mobile hamburger */
.hamburger {
  display:none; background:none; border:none; color:var(--text);
  font-size:1.3rem; cursor:pointer; padding:0.2rem;
}
.overlay {
  display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5);
  z-index:49;
}
.overlay.show { display:block; }

/* Search */
.search-box {
  padding:0.5rem 1.2rem;
}
.search-box input {
  width:100%; padding:0.5rem 0.8rem; border-radius:8px;
  background:var(--bg); border:1px solid var(--border);
  color:var(--text); font-size:0.8rem; outline:none;
  transition:border-color 0.2s;
}
.search-box input:focus { border-color:var(--accent); }
.search-box input::placeholder { color:var(--text2); }

/* Scroll progress */
.progress-bar {
  position:fixed; top:49px; left:0; right:0; height:2px; z-index:101;
  background:var(--border);
}
.progress-fill {
  height:100%; width:0%; transition:width 0.15s;
  background:linear-gradient(90deg, var(--accent), var(--accent2));
}

/* Light theme */
body.light {
  --bg:#f8fafc; --surface:#fff; --surface2:#f1f5f9;
  --border:#e2e8f0; --text:#1e293b; --text2:#64748b;
}
body.light strong { color:#0f172a; }
body.light pre.code-block code { color:#334155; }
body.light .topbar { background:rgba(248,250,252,0.9); }

/* Print */
@media print {
  .topbar, .sidebar, .hamburger, .overlay, .progress-bar, .search-box, .theme-btn { display:none!important; }
  .layout { display:block; }
  .main { margin-left:0; padding:1rem; max-width:100%; }
  .section { display:block!important; page-break-inside:avoid; }
  body { background:#fff; color:#000; font-size:11px; }
  h1,h2,h3 { -webkit-text-fill-color:initial; color:#1a1a1a; }
  blockquote { background:#f5f5f5; border-left-color:#333; }
}

/* Responsive */
@media (max-width:768px) {
  .hamburger { display:block; }
  .sidebar {
    transform:translateX(-100%); z-index:50;
    width:280px; min-width:auto;
  }
  .sidebar.open { transform:translateX(0); }
  .main { margin-left:0; padding:1.5rem 1.2rem 3rem; }
  h1 { font-size:1.4rem; }
  h2 { font-size:1.15rem; }
  blockquote { padding:0.8rem 1rem; font-size:0.85rem; }
}
</style>
</head>
<body>
<div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
<div class="topbar">
  <div style="display:flex;align-items:center;gap:0.8rem;">
    <button class="hamburger" id="menuBtn" onclick="toggleMenu()">&#9776;</button>
    <div>
      <div class="topbar-title">QBCC Senior Data Scientist — Interview Prep</div>
      <div class="topbar-meta">Tue 17 Mar 2026 &middot; 11:00 AM &middot; Teams</div>
    </div>
  </div>
  <div class="topbar-right">
    <button class="theme-btn" onclick="toggleTheme()">Light/Dark</button>
    <button class="theme-btn" onclick="window.print()">Print</button>
  </div>
</div>
<div class="overlay" id="overlay" onclick="toggleMenu()"></div>
<div class="layout">
  <aside class="sidebar" id="sidebar">
    <div class="search-box"><input type="text" id="searchInput" placeholder="Search content..." oninput="doSearch(this.value)"></div>
    <div class="sidebar-label">Sections</div>
    ${navItems}
  </aside>
  <main class="main" id="mainContent">
    ${sectionDivs}
    <div id="searchResults" style="display:none;" class="section active">
      <h1>Search Results</h1>
      <div id="searchResultsContent"></div>
    </div>
  </main>
</div>
<script>
function showSection(i) {
  document.getElementById('searchResults').style.display='none';
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('sec-'+i).classList.add('active');
  document.querySelectorAll('.nav-btn')[i].classList.add('active');
  document.getElementById('mainContent').scrollTop=0;
  window.scrollTo(0,50);
  if(window.innerWidth<=768) toggleMenu();
}
function toggleMenu(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function toggleTheme(){
  document.body.classList.toggle('light');
  localStorage.setItem('theme',document.body.classList.contains('light')?'light':'dark');
}
if(localStorage.getItem('theme')==='light') document.body.classList.add('light');
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  const p=h>0?(window.scrollY/h)*100:0;
  document.getElementById('progressFill').style.width=p+'%';
});
function doSearch(q){
  const results=document.getElementById('searchResults');
  const content=document.getElementById('searchResultsContent');
  if(!q||q.length<2){results.style.display='none';return;}
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  results.style.display='block';results.classList.add('active');
  const sections=document.querySelectorAll('.section:not(#searchResults)');
  let html='';let count=0;
  const re=new RegExp('('+q.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\$&')+')','gi');
  sections.forEach((sec,i)=>{
    const text=sec.textContent;
    if(text.toLowerCase().includes(q.toLowerCase())){
      const idx=text.toLowerCase().indexOf(q.toLowerCase());
      const start=Math.max(0,idx-80); const end=Math.min(text.length,idx+120);
      let snippet='...'+text.substring(start,end).replace(re,'<mark style="background:var(--accent);color:#000;border-radius:3px;padding:0 2px;">$1</mark>')+'...';
      const name=document.querySelectorAll('.nav-btn')[i].textContent;
      html+='<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:1rem;margin:0.8rem 0;cursor:pointer;" onclick="showSection('+i+')"><h3 style="margin:0 0 0.3rem;">'+name+'</h3><p style="font-size:0.85rem;color:var(--text2);">'+snippet+'</p></div>';
      count++;
    }
  });
  content.innerHTML=count?html:'<p style="color:var(--text2);margin-top:1rem;">No results found.</p>';
}
// Keyboard shortcuts
document.addEventListener('keydown',e=>{
  if(e.key==='/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
    e.preventDefault();document.getElementById('searchInput').focus();
  }
  if(e.key==='Escape'){
    document.getElementById('searchInput').value='';
    document.getElementById('searchResults').style.display='none';
  }
});
</script>
</body>
</html>`;
}

function buildOuterHTML(enc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Secure Document</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #0f172a; color: #e2e8f0;
    display:flex; align-items:center; justify-content:center;
    min-height:100vh;
  }
  .login-box {
    background:#1e293b; border:1px solid #475569;
    border-radius:16px; padding:2.5rem; width:380px; max-width:90vw;
    text-align:center; box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  }
  .login-box h1 {
    font-size:1.4rem; font-weight:800; margin-bottom:.3rem;
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .login-box p { color:#94a3b8; font-size:.85rem; margin-bottom:1.5rem; }
  .lock-icon { font-size:2.5rem; margin-bottom:1rem; }
  input {
    width:100%; padding:.75rem 1rem; border-radius:10px;
    border:1px solid #475569; background:#0f172a;
    color:#e2e8f0; font-size:1rem; outline:none;
    text-align:center; letter-spacing:.15em; font-weight:600;
    margin-bottom:1rem; transition: border-color .2s;
  }
  input:focus { border-color:#38bdf8; }
  input::placeholder { letter-spacing:normal; font-weight:400; color:#94a3b8; }
  button {
    width:100%; padding:.75rem; border:none; border-radius:10px;
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    color:#fff; font-size:.95rem; font-weight:700; cursor:pointer;
    transition: opacity .2s, transform .1s;
  }
  button:hover { opacity:.9; }
  button:active { transform:scale(.98); }
  .error {
    color:#f87171; font-size:.8rem; margin-top:.8rem;
    opacity:0; transition:opacity .3s;
  }
  .error.show { opacity:1; }
  .shake { animation: shake .4s ease; }
  @keyframes shake {
    0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)}
    40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
  }
  .spinner { display:none; margin-top:1rem; color:#94a3b8; font-size:.85rem; }
</style>
</head>
<body>
<div class="login-box" id="loginBox">
  <div class="lock-icon">&#x1f512;</div>
  <h1>Interview Prep</h1>
  <p>Enter password to access</p>
  <form onsubmit="return unlock(event)">
    <input type="password" id="pw" placeholder="Enter password" autofocus autocomplete="off">
    <button type="submit">Unlock</button>
  </form>
  <div class="error" id="err">Incorrect password</div>
  <div class="spinner" id="spin">Decrypting...</div>
</div>

<script>
const ENC = ${JSON.stringify(enc)};

async function unlock(e) {
  e.preventDefault();
  const pw = document.getElementById('pw').value;
  const err = document.getElementById('err');
  const spin = document.getElementById('spin');
  err.classList.remove('show');
  spin.style.display = 'block';

  try {
    const salt = Uint8Array.from(atob(ENC.salt), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ENC.iv), c => c.charCodeAt(0));
    const tag = Uint8Array.from(atob(ENC.tag), c => c.charCodeAt(0));
    const data = Uint8Array.from(atob(ENC.data), c => c.charCodeAt(0));

    const combined = new Uint8Array(data.length + tag.length);
    combined.set(data);
    combined.set(tag, data.length);

    const keyMaterial = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      combined
    );

    const html = new TextDecoder().decode(decrypted);
    document.open();
    document.write(html);
    document.close();
  } catch (ex) {
    spin.style.display = 'none';
    err.classList.add('show');
    document.getElementById('loginBox').classList.add('shake');
    document.getElementById('pw').value = '';
    setTimeout(() => document.getElementById('loginBox').classList.remove('shake'), 500);
  }
  return false;
}
</script>
</body>
</html>`;
}
