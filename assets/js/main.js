
(function(){
  const root=document.documentElement;
  const mq=window.matchMedia('(prefers-color-scheme: dark)');
  function apply(mode){
    const actual=mode==='auto'?(mq.matches?'dark':'light'):mode;
    root.setAttribute('data-theme',actual);
    root.dataset.mode=mode;
    document.querySelectorAll('[data-theme-option]').forEach(b=>b.classList.toggle('active',b.dataset.themeOption===mode));
  }
  let saved=localStorage.getItem('aa-theme')||'auto';
  apply(saved);
  if(mq.addEventListener){mq.addEventListener('change',()=>{if((localStorage.getItem('aa-theme')||'auto')==='auto') apply('auto')});}

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-theme-option]');
    if(b){localStorage.setItem('aa-theme',b.dataset.themeOption); apply(b.dataset.themeOption);}
    const h=e.target.closest('[data-menu]');
    if(h){document.querySelector('.mobile-drawer')?.classList.toggle('open');}
  });

  const revealEls=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show'); io.unobserve(e.target);}}),{threshold:.08,rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(el=>io.observe(el));
  }else{
    revealEls.forEach(el=>el.classList.add('show'));
  }

  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
      card.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
    },{passive:true});
  });

  const cf=document.getElementById('contactForm');
  if(cf){
    cf.addEventListener('submit',async function(e){
      e.preventDefault();
      const status=document.getElementById('contactStatus');
      const btn=cf.querySelector('button[type="submit"]');
      if(status){status.className='form-status';status.textContent='';}
      if(btn){btn.disabled=true;btn.textContent='Αποστολή...';}
      try{
        const endpoint=cf.getAttribute('action')||'https://formsubmit.co/ajax/info@aanthopoulos.gr';
        const response=await fetch(endpoint,{method:'POST',body:new FormData(cf),headers:{'Accept':'application/json'}});
        if(!response.ok) throw new Error('send failed');
        cf.reset();
        if(status){status.className='form-status ok';status.textContent='Το μήνυμά σας στάλθηκε με επιτυχία. Θα επικοινωνήσω μαζί σας το συντομότερο.';}
      }catch(err){
        console.error(err);
        if(status){status.className='form-status err';status.textContent='Δεν ήταν δυνατή η αποστολή αυτή τη στιγμή. Στείλτε μήνυμα στο info@aanthopoulos.gr.';}
      }finally{
        if(btn){btn.disabled=false;btn.textContent='Αποστολή μηνύματος';}
      }
    });
  }

  const newsContent=document.getElementById('pressNewsContent');
  const cookiesChoice=()=>localStorage.getItem('aa-cookie-consent')||'';
  const relPrefix=()=> (location.pathname.includes('/articles/') || location.pathname.includes('/videos/v/')) ? '../' : '';
  if(newsContent){
    const feedUrl='https://news.google.com/rss/search?q=%22%CE%91%CF%80%CF%8C%CF%83%CF%84%CE%BF%CE%BB%CE%BF%CF%82+%CE%91%CE%BD%CE%B8%CF%8C%CF%80%CE%BF%CF%85%CE%BB%CE%BF%CF%82%22+OR+%22%CE%91%CE%BD%CE%B8%CF%8C%CF%80%CE%BF%CF%85%CE%BB%CE%BF%CF%82+%CE%B9%CE%B1%CF%84%CF%81%CF%8C%CF%82%22+OR+%22%CE%91%CF%80%CF%8C%CF%83%CF%84%CE%BF%CE%BB%CE%BF%CF%82+%CE%91%CE%BD%CE%B8%CF%8C%CF%80%CE%BF%CF%85%CE%BB%CE%BF%CF%82+%CF%80%CE%BF%CE%BB%CE%B9%CF%84%CE%B9%CE%BA%CF%8C%CF%82%22&hl=el&gl=GR&ceid=GR:el';
    const rss2JsonUrl='https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent(feedUrl);
    const cacheKey='aa-press-news-v16';
    const maxAge=1000*60*30;
    function esc(str){return String(str||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
    function cleanTitle(title){return String(title||'').replace(/\s+-\s+Google News$/i,'').trim();}
    function sourceFromTitle(title){const parts=String(title||'').split(' - ');return parts.length>1?parts[parts.length-1].trim():'';}
    function titleWithoutSource(title){const parts=String(title||'').split(' - ');return parts.length>1?parts.slice(0,-1).join(' - ').trim():String(title||'').trim();}
    function fmtDate(t){try{return new Intl.DateTimeFormat('el-GR',{day:'numeric',month:'short',year:'numeric'}).format(new Date(t));}catch(e){return 'Google News';}}
    function normalize(items){const seen=new Set();return (items||[]).map(item=>{const full=cleanTitle(item.title);const time=Date.parse(item.pubDate||item.published||item.date||'')||0;return {title:titleWithoutSource(full),source:sourceFromTitle(full),time,link:item.link||'#'};}).filter(item=>item.title&&item.link&&!seen.has(item.title.toLowerCase())&&seen.add(item.title.toLowerCase())).sort((a,b)=>b.time-a.time).slice(0,4);}
    function renderPress(items){if(!items||!items.length){newsContent.innerHTML='<a class="press-card press-fallback" href="https://news.google.com/search?q=%22%CE%91%CF%80%CF%8C%CF%83%CF%84%CE%BF%CE%BB%CE%BF%CF%82%20%CE%91%CE%BD%CE%B8%CF%8C%CF%80%CE%BF%CF%85%CE%BB%CE%BF%CF%82%22&hl=el&gl=GR&ceid=GR%3Ael" target="_blank" rel="noopener"><span class="press-title">Τελευταίες αναφορές στον Τύπο</span><span class="press-meta">Google News · live</span></a>';return;}newsContent.innerHTML=items.map(item=>`<a class="press-card" href="${esc(item.link)}" target="_blank" rel="noopener"><span class="press-title">${esc(item.title)}</span><span class="press-meta">${esc(item.source||'Τύπος')} · ${esc(fmtDate(item.time))}</span></a>`).join('');}
    function showConsentFallback(){newsContent.innerHTML='<a class="press-card press-fallback" href="'+relPrefix()+'cookies.html"><span class="press-title">Τελευταίες αναφορές στον Τύπο</span><span class="press-meta">Ενεργοποιούνται μετά την αποδοχή εξωτερικών υπηρεσιών</span></a>';}
    try{const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');if(cached&&cached.ts&&Date.now()-cached.ts<maxAge&&cached.items){renderPress(cached.items);}else{renderPress(null);}}catch(e){renderPress(null);}
    async function updateNewsWidget(){if(cookiesChoice()==='rejected'){showConsentFallback();return;}try{const response=await fetch(rss2JsonUrl,{cache:'no-store'});if(!response.ok)throw new Error('RSS HTTP '+response.status);const data=await response.json();const items=normalize(data.items||[]);if(items.length){localStorage.setItem(cacheKey,JSON.stringify({ts:Date.now(),items}));renderPress(items);}}catch(error){console.error('Error fetching RSS feed:',error);if(!newsContent.querySelector('.press-card'))renderPress(null);}}
    setTimeout(updateNewsWidget,400);
    window.addEventListener('aa-cookie-consent-change',updateNewsWidget);
  }

  function injectCookieBanner(){
    if(localStorage.getItem('aa-cookie-consent')) return;
    const banner=document.createElement('div');
    banner.className='cookie-banner show';
    banner.setAttribute('role','dialog');
    banner.setAttribute('aria-label','Επιλογές cookies');
    banner.innerHTML='<div class="cookie-copy"><b>Cookies & εξωτερικές υπηρεσίες</b>Χρησιμοποιούμε τα απολύτως απαραίτητα για τη λειτουργία της σελίδας και, με αποδοχή, εξωτερικές υπηρεσίες όπως Google News/YouTube για περιεχόμενο και αναφορές Τύπου.</div><div class="cookie-actions"><a href="'+relPrefix()+'cookies.html">Πολιτική cookies</a><button class="reject" type="button" data-cookie-reject>Απόρριψη</button><button class="accept" type="button" data-cookie-accept>Αποδοχή</button></div>';
    document.body.appendChild(banner);
    banner.addEventListener('click',e=>{if(e.target.closest('[data-cookie-accept]')){localStorage.setItem('aa-cookie-consent','accepted');banner.remove();window.dispatchEvent(new Event('aa-cookie-consent-change'));}if(e.target.closest('[data-cookie-reject]')){localStorage.setItem('aa-cookie-consent','rejected');banner.remove();window.dispatchEvent(new Event('aa-cookie-consent-change'));}});
  }
  injectCookieBanner();


  // Subtle iOS-style liquid glass tilt for the hero portrait.
  document.querySelectorAll('[data-tilt]').forEach(el=>{
    const update=e=>{
      const r=el.getBoundingClientRect();
      const x=((e.clientX||0)-r.left)/r.width;
      const y=((e.clientY||0)-r.top)/r.height;
      const cx=Math.max(0,Math.min(1,x));
      const cy=Math.max(0,Math.min(1,y));
      el.style.setProperty('--px',(cx*100).toFixed(1)+'%');
      el.style.setProperty('--py',(cy*100).toFixed(1)+'%');
      if(window.matchMedia('(pointer:fine)').matches){
        el.style.setProperty('--ry',((cx-.5)*7).toFixed(2)+'deg');
        el.style.setProperty('--rx',((.5-cy)*5).toFixed(2)+'deg');
      }
    };
    el.addEventListener('pointermove',update,{passive:true});
    el.addEventListener('pointerleave',()=>{
      el.style.setProperty('--rx','0deg');
      el.style.setProperty('--ry','0deg');
      el.style.setProperty('--px','50%');
      el.style.setProperty('--py','50%');
    },{passive:true});
  });

})();