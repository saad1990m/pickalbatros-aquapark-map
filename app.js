(function(){
"use strict";
const facilities=F.map(([n,name,cat,desc,family,hours,confirmed])=>({n,name,cat,desc,family,hours,status:confirmed?"confirmed":"unknown"}));
const hotspots=H.map(([n,xp,yp])=>({n,xp,yp}));
const schedule=S.map(([name,time,verified,note])=>({name,time,verified:!!verified,note}));
const byId=id=>document.getElementById(id);
const all=s=>Array.from(document.querySelectorAll(s));

const hotspotCounts=new Map();
hotspots.forEach(h=>hotspotCounts.set(h.n,(hotspotCounts.get(h.n)||0)+1));
const uniqueHotspots=[];
const seenNumbers=new Set();
hotspots.forEach(h=>{if(!seenNumbers.has(h.n)){seenNumbers.add(h.n);uniqueHotspots.push(h)}});

const roomZones=[
 {code:"A",rooms:"1001–1122",xp:50.7,yp:22},
 {code:"B",rooms:"2001–2114",xp:61.1,yp:34},
 {code:"C",rooms:"2115–2170",xp:50.2,yp:42},
 {code:"D",rooms:"3001–3081",xp:58.7,yp:55},
 {code:"E",rooms:"4001–4081",xp:58.7,yp:84},
 {code:"F",rooms:"4082–4093",xp:67.7,yp:92},
 {code:"G",rooms:"5001–5085",xp:43.3,yp:88},
 {code:"H",rooms:"5101–5151",xp:27.2,yp:66},
 {code:"I",rooms:"5401–5500",xp:16.5,yp:72},
 {code:"J",rooms:"5601–5638",xp:31.8,yp:40},
 {code:"K",rooms:"5639–5665",xp:32.1,yp:27},
 {code:"L",rooms:"5666–5692",xp:33.9,yp:28,note:"ورد النطاق في مفتاح الخريطة الأصلي بترتيب معكوس، وتم عرضه هنا تصاعديًا."},
 {code:"M",rooms:"5801–5864",xp:34.7,yp:49},
 {code:"N",rooms:"6001–6053",xp:73.5,yp:32},
 {code:"O",rooms:"7001–7076",xp:67.2,yp:52},
 {code:"P",rooms:"120–144 و216–245",xp:17.8,yp:20},
 {code:"Q",rooms:"148–171 و246–268",xp:15.5,yp:32},
 {code:"R",rooms:"109–119 و145–147 و172–181 و205–215 و270–278",xp:11.8,yp:27},
 {code:"S",rooms:"501–590",xp:22.9,yp:31},
 {code:"T",rooms:"301–361",xp:28,yp:28}
];

const tabs=all(".tab"),views=all(".view");
function openView(id){tabs.forEach(b=>b.classList.toggle("active",b.dataset.view===id));views.forEach(v=>v.classList.toggle("active",v.id===id));window.scrollTo(0,0)}
tabs.forEach(b=>b.addEventListener("click",()=>openView(b.dataset.view)));

const viewport=byId("viewport"),stage=byId("stage"),zoomInfo=byId("zoomInfo");
let zoom=1,minZoom=1,maxZoom=4,lastZone="aqua",pinchDistance=0,pinchZoom=1,mapMode="facilities";
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
 all(".map-toolbar .zone-tool").forEach(b=>b.classList.remove("active"));
 if(name==="aqua"){byId("aquaBtn").classList.add("active");setZoom(innerWidth<700?2.55:1.65,false);centerAt(77,38)}
 else if(name==="never"){byId("neverBtn").classList.add("active");setZoom(innerWidth<700?2.45:1.65,false);centerAt(25,42)}
 else{byId("fullBtn").classList.add("active");setZoom(1,false);centerAt(50,45)}
}
byId("aquaBtn").classList.add("zone-tool");byId("neverBtn").classList.add("zone-tool");byId("fullBtn").classList.add("zone-tool");
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
 const count=hotspotCounts.get(f.n)||1;
 const repeatNote=count>1?'<div class="detail-row multiple-note"><b>تعدد المواقع</b>المخطط الأصلي يكرر هذا الرقم في '+count+' مواقع لأن المرفق موجود بأكثر من مكان. أظهرنا علامة واحدة فقط لتقليل الازدحام.</div>':"";
 detail.innerHTML='<div class="number">'+f.n+'</div><span class="pill">'+f.cat+'</span><h2>'+f.name+'</h2><p>'+f.desc+'</p><div class="detail-row"><b>مناسبته للعائلة</b>'+f.family+'</div><div class="detail-row"><b>أوقات التشغيل</b><span class="'+hourClass+'">'+f.hours+'</span></div>'+repeatNote;
 byId("sheetNumber").textContent=f.n;byId("sheetCat").textContent=f.cat;byId("sheetTitle").textContent=f.name;byId("sheetDesc").textContent=f.desc+(count>1?" المخطط الأصلي يضع هذا الرقم في "+count+" مواقع؛ أظهرنا علامة واحدة فقط.":"");byId("sheetFamily").textContent=f.family;byId("sheetHours").textContent=f.hours;byId("sheetHours").className=hourClass;
}
function showFacility(n,openMobile=true){
 const f=getFacility(n);if(!f)return;
 all(".hotspot").forEach(h=>h.classList.toggle("selected",Number(h.dataset.n)===n));
 all(".room-hotspot").forEach(h=>h.classList.remove("selected"));
 renderDetail(f);
 if(openMobile&&innerWidth<=850)sheet.classList.add("open");
}
function renderRoomZone(z){
 const extra=z.note?'<div class="detail-row"><b>ملاحظة على المصدر</b>'+z.note+'</div>':"";
 detail.innerHTML='<div class="number room-number">'+z.code+'</div><span class="pill">منطقة غرف</span><h2>المبنى '+z.code+'</h2><p>الحرف يرمز إلى مبنى أو نطاق غرف، وليس إلى مرفق ترفيهي.</p><div class="detail-row"><b>نطاق أرقام الغرف</b>'+z.rooms+'</div><div class="detail-row"><b>كيفية استخدام الرمز</b>اذكر الحرف مع طلبك للفندق لتحديد المنطقة المطلوبة بدقة.</div>'+extra;
 byId("sheetNumber").textContent=z.code;byId("sheetCat").textContent="منطقة غرف";byId("sheetTitle").textContent="المبنى "+z.code;byId("sheetDesc").textContent="هذا الحرف يحدد منطقة الغرف. نطاق أرقام الغرف: "+z.rooms+(z.note?" "+z.note:"");byId("sheetFamily").textContent="استخدم الحرف عند طلب موقع الغرفة من الفندق.";byId("sheetHours").textContent="لا ينطبق";byId("sheetHours").className="hour";
}
function showRoomZone(code,openMobile=true){
 const z=roomZones.find(r=>r.code===code);if(!z)return;
 all(".room-hotspot").forEach(h=>h.classList.toggle("selected",h.dataset.code===code));
 all(".hotspot").forEach(h=>h.classList.remove("selected"));
 renderRoomZone(z);
 if(openMobile&&innerWidth<=850)sheet.classList.add("open");
}
function focusFacility(n){
 const h=uniqueHotspots.find(x=>x.n===n);if(!h)return;
 openView("mapView");setMapMode("facilities");setZoom(innerWidth<700?2.8:2.0,false);centerAt(h.xp,h.yp);setTimeout(()=>showFacility(n,true),180);
}
function focusRoomZone(code){
 const z=roomZones.find(r=>r.code===code);if(!z)return;
 openView("mapView");setMapMode("rooms");setZoom(innerWidth<700?2.8:2.0,false);centerAt(z.xp,z.yp);setTimeout(()=>showRoomZone(code,true),180);
}

