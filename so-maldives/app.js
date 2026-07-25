(function(){
'use strict';
var MAP_DATA='https://intourmaldives.com/wp-content/uploads/2024/10/SO_Maldives_Resort_Map_-March-11-2024-Updated-1-pdf.jpg';

var places=[
 {id:'arrival',num:'1',name:'جناح الوصول والبار',en:'Arrival Pavilion and Bar',cat:'service',x:41.8,y:54.1,zone:'رصيف الوصول جنوب غرب الجزيرة',desc:'نقطة وصول الضيوف بالقارب وموقع بار جناح الوصول.'},
 {id:'hadaba',num:'2',name:'مطعم هضبة – الطابق الثاني',en:'Hadaba (2nd Floor)',cat:'food',x:43.7,y:48.8,zone:'فوق جناح الوصول',desc:'المطعم المميز للمأكولات الشامية بإطلالة مفتوحة على المحيط.'},
 {id:'citronelle',num:'3',name:'نادي سيترونيل',en:'The Citronelle Club',cat:'food',x:42.8,y:37.2,zone:'الجهة الغربية من قلب الجزيرة',desc:'مطعم لتناول الطعام طوال اليوم، وتستمد قائمته إلهامها من نكهات آسيا.'},
 {id:'lazuli',num:'4',name:'نادي شاطئ لازولي',en:'Lazuli Beach Club',cat:'food',x:50.4,y:36.1,zone:'الشاطئ والمسبح المركزي',desc:'نادي شاطئي ومسبح بطابع متوسطي، ويعد من أبرز مناطق التجمع في المنتجع.'},
 {id:'watersports',num:'5',name:'الرياضات المائية وذا زون',en:'Water Sports & The Zone',cat:'activity',x:53.4,y:26.0,zone:'شمال القلب المركزي',desc:'مركز الرياضات والأنشطة المائية ومنطقة ذا زون.'},
 {id:'nest',num:'6',name:'نادي الأطفال ذا نست',en:'The Nest – Kids Club',cat:'activity',x:45.1,y:21.0,zone:'شمال غرب الجزيرة',desc:'نادي الأطفال والأنشطة الإبداعية والترفيهية المخصصة للعائلات.'},
 {id:'link',num:'7',name:'ذا لينك',en:'The Link',cat:'service',x:56.5,y:25.4,zone:'شمال الجزيرة',desc:'مرفق مركزي باسم ذا لينك يقع بين منطقة الأنشطة ومعسكر العافية.'},
 {id:'gym',num:'8',name:'معسكر العافية – النادي الرياضي',en:'Wellness Camp – Gym',cat:'wellness',x:73.6,y:27.2,zone:'شمال شرق الجزيرة',desc:'النادي الرياضي الحديث ضمن معسكر العافية.'},
 {id:'spa',num:'9',name:'معسكر العافية – السبا',en:'Wellness Camp – Spa',cat:'wellness',x:83.7,y:22.1,zone:'الطرف الشمالي الشرقي',desc:'السبا ومرافق الاسترخاء والعلاجات ضمن معسكر العافية.'},
 {id:'clinic',num:'10',name:'عيادة المنتجع',en:'Resort Clinic',cat:'service',x:79.1,y:34.1,zone:'شرق الجزيرة',desc:'العيادة الطبية للمنتجع بالقرب من منطقة الفلل الشاطئية.'},
 {id:'runway1',num:'101–127',name:'الممر الأول – الفلل المائية',en:'Runway One – Water Villas',cat:'villa',x:20.0,y:41.4,zone:'غرب الجزيرة باتجاه كروس رودز',desc:'مجموعة الفلل المائية التي تحمل الأرقام من 101 إلى 127.',range:[101,127]},
 {id:'runway2',num:'201–228',name:'الممر الثاني – الفلل الشاطئية',en:'Runway Two – Beach Villas',cat:'villa',x:86.4,y:52.5,zone:'القوس الشرقي للجزيرة',desc:'مجموعة الفلل الشاطئية التي تحمل الأرقام من 201 إلى 228.',range:[201,228]},
 {id:'runway3',num:'301–328',name:'الممر الثالث – الفلل المائية',en:'Runway Three – Water Villas',cat:'villa',x:69.7,y:74.4,zone:'جنوب وجنوب شرق الجزيرة',desc:'مجموعة الفلل المائية التي تحمل الأرقام من 301 إلى 328.',range:[301,328]},
 {id:'coral',num:'🐠',name:'منطقة المحافظة على الشعاب المرجانية',en:'Coral Preservation Area',cat:'nature',x:17.5,y:21.0,zone:'شمال غرب المنتجع',desc:'منطقة مخصصة للمحافظة على الشعاب المرجانية، وفق مخطط المنتجع.'}
];
var categoryLabels={all:'الكل',food:'المطاعم',activity:'الأنشطة والعائلة',wellness:'العافية',service:'الخدمات',villa:'الفلل',nature:'الطبيعة'};
var categoryOrder=['all','food','activity','wellness','service','villa','nature'];

var viewport=document.getElementById('viewport');
var stage=document.getElementById('stage');
var mapImage=document.getElementById('mapImage');
var markerLayer=document.getElementById('markerLayer');
var sideList=document.getElementById('sideList');
var overlay=document.getElementById('overlay');
var detailsSheet=document.getElementById('detailsSheet');
var directorySheet=document.getElementById('directorySheet');
var infoSheet=document.getElementById('infoSheet');
var searchInput=document.getElementById('searchInput');
var searchResults=document.getElementById('searchResults');
var directorySearch=document.getElementById('directorySearch');
var directoryList=document.getElementById('directoryList');
var filters=document.getElementById('filters');
var toast=document.getElementById('toast');
var zoomLabel=document.getElementById('zoomLabel');

var scale=1,fitScale=1,tx=0,ty=0,dragging=false,lastX=0,lastY=0,pinchDistance=0,activePlace=null,currentFilter='all';

function byId(id){for(var i=0;i<places.length;i++){if(places[i].id===id)return places[i];}return null;}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
function catLabel(cat){return categoryLabels[cat]||cat;}
function announce(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(announce.timer);announce.timer=setTimeout(function(){toast.classList.remove('show');},2200);}

function makePlaceButton(p,compact){
  var b=document.createElement('button');
  b.className='placeCard'; b.type='button';
  b.setAttribute('data-place',p.id);
  b.innerHTML='<span class="placeNum">'+esc(p.num)+'</span><span class="placeText"><b>'+esc(p.name)+'</b><span>'+esc(p.en)+'</span></span>';
  b.addEventListener('click',function(){closeSheets();selectPlace(p.id,true,true);});
  return b;
}
function renderSide(){
  sideList.innerHTML='';
  for(var i=0;i<places.length;i++)sideList.appendChild(makePlaceButton(places[i],true));
}
function renderFilters(){
  filters.innerHTML='';
  categoryOrder.forEach(function(cat){
    var b=document.createElement('button'); b.type='button'; b.className='filter'+(cat===currentFilter?' active':'');
    b.textContent=categoryLabels[cat];
    b.addEventListener('click',function(){currentFilter=cat;renderFilters();renderDirectory(directorySearch.value);});
    filters.appendChild(b);
  });
}
function matches(p,q){
  if(!q)return true;
  var normalized=q.trim().toLowerCase();
  var digits=parseInt(normalized.replace(/\D/g,''),10);
  if(!isNaN(digits) && p.range && digits>=p.range[0] && digits<=p.range[1])return true;
  return (p.name+' '+p.en+' '+p.num+' '+p.zone).toLowerCase().indexOf(normalized)!==-1;
}
function renderDirectory(q){
  directoryList.innerHTML='';
  var count=0;
  places.forEach(function(p){
    if((currentFilter==='all'||p.cat===currentFilter)&&matches(p,q)){directoryList.appendChild(makePlaceButton(p,false));count++;}
  });
  if(!count)directoryList.innerHTML='<div class="noResults">لا توجد نتائج مطابقة.</div>';
}
function renderSearch(q){
  var text=q.trim();
  if(!text){searchResults.classList.remove('open');searchResults.innerHTML='';return;}
  var found=places.filter(function(p){return matches(p,text);}).slice(0,8);
  searchResults.innerHTML='';
  if(!found.length){searchResults.innerHTML='<div class="noResults">لم يتم العثور على نتيجة.</div>';searchResults.classList.add('open');return;}
  found.forEach(function(p){
    var b=document.createElement('button');b.type='button';b.className='result';
    b.innerHTML='<span class="placeNum">'+esc(p.num)+'</span><span><strong>'+esc(p.name)+'</strong><small>'+esc(p.en)+'</small></span>';
    b.addEventListener('click',function(){searchResults.classList.remove('open');searchInput.blur();selectPlace(p.id,true,true);});
    searchResults.appendChild(b);
  });
  searchResults.classList.add('open');
}
function createMarkers(){
  markerLayer.innerHTML='';
  places.forEach(function(p){
    var b=document.createElement('button');
    b.type='button';b.className='pinButton '+p.cat;b.setAttribute('data-id',p.id);b.setAttribute('aria-label',p.name);
    b.style.left=p.x+'%';b.style.top=p.y+'%';
    b.innerHTML='<span class="pinLabel">'+esc(p.name)+'</span><span class="pin">'+esc(p.num)+'</span>';
    b.addEventListener('click',function(e){e.stopPropagation();selectPlace(p.id,false,true);});
    markerLayer.appendChild(b);
  });
}
function updateMarkerScale(){
  var correction=fitScale/scale;
  var pins=markerLayer.querySelectorAll('.pinButton');
  for(var i=0;i<pins.length;i++)pins[i].style.setProperty('--marker-correction',correction);
}
function constrain(){
  var iw=mapImage.naturalWidth,ih=mapImage.naturalHeight,vw=viewport.clientWidth,vh=viewport.clientHeight;
  if(!iw||!ih)return;
  var sw=iw*scale,sh=ih*scale,margin=70;
  if(sw<=vw){tx=(vw-sw)/2;}else{tx=Math.min(margin,Math.max(vw-sw-margin,tx));}
  if(sh<=vh){ty=(vh-sh)/2;}else{ty=Math.min(margin,Math.max(vh-sh-margin,ty));}
}
function apply(){
  constrain();
  stage.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')';
  updateMarkerScale();
  zoomLabel.textContent='التكبير '+Math.round(scale/fitScale*100)+'٪';
}
function fitMap(){
  if(!mapImage.naturalWidth)return;
  fitScale=Math.min(viewport.clientWidth/mapImage.naturalWidth,viewport.clientHeight/mapImage.naturalHeight);
  scale=fitScale;tx=(viewport.clientWidth-mapImage.naturalWidth*scale)/2;ty=(viewport.clientHeight-mapImage.naturalHeight*scale)/2;apply();
}
function zoomAt(factor,cx,cy){
  if(typeof cx!=='number'){cx=viewport.clientWidth/2;cy=viewport.clientHeight/2;}
  var old=scale,next=Math.max(fitScale*.95,Math.min(fitScale*5,scale*factor));
  var wx=(cx-tx)/old,wy=(cy-ty)/old;scale=next;tx=cx-wx*next;ty=cy-wy*next;apply();
}
function focusPlace(p){
  var target=Math.max(fitScale*1.85,fitScale);
  target=Math.min(target,fitScale*3.2);
  scale=target;
  var px=p.x/100*mapImage.naturalWidth,py=p.y/100*mapImage.naturalHeight;
  tx=viewport.clientWidth/2-px*scale;ty=viewport.clientHeight/2-py*scale;apply();
}
function setActiveMarker(id){
  var pins=markerLayer.querySelectorAll('.pinButton');
  for(var i=0;i<pins.length;i++)pins[i].classList.toggle('active',pins[i].getAttribute('data-id')===id);
}
function selectPlace(id,focus,openDetails){
  var p=byId(id);if(!p)return;activePlace=p;setActiveMarker(id);
  document.getElementById('detailNum').textContent=p.num;
  document.getElementById('detailName').textContent=p.name;
  document.getElementById('detailEn').textContent=p.en;
  document.getElementById('detailDesc').textContent=p.desc;
  document.getElementById('detailCat').textContent=catLabel(p.cat);
  document.getElementById('detailZone').textContent=p.zone;
  if(focus)focusPlace(p);
  if(openDetails)openSheet(detailsSheet);
}
function openSheet(sheet){
  closeSheets(false);
  overlay.classList.add('open');sheet.classList.add('open');document.body.style.overflow='hidden';
}
function closeSheets(clearOverlay){
  detailsSheet.classList.remove('open');directorySheet.classList.remove('open');infoSheet.classList.remove('open');
  if(clearOverlay!==false){overlay.classList.remove('open');document.body.style.overflow='';}
}
function copyText(text){
  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).then(function(){announce('تم النسخ');},function(){fallbackCopy(text);});
  }else fallbackCopy(text);
}
function fallbackCopy(text){
  var t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.focus();t.select();
  try{document.execCommand('copy');announce('تم النسخ');}catch(e){announce('تعذر النسخ');}
  document.body.removeChild(t);
}
function sharePage(){
  var data={title:'خريطة SO/ Maldives بالعربية',text:'خريطة عربية تفاعلية لمنتجع SO/ Maldives',url:window.location.href};
  if(navigator.share){navigator.share(data).catch(function(){});}
  else{copyText(window.location.href);announce('تم نسخ الرابط');}
}

