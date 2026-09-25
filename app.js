const fallback=[{"date":"2026-09-26","time":"14:00","cat":"U18","comp":"1. liga U18","home":"SK Prosek Praha B","away":"INLAB SK Meteor Praha","place":"SH SK Prosek","address":"Lovosická 559/32, Praha 9"},{"date":"2026-10-03","time":"10:00","cat":"U18","comp":"Extraliga U18","home":"VK Lvi Praha","away":"SK Prosek Praha","place":"Sportovní hala Lužiny","address":""},{"date":"2026-10-03","time":"14:00","cat":"U18","comp":"Extraliga U18","home":"VK Ostrava","away":"SK Prosek Praha","place":"Ostrava","address":""},{"date":"2026-10-04","time":"09:00","cat":"U18","comp":"Extraliga U18","home":"SK Prosek Praha","away":"VK Dukla Liberec","place":"Praha","address":""},{"date":"2026-10-04","time":"13:00","cat":"U18","comp":"Extraliga U18","home":"VK Jirkov","away":"SK Prosek Praha","place":"Jirkov","address":""},{"date":"2026-10-10","time":"10:00","cat":"U20","comp":"Extraliga U20","home":"VK Brno","away":"SK Prosek Praha","place":"Brno","address":""},{"date":"2026-10-10","time":"14:00","cat":"U20","comp":"Extraliga U20","home":"SK Volejbal Klatovy","away":"SK Prosek Praha","place":"Klatovy","address":""},{"date":"2026-10-11","time":"09:00","cat":"U20","comp":"Extraliga U20","home":"SK Prosek Praha","away":"Kladno volejbal cz","place":"Sportovní gymnázium Ludvíka Daňka","address":""},{"date":"2026-10-11","time":"13:00","cat":"U20","comp":"Extraliga U20","home":"AERO Odolena Voda","away":"SK Prosek Praha","place":"Odolena Voda","address":""},{"date":"2026-10-17","time":"12:00","cat":"U22","comp":"Extraliga U22","home":"VK Ostrava","away":"SK Prosek Praha","place":"Ostrava","address":""},{"date":"2026-10-17","time":"18:00","cat":"U22","comp":"Extraliga U22","home":"SK Volejbal Kolín","away":"SK Prosek Praha","place":"Kolín","address":""},{"date":"2026-10-18","time":"11:00","cat":"U22","comp":"Extraliga U22","home":"SK Prosek Praha","away":"TJ Slavia Hradec Králové","place":"Praha","address":""},{"date":"2026-10-03","time":"10:00","cat":"Muži","comp":"2. liga muži","home":"SK Prosek Praha","away":"VK Benátky nad Jizerou B","place":"SH SK Prosek","address":"Lovosická 559/32, Praha 9"},{"date":"2026-10-03","time":"14:00","cat":"Muži","comp":"2. liga muži","home":"SK Prosek Praha","away":"VK Benátky nad Jizerou B","place":"SH SK Prosek","address":"Lovosická 559/32, Praha 9"},{"date":"2026-10-10","time":"11:00","cat":"Muži","comp":"2. liga muži","home":"Falcons Modřany","away":"SK Prosek Praha","place":"Praha 4","address":""},{"date":"2026-10-10","time":"15:00","cat":"Muži","comp":"2. liga muži","home":"Falcons Modřany","away":"SK Prosek Praha","place":"Praha 4","address":""},{"date":"2026-10-17","time":"10:00","cat":"Muži","comp":"2. liga muži","home":"SK Prosek Praha","away":"USK Slavia Plzeň","place":"SH SK Prosek","address":"Lovosická 559/32, Praha 9"}];

let matches=[];
let current=new Date();
let cat="Vše";