uniqueHotspots.forEach(h=>{const b=document.createElement("button");b.type="button";b.className="hotspot facility-hotspot";b.dataset.n=h.n;b.style.left=h.xp+"%";b.style.top=h.yp+"%";b.textContent=h.n;b.setAttribute("aria-label","عرض المرفق رقم "+h.n);b.onclick=e=>{e.stopPropagation();showFacility(h.n,true)};stage.appendChild(b)});
roomZones.forEach(z=>{const b=document.createElement("button");b.type="button";b.className="room-hotspot";b.dataset.code=z.code;b.style.left=z.xp+"%";b.style.top=z.yp+"%";b.textContent=z.code;b.setAttribute("aria-label","عرض منطقة الغرف "+z.code);b.onclick=e=>{e.stopPropagation();showRoomZone(z.code,true)};stage.appendChild(b)});

const toolbar=document.querySelector(".map-toolbar");
const facilityModeBtn=document.createElement("button");facilityModeBtn.type="button";facilityModeBtn.id="facilityModeBtn";facilityModeBtn.className="tool map-mode active";facilityModeBtn.textContent="أرقام المرافق";
const roomModeBtn=document.createElement("button");roomModeBtn.type="button";roomModeBtn.id="roomModeBtn";roomModeBtn.className="tool map-mode";roomModeBtn.textContent="حروف الغرف";
toolbar.prepend(roomModeBtn);toolbar.prepend(facilityModeBtn);
function setMapMode(mode){
 mapMode=mode;
 facilityModeBtn.classList.toggle("active",mode==="facilities");roomModeBtn.classList.toggle("active",mode==="rooms");
 all(".facility-hotspot").forEach(b=>b.hidden=mode!=="facilities");all(".room-hotspot").forEach(b=>b.hidden=mode!=="rooms");
 if(mode==="facilities")detail.innerHTML='<span class="pill">أرقام المرافق</span><h2>كل رقم يظهر مرة واحدة</h2><p>إذا كان المرفق موجودًا في عدة مواقع، ستظهر المعلومة داخل وصفه دون تكرار العلامة على الخريطة.</p>';
 else detail.innerHTML='<span class="pill">حروف الغرف</span><h2>الحروف تحدد مباني الغرف</h2><p>اضغط على أي حرف لمعرفة نطاق أرقام الغرف التابعة له. الحروف ليست أسماء مرافق.</p>';
}
facilityModeBtn.onclick=()=>setMapMode("facilities");roomModeBtn.onclick=()=>setMapMode("rooms");setMapMode("facilities");

