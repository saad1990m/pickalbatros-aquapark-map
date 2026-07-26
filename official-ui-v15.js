(function(){
'use strict';
const d=window.HOTEL_OFFICIAL;if(!d)return;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const rows=(items,fn)=>items.map(fn).join('');
function card(title,body,cls=''){return '<article class="official-card '+cls+'"><h3>'+esc(title)+'</h3>'+body+'</article>'}
function renderGuide(){
 const root=$('#stayGuideContent');if(!root)return;
 const restaurantRows=rows(d.restaurants,x=>'<tr><td><b>'+esc(x.name)+'</b></td><td>'+esc(x.service)+'</td><td>'+esc(x.time)+'</td></tr>');
 const snacks=rows(d.snacks,x=>'<li><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span><time>'+esc(x[2])+'</time></li>');
 const bars=rows(d.bars,x=>'<li><b>'+esc(x[0])+'</b><time>'+esc(x[1])+'</time></li>');
 const included=rows(d.included,x=>'<li>'+esc(x)+'</li>');
 const paid=rows(d.paid,x=>'<li>'+esc(x)+'</li>');
 const notes=rows(d.notes,x=>'<li>'+esc(x)+'</li>');
 root.innerHTML='\
 <div class="official-source"><b>المصدر:</b> '+esc(d.updated)+'</div>\
 <div class="official-grid">\
 '+card('المطاعم الرئيسية','<div class="table-wrap"><table class="official-table"><thead><tr><th>المطعم</th><th>الوجبة</th><th>الوقت</th></tr></thead><tbody>'+restaurantRows+'</tbody></table></div>')+'\
 '+card(d.reservation.title,'<p>'+esc(d.reservation.text)+'</p>','important')+'\
 '+card('الوجبات الخفيفة','<ul class="schedule-list">'+snacks+'</ul>')+'\
 '+card('البارات والآيس كريم','<ul class="schedule-list compact">'+bars+'</ul>')+'\
 '+card('المسابح والأكوا بارك','<div class="big-time">'+esc(d.pools.time)+'</div><p>'+esc(d.pools.text)+'</p>')+'\
 '+card('نادي الأطفال','<div class="big-time">'+esc(d.kids.time)+'</div><p>'+esc(d.kids.text)+'</p>')+'\
 '+card('البرنامج الترفيهي','<div class="big-time">'+esc(d.entertainment.time)+'</div><p>'+esc(d.entertainment.text)+'</p>')+'\
 '+card('نيفرلاند','<div class="big-time">'+esc(d.neverland.time)+'</div><p>'+esc(d.neverland.text)+'</p>')+'\
 </div>\
 <section class="official-section"><h2>حافلات الشاطئ</h2><p>'+esc(d.beach.included)+'</p><div class="shuttle-grid"><div><h3>من الفندق إلى الشاطئ</h3><div class="time-chips">'+d.beach.hotelToBeach.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div></div><div><h3>من الشاطئ إلى الفندق</h3><div class="time-chips">'+d.beach.beachToHotel.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div></div></div></section>\
 <div class="included-grid">\
 '+card('مشمول مجانًا','<ul class="check-list included">'+included+'</ul>')+'\
 '+card('برسوم إضافية','<ul class="check-list paid">'+paid+'</ul>')+'\
 </div>\
 <section class="official-section"><h2>ملاحظات مهمة</h2><ul class="notes-list">'+notes+'</ul></section>';
}
function renderOfficialEvents(){
 const root=$('#eventGrid');if(!root)return;
 const items=[
  ['المسابح والأكوا بارك',d.pools.time,d.pools.text,true],
  ['نادي الأطفال',d.kids.time,d.kids.text,true],
  ['البرنامج الترفيهي',d.entertainment.time,d.entertainment.text,false],
  ['عشاء وعرض نيفرلاند',d.neverland.time,d.neverland.text,true],
  ['حافلة الشاطئ','08:00–18:00','أول ذهاب 08:00 وآخر عودة 18:00؛ توجد رحلات محددة خلال اليوم.',true],
  ['بار الشاطئ','10:00–17:00','الوجبات السريعة 12:30–14:30، والمشروبات الغازية مشمولة.',true]
 ];
 root.innerHTML=items.map(x=>'<article class="card event"><h3>'+esc(x[0])+'</h3><div class="time">'+esc(x[1])+'</div><span class="status '+(x[3]?'':'warn')+'">'+(x[3]?'مؤكد رسميًا':'يتغير يوميًا')+'</span><p>'+esc(x[2])+'</p></article>').join('');
}
function correctRoomNotice(){
 const el=$('#roomRecommendation');if(el)el.textContent='الطلب الأنسب حاليًا: غرفتان متجاورتان في الدور الأرضي، قريبتان من مرافق الأطفال والمطاعم وبعيدتان عن الضوضاء. رمز المبنى النهائي يحتاج تأكيد الفندق؛ لا نعتمد توصية N أو O باعتبارها مؤكدة.';
}
window.addEventListener('load',()=>{renderGuide();renderOfficialEvents();correctRoomNotice();});
})();