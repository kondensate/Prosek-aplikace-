const demoEvents=[
 {date:"2026-09-26",type:"U18",title:"SK Prosek Praha – turnaj",time:"10:00",place:"SH SK Prosek Praha",detail:"Extraliga U18"},
 {date:"2026-10-03",type:"U18",title:"Turnaj U18",time:"09:00",place:"Praha",detail:"Extraliga U18"},
 {date:"2026-10-10",type:"U20",title:"SK Prosek – zápas",time:"14:00",place:"SH SK Prosek Praha",detail:"U20"},
 {date:"2026-10-15",type:"Trénink",title:"Trénink",time:"18:00",place:"SH SK Prosek Praha",detail:"Trénink"},
 {date:"2026-10-24",type:"U22",title:"Turnaj U22",time:"10:00",place:"Praha",detail:"U22"}
];

let current=new Date();
let activeFilter="Vše";

const monthNames=["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];
const pad=n=>String(n).padStart(2,"0");
const key=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

function render(){
  document.getElementById("monthTitle").textContent=`${monthNames[current.getMonth()]} ${current.getFullYear()}`;
  const grid=document.getElementById("calendar"); grid.innerHTML="";
  const first=new Date(current.getFullYear(),current.getMonth(),1);
  const last=new Date(current.getFullYear(),current.getMonth()+1,0);
  let start=(first.getDay()+6)%7;
  for(let i=0;i<start;i++){const s=document.createElement("div");s.className="day muted";grid.appendChild(s)}
  for(let d=1;d<=last.getDate();d++){
    const date=new Date(current.getFullYear(),current.getMonth(),d);
    const el=document.createElement("div");el.className="day";el.textContent=d;
    if(key(date)===key(new Date()))el.classList.add("today");
    if(demoEvents.some(e=>e.date===key(date)))el.classList.add("has-event");
    el.onclick=()=>showDay(key(date));grid.appendChild(el);
  }
  renderEvents();
}
function renderEvents(){
  const box=document.getElementById("events");box.innerHTML="";
  const month=key(current).slice(0,7);
  let list=demoEvents.filter(e=>e.date.startsWith(month)&&(activeFilter==="Vše"||e.type===activeFilter));
  list.sort((a,b)=>a.date.localeCompare(b.date));
  if(!list.length){box.innerHTML='<div class="event"><div class="event-meta">Žádná událost pro tento výběr.</div></div>';return}
  list.forEach(e=>{box.insertAdjacentHTML("beforeend",`<article class="event"><div class="event-top"><span>${formatDate(e.date)} · ${e.time}</span><span class="badge">${e.type}</span></div><div class="event-title">${e.title}</div><div class="event-meta">📍 ${e.place} · ${e.detail}</div></article>`)});
}
function formatDate(s){return new Intl.DateTimeFormat("cs-CZ",{day:"numeric",month:"long"}).format(new Date(s+"T12:00:00"))}
function showDay(date){const e=demoEvents.filter(x=>x.date===date);if(e.length)document.getElementById("events").scrollIntoView({behavior:"smooth"});}

document.getElementById("prevBtn").onclick=()=>{current.setMonth(current.getMonth()-1);render()};
document.getElementById("nextBtn").onclick=()=>{current.setMonth(current.getMonth()+1);render()};
document.getElementById("todayBtn").onclick=()=>{current=new Date();render()};
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderEvents()});

document.querySelectorAll(".tab").forEach(tab=>tab.onclick=()=>{
 document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));tab.classList.add("active");
 const id=tab.dataset.tab;
 document.querySelector(".app").classList.toggle("hidden",id!=="calendarTab");
 document.querySelectorAll(".panel").forEach(x=>x.classList.add("hidden"));
 if(id!=="calendarTab")document.getElementById(id).classList.remove("hidden");
});
document.getElementById("darkMode").onchange=e=>document.body.style.background=e.target.checked?"#0d0f13":"#f4f5f7";
render();
