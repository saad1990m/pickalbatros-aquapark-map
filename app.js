(function(){
"use strict";
const facilities=F.map(([n,name,cat,desc,family,hours,confirmed])=>({n,name,cat,desc,family,hours,status:confirmed?"confirmed":"unknown"}));
const hotspots=H.map(([n,xp,yp])=>({n,xp,yp}));
const schedule=S.map(([name,time,verified,note])=>({name,time,verified:!!verified,note}));
const byId=id=>document.getElementById(id);
const all=s=>Array.from(document.querySelectorAll(s));
const tabs=all(".tab"),views=all(".view");
function openView(id){tabs.forEach(b=>b.classList.toggle("active",b.dataset.view===id));views.forEach(v=>v.classList.toggle("active",v.id===id));window.scrollTo(0,0)}
tabs.forEach(b=>b.addEventListener("click",()=>openView(b.dataset.view)));

const viewport=byId("viewport"),stage=byId("stage"),zoomInfo=byId("zoomInfo");
let zoom=1,minZoom=1,maxZoom=4,lastZone="aqua",pinchDistance=0,pinchZoom=1;
function setZoom(value,keepCenter=true){
 const oldW=stage.scrollWidth||viewport.clientWidth;
 const cx=viewport.scrollLeft+viewport.clientWidth/2,cy=viewport.scrollTop+viewport.clientHeight/2;
 zoom=Math.max(minZoom,Math.min(maxZoom,value));
 stage.style.width=(zoom*100)+"%";
 zoomInfo.textContent="التكبير: "+Math.round(zoom*100)+"٪";
 if(keepCenter)requestAnimationFrame(()=>{const ratio=stage.scrollWidth/oldW;viewport.scrollLeft=Math.max(0,cx*ratio-viewport.clientWidth/2);viewport.scrollTop=Math.max(0,cy*ratio-viewport.clientHeight/2)})
}
function centerAt(xp,yp){requestAnimationFrame(()=>{viewport.scrollLeft=Math.max(0,stage.scrollWidth*xp/100-viewport.clientWidth/2);viewport.scrollTop=Math.max(0,stage.scrollHeight*yp/100-viewport.clientHeight/2)})}
function zone(name){
 lastZone=name;
 all(".map-toolbar .tool").forEach(b=>b.classList.remove("active"));
 if(name==="aqua"){byId("aquaBtn").classList.add("active");setZoom(innerWidth<700?2.55:1.65,false);centerAt(77,38)}
 else if(name==="never"){byId("neverBtn").classList.add("active");setZoom(innerWidth<700?2.45:1.65,false);centerAt(25,42)}
 else{byId("fullBtn").classList.add("active");setZoom(1,false);centerAt(50,45)}
}
byId("aquaBtn").onclick=()=>zone("aqua");byId("neverBtn").onclick=()=>zone("never");byId("fullBtn").onclick=()=>zone("full");
byId("zoomIn").onclick=()=>setZoom(zoom+.35);byId("zoomOut").onclick=()=>setZoom(zoom-.35);byId("resetBtn").onclick=()=>zone(lastZone);

function distance(a,b){const dx=a.clientX-b.clientX,dy=a.clientY-b.clientY;return Math.sqrt(dx*dx+dy*dy)}
viewport.addEventListener("touchstart",e=>{if(e.touches.length===2){pinchDistance=distance(e.touches[0],e.touches[1]);pinchZoom=zoom}},{passive:true});
viewport.addEventListener("touchmove",e=>{if(e.touches.length===2&&pinchDistance){e.preventDefault();setZoom(pinchZoom*distance(e.touches[0],e.touches[1])/pinchDistance)}},{passive:false});
viewport.addEventListener("touchend",e=>{if(e.touches.length<2)pinchDistance=0},{passive:true});

const sheet=byId("sheet"),detail=byId("detail");
function getFacility(n){return facilities.find(f=>f.n===n)}
function renderDetail(f){
 const hourClass=f.status==="confirmed"?"hour ok":"hour";
 detail.innerHTML='<div class="number">'+f.n+'</div><span class="pill">'+f.cat+'</span><h2>'+f.name+'</h2><p>'+f.desc+'</p><div class="detail-row"><b>مناسبته للعائلة</b>'+f.family+'</div><div class="detail-row"><b>أوقات التشغيل</b><span class="'+hourClass+'">'+f.hours+'</span></div>';
 byId("sheetNumber").textContent=f.n;byId("sheetCat").textContent=f.cat;byId("sheetTitle").textContent=f.name;byId("sheetDesc").textContent=f.desc;byId("sheetFamily").textContent=f.family;byId("sheetHours").textContent=f.hours;byId("sheetHours").className=hourClass;
}
function showFacility(n,openMobile=true){
 const f=getFacility(n);if(!f)return;
 all(".hotspot").forEach(h=>h.classList.toggle("selected",Number(h.dataset.n)===n));
 renderDetail(f);
 if(openMobile&&innerWidth<=850)sheet.classList.add("open");
}
function focusFacility(n){
 const h=hotspots.find(x=>x.n===n);openView("mapView");setZoom(innerWidth<700?2.8:2.0,false);centerAt(h.xp,h.yp);setTimeout(()=>showFacility(n,true),180);
}
hotspots.forEach(h=>{const b=document.createElement("button");b.type="button";b.className="hotspot";b.dataset.n=h.n;b.style.left=h.xp+"%";b.style.top=h.yp+"%";b.textContent=h.n;b.setAttribute("aria-label","عرض المرفق رقم "+h.n);b.onclick=e=>{e.stopPropagation();showFacility(h.n,true)};stage.appendChild(b)});
byId("closeSheet").onclick=()=>sheet.classList.remove("open");sheet.onclick=e=>{if(e.target===sheet)sheet.classList.remove("open")};

const categories=["الكل",...new Set(facilities.map(f=>f.cat))];let activeCat="الكل";
const filters=byId("filters"),search=byId("search"),facilityGrid=byId("facilityGrid");
function renderFilters(){filters.innerHTML="";categories.forEach(c=>{const b=document.createElement("button");b.type="button";b.className="filter"+(c===activeCat?" active":"");b.textContent=c;b.onclick=()=>{activeCat=c;renderFilters();renderFacilities()};filters.appendChild(b)})}
function renderFacilities(){
 const q=search.value.trim();
 const list=facilities.filter(f=>(activeCat==="الكل"||f.cat===activeCat)&&(!q||(String(f.n)+" "+f.name+" "+f.cat+" "+f.desc).includes(q)));
 facilityGrid.innerHTML="";
 list.forEach(f=>{const e=document.createElement("article");e.className="card facility";e.innerHTML='<div class="facility-top"><div class="facility-num">'+f.n+'</div><div><span class="pill">'+f.cat+'</span><h3>'+f.name+'</h3></div></div><p>'+f.desc+'</p><div class="hour '+(f.status==="confirmed"?"ok":"")+'">'+f.hours+'</div>';e.onclick=()=>focusFacility(f.n);facilityGrid.appendChild(e)})
}
search.oninput=renderFacilities;renderFilters();renderFacilities();

const eventGrid=byId("eventGrid");schedule.forEach(e=>{const c=document.createElement("article");c.className="card event";c.innerHTML='<h3>'+e.name+'</h3><div class="time">'+e.time+'</div><span class="status '+(e.verified?"":"warn")+'">'+(e.verified?"مؤكد رسميًا":"يحتاج تأكيدًا")+'</span><p>'+e.note+'</p>';eventGrid.appendChild(c)});

function copyText(id,b){const t=byId(id).innerText;if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(t).then(()=>done(b)).catch(()=>fallback(t,b));else fallback(t,b)}
function fallback(t,b){const a=document.createElement("textarea");a.value=t;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();document.execCommand("copy");a.remove();done(b)}function done(b){const s=b.textContent;b.textContent="تم النسخ";setTimeout(()=>b.textContent=s,1300)}all("[data-copy]").forEach(b=>b.onclick=()=>copyText(b.dataset.copy,b));

byId("mapImage").addEventListener("load",()=>setTimeout(()=>zone("aqua"),120));
window.addEventListener("resize",()=>setTimeout(()=>zone(lastZone),120));
})();