mapImage.addEventListener('load',function(){
  stage.style.width=mapImage.naturalWidth+'px';stage.style.height=mapImage.naturalHeight+'px';
  markerLayer.style.width=mapImage.naturalWidth+'px';markerLayer.style.height=mapImage.naturalHeight+'px';
  createMarkers();fitMap();
});
mapImage.addEventListener('error',function(){
  if(mapImage.getAttribute('data-fallback-used')!=='1'){
    mapImage.setAttribute('data-fallback-used','1');
    mapImage.src='https://maldivesarena.com/wp-content/uploads/2024/06/SO_-Maldives-Map-Maldives-Arena-Compare-Resorts-1024x730.jpg';
  }else{
    document.getElementById('mapHint').innerHTML='<b>تعذر تحميل صورة الخريطة.</b><br>تحقق من اتصال الإنترنت ثم حدّث الصفحة.';
  }
});
mapImage.src=MAP_DATA;

viewport.addEventListener('pointerdown',function(e){
  if(e.target.closest && (e.target.closest('.pinButton')||e.target.closest('.floatTools')||e.target.closest('.mapHint')))return;
  dragging=true;lastX=e.clientX;lastY=e.clientY;viewport.classList.add('dragging');
  try{viewport.setPointerCapture(e.pointerId);}catch(err){}
});
viewport.addEventListener('pointermove',function(e){
  if(!dragging)return;tx+=e.clientX-lastX;ty+=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;apply();
});
function endDrag(){dragging=false;viewport.classList.remove('dragging');}
viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);
viewport.addEventListener('wheel',function(e){e.preventDefault();var r=viewport.getBoundingClientRect();zoomAt(e.deltaY<0?1.16:.86,e.clientX-r.left,e.clientY-r.top);},{passive:false});
viewport.addEventListener('touchstart',function(e){
  if(e.touches.length===2)pinchDistance=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
},{passive:true});
viewport.addEventListener('touchmove',function(e){
  if(e.touches.length===2&&pinchDistance){
    var d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    var r=viewport.getBoundingClientRect(),cx=(e.touches[0].clientX+e.touches[1].clientX)/2-r.left,cy=(e.touches[0].clientY+e.touches[1].clientY)/2-r.top;
    zoomAt(d/pinchDistance,cx,cy);pinchDistance=d;
  }
},{passive:true});
viewport.addEventListener('touchend',function(){pinchDistance=0;},{passive:true});

