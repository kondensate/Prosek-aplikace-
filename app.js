let matches=[], current=new Date(2026,8,25), activeFilter="Vše";
const monthNames=["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];
const pad=n=>String(n).padStart(2,"0");
const key=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmtDate=s=>new Intl.DateTimeFormat("cs-CZ",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date(s+"T12:00:00"));
async function load(){
 try{const r=await fetch("data/matches.json?"+Date.now());matches=await r.json();document.getElementById("updated").textContent="Aktualizováno: "+new Intl.DateTimeFormat("cs-CZ",{day:"numeric",month:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date());render();}
 catch(e){document.getElementById("updated").textContent="Data se nepodařilo načíst";}}
function filtered(){return matches.filter(m=>activeFilter==="Vše"||m.category===activeFilter);}
function renderCalendar(){
 document.getElementById("monthLabel").textContent=`${monthNames[current.getMonth()]} ${current.getFullYear()}`;
 const g=document.getElementById("calendarGrid");g.innerHTML="";
 const first=new Date(current.getFullYear(),current.getMonth(),1), last=new Date(current.getFullYear(),current.getMonth()+1,0);
 const start=(first.getDay()+6)%7;
 for(let i=0;i<start;i++)g.insertAdjacentHTML("beforeend",'<div class="cell"></div>');
 for(let d=1;d<=last.getDate();d++){
  const dt=new Date(current.getFullYear(),current.getMonth(),d), k=key(dt);
  const dayMatches=filtered().filter(m=>m.date===k);
  const today=k===key(new Date())?" today":"";
  let html=`<div class="cell${today}"><span class="num">${d}</span>`;
  dayMatches.slice(0,2).forEach(m=>html+=`<span class="match-dot">${m.time} ${m.category}</span>`);
  g.insertAdjacentHTML("beforeend",html+"</div>");
 }
}
function renderList(){
 const list=document.getElementById("eventList"), month=key(current).slice(0,7);
 const arr=filtered().filter(m=>m.date.startsWith(month)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 list.innerHTML="";
 let last="";
 if(!arr.length){list.innerHTML='<div class="event-card">Žádné zápasy pro tento měsíc.</div>';return}
 arr.forEach(m=>{
  if(m.date!==last){list.insertAdjacentHTML("beforeend",`<div class="day-heading">${fmtDate(m.date)}</div>`);last=m.date}
  list.insertAdjacentHTML("beforeend",`<article class="event-card" data-id="${m.id}"><div class="event-top"><span class="badge">${m.category}</span><span>${m.time}</span></div><div class="event-title">${m.home} – ${m.away}</div><div class="meta">📍 ${m.venue||"Místo dle ČVS"}</div></article>`);
 });
 document.querySelectorAll(".event-card[data-id]").forEach(c=>c.onclick=()=>openDetail(c.dataset.id));
}
function render(){renderCalendar();renderList();}
function openDetail(id){
 const m=matches.find(x=>x.id===id);if(!m)return;
 document.getElementById("detail").innerHTML=`<div class="detail-hero"><div class="detail-head"><span class="badge">${m.category}</span><span>${m.competition}</span></div><div class="detail-date">${fmtDate(m.date)}</div><div class="detail-time">${m.time}</div><div class="teams"><div><div class="team-logo">PROSEK</div><div class="team-name">${m.home}</div></div><div class="versus">–</div><div><div class="team-logo" style="color:#1477df">METEOR</div><div class="team-name">${m.away}</div></div></div><div class="mapline">📍 ${m.venue||"Místo dle ČVS"}${m.address?`, ${m.address}`:""}</div><button class="open-match">Otevřít v mapách</button></div>
 <div class="info-card"><div class="info-row"><span>▣</span><span class="label">Datum</span><span>${new Intl.DateTimeFormat("cs-CZ").format(new Date(m.date+"T12:00:00"))}</span></div><div class="info-row"><span>◷</span><span class="label">Čas</span><span>${m.time}</span></div><div class="info-row"><span>🏆</span><span class="label">Soutěž</span><span>${m.competition}</span></div><div class="info-row"><span>♙</span><span class="label">Kolo / turnaj</span><span>${m.round||"—"}</span></div><div class="info-row"><span>⌂</span><span class="label">Hala</span><span>${m.venue||"—"}</span></div><div class="info-row"><span>📍</span><span class="label">Adresa</span><span>${m.address||"—"}</span></div></div>
 <h3 class="detail-subtitle">Další zápasy v tento den</h3>${matches.filter(x=>x.date===m.date&&x.id!==m.id).map(x=>`<div class="event-card" data-id="${x.id}"><div class="event-top"><span>${x.home} – ${x.away}</span><span>${x.time} ${x.category}</span></div></div>`).join("")}`;
 document.getElementById("calendarView").classList.add("hidden");document.getElementById("webView").classList.add("hidden");document.getElementById("settingsView").classList.add("hidden");document.getElementById("detailView").classList.remove("hidden");document.querySelectorAll(".nav").forEach(n=>n.classList.remove("active"));
 document.querySelectorAll("#detail [data-id]").forEach(c=>c.onclick=()=>openDetail(c.dataset.id));
}
function showView(id){
 document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));document.getElementById(id).classList.remove("hidden");
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.view===id));
}
document.getElementById("prevMonth").onclick=()=>{current.setMonth(current.getMonth()-1);render()};
document.getElementById("nextMonth").onclick=()=>{current.setMonth(current.getMonth()+1);render()};
document.getElementById("today").onclick=()=>{current=new Date();render()};
document.getElementById("refresh").onclick=load;
document.getElementById("backBtn").onclick=()=>showView("calendarView");
document.querySelectorAll(".pill").forEach(p=>p.onclick=()=>{document.querySelectorAll(".pill").forEach(x=>x.classList.remove("active"));p.classList.add("active");activeFilter=p.dataset.filter;render()});
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>showView(n.dataset.view));
document.querySelector(".gear").onclick=()=>showView("settingsView");
document.getElementById("openWeb").onclick=()=>window.open("https://www.volejbalek.cz/","_blank");
document.getElementById("themeToggle").onchange=e=>document.body.classList.toggle("light",!e.target.checked);
document.getElementById("addTraining").onclick=()=>alert("Přidání tréninku doplníme v další verzi.");
load();
