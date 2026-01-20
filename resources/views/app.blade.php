<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>CIVIS</title>
  <style>
    :root{
      --bg:#0a0f0d;
      --panel:#0f1612;
      --panel2:#111c16;
      --line:rgba(255,255,255,.08);
      --text:#e9f2ec;
      --muted:rgba(233,242,236,.68);
      --gold:#d9a04a;
      --gold2:#f1c27a;
      --btn:#2a3b33;
      --danger:#e11d48;
      --ok:#22c55e;
      --shadow: 0 10px 30px rgba(0,0,0,.35);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }
    *{box-sizing:border-box}
    body{margin:0;background:radial-gradient(1200px 600px at 20% 0%, rgba(217,160,74,.10), transparent 55%),
                      radial-gradient(1200px 600px at 80% 20%, rgba(34,197,94,.08), transparent 55%),
                      var(--bg);
         color:var(--text);}
    a{color:inherit;text-decoration:none}
    .wrap{min-height:100vh; display:flex;}
    .sidebar{
      width:280px; background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
      border-right:1px solid var(--line);
      padding:18px;
    }
    .brand{font-size:22px;font-weight:900;color:var(--gold); letter-spacing:.3px;}
    .userbox{margin-top:18px; padding:14px; border:1px solid var(--line); border-radius:18px; background:rgba(0,0,0,.18); box-shadow:var(--shadow);}
    .avatar{
      width:44px;height:44px;border-radius:999px; display:flex; align-items:center; justify-content:center;
      background:rgba(217,160,74,.18); border:1px solid rgba(217,160,74,.35); font-weight:800; color:var(--gold2);
    }
    .urow{display:flex; gap:12px; align-items:center;}
    .uname{font-weight:800;}
    .umail{font-size:12px;color:var(--muted)}
    .btn{
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      padding:10px 12px; border-radius:14px; border:1px solid var(--line);
      background:rgba(42,59,51,.7); color:var(--text); cursor:pointer; font-weight:700;
    }
    .btn:hover{filter:brightness(1.06)}
    .btn.danger{background:rgba(225,29,72,.16); border-color:rgba(225,29,72,.35); color:#ffd6df;}
    .btn.gold{background:rgba(217,160,74,.16); border-color:rgba(217,160,74,.35); color:var(--gold2);}
    .nav{margin-top:18px; display:flex; flex-direction:column; gap:8px;}
    .nav a{
      padding:10px 12px; border-radius:14px; border:1px solid transparent; color:var(--muted);
      display:flex; gap:10px; align-items:center;
    }
    .nav a.active{background:rgba(217,160,74,.14); border-color:rgba(217,160,74,.25); color:var(--gold2);}
    .nav a:hover{background:rgba(255,255,255,.04); color:var(--text);}
    .sideSection{margin-top:16px; padding-top:12px; border-top:1px solid var(--line);}
    .sideTitle{font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:rgba(241,194,122,.65); margin-bottom:10px;}
    .deadlineItem{
      padding:10px 10px; border:1px solid var(--line); border-radius:14px; background:rgba(0,0,0,.16);
      margin-bottom:8px;
    }
    .deadlineItem b{display:block; font-size:13px;}
    .deadlineItem span{display:block; font-size:12px; color:var(--muted); margin-top:2px;}
    .main{flex:1; padding:22px 26px;}
    .topbar{
      display:flex; align-items:center; justify-content:space-between; gap:14px;
      margin-bottom:16px;
    }
    .search{
      flex:1;
      display:flex; gap:10px; align-items:center;
      background:rgba(255,255,255,.04);
      border:1px solid var(--line);
      padding:10px 12px; border-radius:999px;
      max-width:760px;
    }
    .search input{
      flex:1; border:none; outline:none; background:transparent; color:var(--text);
      font-size:14px;
    }
    .pill{
      font-size:12px; padding:6px 10px; border-radius:999px;
      background:rgba(34,197,94,.14); border:1px solid rgba(34,197,94,.35); color:#c9f7d6;
    }
    .contentCard{
      border:1px solid var(--line); border-radius:22px; padding:18px;
      background:rgba(0,0,0,.16); box-shadow:var(--shadow);
      min-height: calc(100vh - 140px);
    }
    h1{margin:0 0 10px 0; font-size:26px; color:var(--gold2)}
    .muted{color:var(--muted)}
    /* cards grid */
    .gridCards{display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:16px;}
    @media (max-width:1100px){ .gridCards{grid-template-columns:repeat(2, minmax(0,1fr));} }
    @media (max-width:800px){
      .wrap{flex-direction:column}
      .sidebar{width:100%}
      .gridCards{grid-template-columns:1fr}
      .topbar{flex-direction:column; align-items:stretch}
      .search{max-width:none}
    }
    .vcard{
      padding:16px; border-radius:20px; border:1px solid var(--line);
      background:linear-gradient(180deg, rgba(217,160,74,.10), rgba(0,0,0,.16));
    }
    .vcard h3{margin:0; font-size:16px; color:var(--text)}
    .vcard p{margin:8px 0 0 0; color:var(--muted); font-size:13px; line-height:1.4}
    .tags{display:flex; gap:6px; flex-wrap:wrap; margin-top:10px;}
    .tag{font-size:11px; padding:5px 8px; border-radius:999px; border:1px solid rgba(217,160,74,.28); background:rgba(217,160,74,.12); color:rgba(241,194,122,.95);}
    /* list */
    .list{display:flex; flex-direction:column; gap:10px; margin-top:10px;}
    .listItem{
      padding:14px; border-radius:18px; border:1px solid var(--line);
      background:rgba(255,255,255,.03);
      display:flex; align-items:flex-start; justify-content:space-between; gap:14px;
    }
    .listItem b{display:block;}
    .status{font-size:12px; padding:6px 10px; border-radius:999px; border:1px solid var(--line);}
    .status.open{border-color:rgba(34,197,94,.35); background:rgba(34,197,94,.12); color:#c9f7d6;}
    .status.closed{border-color:rgba(225,29,72,.35); background:rgba(225,29,72,.12); color:#ffd6df;}
    /* login screen */
    .loginWrap{min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px;}
    .loginCard{
      width: min(980px, 100%);
      display:grid; grid-template-columns: 420px 1fr; gap:16px;
    }
    @media (max-width:900px){ .loginCard{grid-template-columns:1fr;} }
    .box{
      border:1px solid var(--line); border-radius:22px; padding:18px;
      background:rgba(0,0,0,.16); box-shadow:var(--shadow);
    }
    .field{display:grid; gap:10px; margin-top:12px;}
    .field input{
      padding:12px 14px; border-radius:14px; border:1px solid var(--line);
      background:rgba(255,255,255,.03); color:var(--text); outline:none;
    }
    .err{white-space:pre-wrap; margin-top:10px; padding:10px; border-radius:14px;
         background:rgba(225,29,72,.12); border:1px solid rgba(225,29,72,.35); color:#ffd6df; display:none;}
  </style>
</head>
<body>

<div id="root"></div>

<script>
const API = 'http://127.0.0.1:8000/api';
const tokenKey = 'civis_token';
const state = {
  page: 'videos',       // videos | deadlines | faqs
  query: '',
  categories: [],
  videos: [],
  faqs: [],
  deadlines: [],
  me: null,
};

function getToken(){ return localStorage.getItem(tokenKey) || ''; }
function setToken(t){ t ? localStorage.setItem(tokenKey, t) : localStorage.removeItem(tokenKey); }

async function apiFetch(path, opts={}){
  const headers = Object.assign({'Accept':'application/json'}, opts.headers || {});
  const t = getToken();
  if(t) headers['Authorization'] = 'Bearer ' + t;

  const res = await fetch(API + path, {...opts, headers});
  const txt = await res.text();
  let data = null;
  try { data = txt ? JSON.parse(txt) : null; } catch { data = txt; }

  if(!res.ok){
    throw new Error(`HTTP ${res.status}\n\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`);
  }
  return data;
}

function el(html){
  const d = document.createElement('div');
  d.innerHTML = html.trim();
  return d.firstChild;
}

function fmtDate(d){
  if(!d) return '';
  const x = new Date(d);
  if(String(x) === 'Invalid Date') return String(d);
  return x.toLocaleDateString('es-ES', {year:'numeric', month:'long', day:'numeric'});
}

function deadlineStatus(dl){
  // intentamos inferir: abierto si fecha >= hoy
  const v = dl.date || dl.due_date || dl.deadline_date || dl.limit_date || dl.ends_at || dl.starts_at;
  const dt = v ? new Date(v) : null;
  if(!dt || String(dt)==='Invalid Date') return {label:'', cls:''};
  const today = new Date(); today.setHours(0,0,0,0);
  const d0 = new Date(dt); d0.setHours(0,0,0,0);
  const open = d0 >= today;
  return open ? {label:'Plazo abierto', cls:'open'} : {label:'Plazo finalizado', cls:'closed'};
}

function getDeadlineDateField(dl){
  return dl.date || dl.due_date || dl.deadline_date || dl.limit_date || dl.ends_at || dl.starts_at || dl.created_at || '';
}

function logout(){
  // intentamos logout API, pero aunque falle, limpiamos token
  apiFetch('/logout', {method:'POST'}).catch(()=>{}).finally(()=>{
    setToken('');
    state.me = null;
    render();
  });
}

async function login(email, password){
  const data = await apiFetch('/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email, password}),
  });
  setToken(data.token);
  state.me = data.user;
}

async function loadAll(){
  // públicas
  const [cats, vids, faqs, dls] = await Promise.all([
    apiFetch('/categories'),
    apiFetch('/videos'),
    apiFetch('/faqs'),
    apiFetch('/deadlines'),
  ]);

  state.categories = cats.data || cats || [];
  state.videos = vids.data || vids || [];
  state.faqs = faqs.data || faqs || [];
  state.deadlines = dls.data || dls || [];

  // ordenar deadlines por fecha si se puede
  state.deadlines.sort((a,b)=>{
    const da = new Date(getDeadlineDateField(a));
    const db = new Date(getDeadlineDateField(b));
    if(String(da)==='Invalid Date' || String(db)==='Invalid Date') return 0;
    return da - db;
  });
}

function filterVideos(){
  const q = state.query.trim().toLowerCase();
  if(!q) return state.videos;
  return state.videos.filter(v=>{
    const t = (v.title||'').toLowerCase();
    const d = (v.description||'').toLowerCase();
    return t.includes(q) || d.includes(q);
  });
}

function currentCategorySlugFromQuery(){
  // si el usuario escribe "category:estudios" lo usamos
  const m = state.query.match(/category:([a-z0-9_-]+)/i);
  return m ? m[1].toLowerCase() : '';
}

function renderLogin(){
  const root = document.getElementById('root');
  root.innerHTML = '';
  const node = el(`
    <div class="loginWrap">
      <div class="loginCard">
        <div class="box">
          <div class="brand">Civis</div>
          <div class="muted" style="margin-top:8px;">
            Inicia sesión para entrar a la aplicación.
          </div>
          <div class="field">
            <input id="email" placeholder="Email" value="admin@civis.local"/>
            <input id="password" placeholder="Password" type="password" value="admin1234"/>
            <button class="btn gold" id="btnLogin">Entrar</button>
            <div id="err" class="err"></div>
          </div>
          <div class="muted" style="margin-top:10px;">
            Tip: si no carga nada, asegúrate de tener el servidor en <code>127.0.0.1:8000</code>.
          </div>
        </div>

        <div class="box">
          <h1 style="margin-bottom:6px;">CIVIS</h1>
          <div class="muted">
            Este front es “plano” (Blade + JS) y consume tus endpoints:
            <br><code>/api/categories</code>, <code>/api/videos</code>, <code>/api/faqs</code>, <code>/api/deadlines</code>.
          </div>
          <div class="muted" style="margin-top:14px;">
            Después del login verás:
            <ul>
              <li>Videoteca de Trámites</li>
              <li>Calendario de Plazos</li>
              <li>Preguntas Frecuentes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `);
  root.appendChild(node);

  const errBox = document.getElementById('err');
  const showErr = (msg)=>{ errBox.style.display = msg ? 'block' : 'none'; errBox.textContent = msg || ''; };

  document.getElementById('btnLogin').addEventListener('click', async ()=>{
    showErr('');
    try{
      const email = document.getElementById('email').value.trim();
      const pass  = document.getElementById('password').value;
      await login(email, pass);
      await loadAll();
      render();
    }catch(e){
      showErr(e.message);
    }
  });
}

function renderApp(){
  const root = document.getElementById('root');
  root.innerHTML = '';

  const initials = (state.me?.name || 'Usuario Demo').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();

  // plazos cercanos: 2 primeros de la lista ya ordenada
  const near = state.deadlines.slice(0, 2);

  const node = el(`
    <div class="wrap">
      <aside class="sidebar">
        <div class="brand">Civis</div>

        <div class="userbox">
          <div class="urow">
            <div class="avatar">${initials}</div>
            <div>
              <div class="uname">${escapeHtml(state.me?.name || 'Usuario Demo')}</div>
              <div class="umail">${escapeHtml(state.me?.email || '')}</div>
            </div>
          </div>
          <div style="margin-top:12px; display:flex; gap:10px;">
            <button class="btn gold" id="btnReload" style="flex:1;">Recargar</button>
            <button class="btn danger" id="btnLogout" style="flex:1;">Salir</button>
          </div>
          <div style="margin-top:10px;">
            <span class="pill">Sesión activa</span>
          </div>
        </div>

        <nav class="nav">
          <a href="#" data-page="videos" class="${state.page==='videos'?'active':''}">🏠 <span>Inicio / Feed</span></a>
          <a href="#" data-page="deadlines" class="${state.page==='deadlines'?'active':''}">📅 <span>Calendario de Plazos</span></a>
          <a href="#" data-page="faqs" class="${state.page==='faqs'?'active':''}">❓ <span>Preguntas Frecuentes</span></a>
        </nav>

        <div class="sideSection">
          <div class="sideTitle">Plazos cercanos</div>
          <div id="nearDeadlines"></div>
        </div>
      </aside>

      <main class="main">
        <div class="topbar">
          <div class="search">
            <span style="opacity:.7;">🔎</span>
            <input id="q" placeholder="Buscar trámites... (presiona Enter)" value="${escapeHtml(state.query)}" />
            <button class="btn gold" id="btnSearch" style="width:auto; border-radius:999px; padding:10px 14px;">Buscar</button>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn" id="btnMe" style="width:auto;">👤 ${escapeHtml(state.me?.name || 'Cuenta')}</button>
          </div>
        </div>

        <section class="contentCard">
          <div id="page"></div>
        </section>
      </main>
    </div>
  `);

  root.appendChild(node);

  // render plazos cercanos en sidebar
  const nearBox = document.getElementById('nearDeadlines');
  nearBox.innerHTML = near.map(dl=>{
    const title = dl.title || dl.name || dl.label || 'Plazo';
    const d = fmtDate(getDeadlineDateField(dl));
    return `
      <div class="deadlineItem">
        <b>${escapeHtml(title)}</b>
        <span>${escapeHtml(d)}</span>
      </div>
    `;
  }).join('') || `<div class="muted">Sin plazos</div>`;

  // nav clicks
  document.querySelectorAll('.nav a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      state.page = a.dataset.page;
      renderApp(); // re-render
    });
  });

  // search
  const q = document.getElementById('q');
  const doSearch = async ()=>{
    state.query = q.value;
    // si usa "category:slug" intentamos recargar videos filtrados desde API
    const slug = currentCategorySlugFromQuery();
    try{
      if(state.page === 'videos' && slug){
        const data = await apiFetch('/videos?category=' + encodeURIComponent(slug));
        state.videos = data.data || data || [];
      } else if(state.page === 'videos'){
        const data = await apiFetch('/videos');
        state.videos = data.data || data || [];
      }
    }catch(e){}
    renderApp();
  };
  document.getElementById('btnSearch').addEventListener('click', doSearch);
  q.addEventListener('keydown', (e)=>{ if(e.key==='Enter') doSearch(); });

  document.getElementById('btnReload').addEventListener('click', async ()=>{
    await loadAll();
    renderApp();
  });
  document.getElementById('btnLogout').addEventListener('click', logout);

  // render current page
  renderPage();
}