document.getElementById('zoomInBtn').addEventListener('click',function(){zoomAt(1.3);});
document.getElementById('zoomOutBtn').addEventListener('click',function(){zoomAt(.77);});
document.getElementById('resetBtn').addEventListener('click',function(){fitMap();setActiveMarker('');announce('تمت إعادة ضبط الخريطة');});
document.getElementById('labelsBtn').addEventListener('click',function(){stage.classList.toggle('showLabels');announce(stage.classList.contains('showLabels')?'تم إظهار الأسماء':'تم إخفاء الأسماء');});
document.getElementById('fullBtn').addEventListener('click',function(){
  var el=document.getElementById('mapCard');
  var fn=el.requestFullscreen||el.webkitRequestFullscreen;
  if(fn){fn.call(el);}else{announce('ملء الشاشة غير مدعوم هنا؛ استخدم تدوير الجهاز.');}
});
document.getElementById('directoryBtn').addEventListener('click',function(){renderFilters();renderDirectory('');openSheet(directorySheet);});
document.getElementById('infoBtn').addEventListener('click',function(){openSheet(infoSheet);});
document.getElementById('shareBtn').addEventListener('click',sharePage);
document.getElementById('detailClose').addEventListener('click',closeSheets);
document.getElementById('directoryClose').addEventListener('click',closeSheets);
document.getElementById('infoClose').addEventListener('click',closeSheets);
overlay.addEventListener('click',closeSheets);
document.getElementById('focusBtn').addEventListener('click',function(){if(activePlace){closeSheets();focusPlace(activePlace);}});
document.getElementById('copyBtn').addEventListener('click',function(){if(activePlace)copyText(activePlace.name+' – '+activePlace.en);});
document.getElementById('hintClose').addEventListener('click',function(){document.getElementById('mapHint').style.display='none';});
searchInput.addEventListener('input',function(){renderSearch(searchInput.value);});
searchInput.addEventListener('focus',function(){if(searchInput.value.trim())renderSearch(searchInput.value);});
document.addEventListener('click',function(e){if(!e.target.closest('.searchWrap'))searchResults.classList.remove('open');});
directorySearch.addEventListener('input',function(){renderDirectory(directorySearch.value);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSheets();});
window.addEventListener('resize',function(){fitMap();});

renderSide();
})();