byId("closeSheet").onclick=()=>sheet.classList.remove("open");sheet.onclick=e=>{if(e.target===sheet)sheet.classList.remove("open")};

const categories=["الكل",...new Set(facilities.map(f=>f.cat))];let activeCat="الكل";
const filters=byId("filters"),search=byId("search"),facilityGrid=byId("facilityGrid");
function renderFilters(){filters.innerHTML="";categories.forEach(c=>{const b=document.createElement("button");b.type="button";b.className="filter"+(c===activeCat?" active":"");b.textContent=c;b.onclick=()=>{activeCat=c;renderFilters();renderFacilities()};filters.appendChild(b)})}
function renderFacilities(){
 const q=search.value.trim();
 const list=facilities.filter(f=>(activeCat==="الكل"||f.cat===activeCat)&&(!q||(String(f.n)+" "+f.name+" "+f.cat+" "+f.desc).includes(q)));
 facilityGrid.innerHTML="";
 list.forEach(f=>{const count=hotspotCounts.get(f.n)||1;const e=document.createElement("article");e.className="card facility";e.innerHTML='<div class="facility-top"><div class="facility-num">'+f.n+'</div><div><span class="pill">'+f.cat+'</span><h3>'+f.name+'</h3></div></div><p>'+f.desc+'</p><div class="hour '+(f.status==="confirmed"?"ok":"")+'">'+f.hours+'</div>'+(count>1?'<div class="location-count">موجود في '+count+' مواقع بالخريطة</div>':'');e.onclick=()=>focusFacility(f.n);facilityGrid.appendChild(e)})
}
search.oninput=renderFacilities;renderFilters();renderFacilities();

const roomView=byId("roomView");
const roomLegend=document.createElement("section");roomLegend.className="card box room-legend";roomLegend.innerHTML='<h2>دليل حروف مناطق الغرف</h2><p>الحروف من A إلى T تحدد مباني أو نطاقات الغرف. اضغط على أي حرف للانتقال إلى موقعه في الخريطة.</p><div class="room-zone-grid"></div>';
const roomZoneGrid=roomLegend.querySelector(".room-zone-grid");
roomZones.forEach(z=>{const b=document.createElement("button");b.type="button";b.className="room-zone-card";b.innerHTML='<strong>'+z.code+'</strong><span>الغرف '+z.rooms+'</span>';b.onclick=()=>focusRoomZone(z.code);roomZoneGrid.appendChild(b)});
roomView.appendChild(roomLegend);

const eventGrid=byId("eventGrid");schedule.forEach(e=>{const c=document.createElement("article");c.className="card event";c.innerHTML='<h3>'+e.name+'</h3><div class="time">'+e.time+'</div><span class="status '+(e.verified?"":"warn")+'">'+(e.verified?"مؤكد رسميًا":"يحتاج تأكيدًا")+'</span><p>'+e.note+'</p>';eventGrid.appendChild(c)});

function copyText(id,b){const t=byId(id).innerText;if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(t).then(()=>done(b)).catch(()=>fallback(t,b));else fallback(t,b)}
function fallback(t,b){const a=document.createElement("textarea");a.value=t;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();document.execCommand("copy");a.remove();done(b)}function done(b){const s=b.textContent;b.textContent="تم النسخ";setTimeout(()=>b.textContent=s,1300)}all("[data-copy]").forEach(b=>b.onclick=()=>copyText(b.dataset.copy,b));

byId("mapImage").addEventListener("load",()=>setTimeout(()=>zone("aqua"),120));
window.addEventListener("resize",()=>setTimeout(()=>zone(lastZone),120));
})();