const months=["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];
const pad=n=>String(n).padStart(2,"0");
const key=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const parseDate=s=>new Date(`${s}T12:00:00`);

function setUpdated(text){
  const el=document.getElementById("updated");
  if(el) el.textContent=text;
}

async function loadData(){
  try{
    const r=await fetch(`data.json?${Date.now()}`,{cache:"no-store"});
    if(!r.ok) throw new Error("HTTP "+r.status);
    const data=await r.json();
    if(!Array.isArray(data)) throw new Error("Neplatný formát dat");
    matches=data;
    setUpdated("Aktualizováno z dat.json");
  }catch(e){
    matches=fallback;
    setUpdated("Použita záložní data");
  }
  render();
}

function shown(){
  return matches.filter(m=>cat==="Vše"||m.cat===cat);
}

function render(){
  document.getElementById("month").textContent=`${months[current.getMonth()]} ${current.getFullYear()}`;

  const g=document.getElementById("calendar");
  g.innerHTML="";

  const first=new Date(current.getFullYear(),current.getMonth(),1);
  const last=new Date(current.getFullYear(),current.getMonth()+1,0);
  const start=(first.getDay()+6)%7;

  for(let i=0;i<start;i++) g.insertAdjacentHTML("beforeend",'<div class="day muted" aria-hidden="true"></div>');

  for(let d=1;d<=last.getDate();d++){
    const dt=new Date(current.getFullYear(),current.getMonth(),d);
    const k=key(dt);
    const events=shown().filter(m=>m.date===k);
    const dots=events.slice(0,2).map(e=>`<span class="event-dot">${esc(e.time)} ${esc(e.cat)}</span>`).join("");
    g.insertAdjacentHTML("beforeend",`<div class="day ${k===key(new Date())?"today":""}">${d}${dots}</div>`);
  }
  renderEvents();
}

function renderEvents(){
  const monthKey=`${current.getFullYear()}-${pad(current.getMonth()+1)}`;
  const list=shown()
    .filter(m=>String(m.date).startsWith(monthKey))
    .sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));

  document.getElementById("events").innerHTML=list.length
    ? list.map(m=>{
        const i=matches.indexOf(m);
        return `<article class="event" role="button" tabindex="0" data-index="${i}">
          <div class="event-top">
            <span>${esc(new Intl.DateTimeFormat("cs-CZ",{weekday:"long",day:"numeric",month:"long"}).format(parseDate(m.date)))} · ${esc(m.time)}</span>
            <span class="badge">${esc(m.cat)}</span>
          </div>
          <div class="event-title">${esc(m.home)} – ${esc(m.away)}</div>
          <div class="event-meta">📍 ${esc(m.place)}</div>
        </article>`;
      }).join("")
    : '<div class="event">Žádné zápasy.</div>';

  document.querySelectorAll(".event[data-index]").forEach(el=>{
    const open=()=>openDetail(Number(el.dataset.index));
    el.addEventListener("click",open);
    el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  });
}

function openDetail(i){
  const m=matches[i];
  if(!m) return;
  history.pushState({view:"detail"},"");

  document.getElementById("detailBody").innerHTML=`
    <div class="detail-hero">
      <span class="badge">${esc(m.cat)}</span>
      <div>${esc(m.comp)}</div>
      <div>${esc(new Intl.DateTimeFormat("cs-CZ",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(parseDate(m.date)))}</div>
      <h2>${esc(m.time)}</h2>
      <div class="teams"><span>${esc(m.home)}</span><b class="versus">–</b><span>${esc(m.away)}</span></div>
    </div>
    <div class="info">
      <div class="info-row"><span>📅 Datum</span><span>${esc(m.date)}</span></div>
      <div class="info-row"><span>◷ Čas</span><span>${esc(m.time)}</span></div>
      <div class="info-row"><span>🏆 Soutěž</span><span>${esc(m.comp)}</span></div>
      <div class="info-row"><span>🏟 Hala</span><span>${esc(m.place)}</span></div>
      <div class="info-row"><span>📍 Adresa</span><span>${esc(m.address||"Dle ČVS")}</span></div>
    </div>`;

  document.getElementById("detail").classList.remove("hidden");
}

function closeDetail(){
  document.getElementById("detail").classList.add("hidden");
  if(history.state?.view==="detail") history.back();
}

document.getElementById("close").onclick=closeDetail;

function showPage(id,push=true){
  document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.page===id));
  document.getElementById("app").classList.toggle("hidden",id!=="calendarPage");
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  if(id!=="calendarPage") document.getElementById(id).classList.remove("hidden");
  if(push) history.pushState({view:id},"");
}

document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>showPage("calendarPage"));

document.getElementById("prev").onclick=()=>{
  current=new Date(current.getFullYear(),current.getMonth()-1,1);
  render();
};
document.getElementById("next").onclick=()=>{
  current=new Date(current.getFullYear(),current.getMonth()+1,1);
  render();
};
document.getElementById("today").onclick=()=>{
  current=new Date();
  render();
};
document.getElementById("refresh").onclick=loadData;

document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  cat=b.dataset.cat;
  render();
});

document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>showPage(t.dataset.page));

window.addEventListener("popstate",()=>{
  document.getElementById("detail").classList.add("hidden");
  showPage("calendarPage",false);
});

document.getElementById("addTraining").onclick=()=>{
  alert("Přidání tréninku zatím není aktivní.");
};

loadData();

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("sw.js").catch(()=>{});
  });
}