function renderPage(){
  const page = document.getElementById('page');
  if(!page) return;

  if(state.page === 'videos'){
    const cats = state.categories || [];
    const vids = filterVideos();

    page.innerHTML = `
      <h1>Videoteca de Trámites</h1>
      <div class="muted" style="margin-bottom:10px;">
        Tip: busca por texto o usa <code>category:estudios</code> / <code>category:empleo</code> / <code>category:ciudadania</code>
      </div>

      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px;">
        <span class="tag" style="border-color:rgba(255,255,255,.18); background:rgba(255,255,255,.06); color:rgba(233,242,236,.8); cursor:pointer;" data-cat="__all">Todas</span>
        ${cats.map(c=>`<span class="tag" style="cursor:pointer;" data-cat="${escapeHtml(c.slug)}">${escapeHtml(c.name)}</span>`).join('')}
      </div>

      <div class="gridCards">
        ${vids.map(v=>{
          const title = v.title || 'Sin título';
          const desc = v.description || '';
          const dur = v.duration ? `${v.duration}s` : '';
          const cat = cats.find(x=>x.id === v.category_id);
          const tag = cat ? cat.name : ('cat#'+(v.category_id||'?'));
          return `
            <div class="vcard">
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(desc)}</p>
              <div class="tags">
                <span class="tag">${escapeHtml(tag)}</span>
                ${dur ? `<span class="tag" style="border-color:rgba(34,197,94,.35); background:rgba(34,197,94,.12); color:#c9f7d6;">${escapeHtml(dur)}</span>` : ``}
                ${v.published ? `<span class="tag" style="border-color:rgba(34,197,94,.35); background:rgba(34,197,94,.12); color:#c9f7d6;">publicado</span>` : `<span class="tag" style="border-color:rgba(225,29,72,.35); background:rgba(225,29,72,.12); color:#ffd6df;">borrador</span>`}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // filtros por categoría
    page.querySelectorAll('[data-cat]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const slug = btn.dataset.cat;
        if(slug === '__all'){
          state.query = '';
          const data = await apiFetch('/videos');
          state.videos = data.data || data || [];
        }else{
          state.query = 'category:' + slug;
          const data = await apiFetch('/videos?category=' + encodeURIComponent(slug));
          state.videos = data.data || data || [];
        }
        renderApp();
      });
    });
    return;
  }

  if(state.page === 'deadlines'){
    page.innerHTML = `
      <h1>Calendario de Plazos</h1>
      <div class="muted" style="margin-bottom:10px;">
        Lista de todos los plazos del sistema.
      </div>
      <div class="list">
        ${state.deadlines.map(dl=>{
          const title = dl.title || dl.name || dl.label || 'Plazo';
          const date = fmtDate(getDeadlineDateField(dl));
          const st = deadlineStatus(dl);
          return `
            <div class="listItem">
              <div>
                <b>${escapeHtml(title)}</b>
                <div class="muted">${escapeHtml(date)}</div>
              </div>
              ${st.label ? `<div class="status ${st.cls}">${st.label}</div>` : `<div class="status">—</div>`}
            </div>
          `;
        }).join('') || `<div class="muted">Sin plazos</div>`}
      </div>
    `;
    return;
  }

  if(state.page === 'faqs'){
    page.innerHTML = `
      <h1>Preguntas Frecuentes</h1>
      <div class="list">
        ${state.faqs.map(f=>{
          return `
            <div class="listItem" style="flex-direction:column;">
              <b>${escapeHtml(f.question || '')}</b>
              <div class="muted">${escapeHtml(f.answer || '')}</div>
            </div>
          `;
        }).join('') || `<div class="muted">Sin FAQs</div>`}
      </div>
    `;
    return;
  }

  page.innerHTML = `<div class="muted">Página no encontrada</div>`;
}

function escapeHtml(s){
  return String(s ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'","&#039;");
}

async function render(){
  if(!getToken()){
    renderLogin();
    return;
  }

  // si hay token pero aún no cargamos datos, cargamos
  try{
    if(!state.me){
      // opcional: si tienes /api/me, úsalo. Si falla, seguimos.
      try{
        const me = await apiFetch('/me');
        state.me = me.user || me || null;
      }catch{
        state.me = {name:'Usuario Demo', email:'admin@civis.local'};
      }
    }
    if(!state.categories.length && !state.videos.length && !state.faqs.length && !state.deadlines.length){
      await loadAll();
    }
    renderApp();
  }catch(e){
    // si peta, volvemos a login
    setToken('');
    state.me = null;
    renderLogin();
  }
}

render();
</script>
</body>
</html>
