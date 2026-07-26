(function(){
'use strict';
window.FAMILY_GUIDE={
 sources:{
  hotel:{label:'مؤكد لحجزك',title:'رد الفندق والمرفق الرسمي 2026',use:'الأولوية للمواعيد، وما يشمله الشامل كليًا، والحافلات، وشروط الألعاب المرتبطة بإقامتك.'},
  website:{label:'الموقع الرسمي',title:'موقع Pickalbatros الرسمي',use:'يُستخدم لوصف المطاعم والمطابخ والخدمات العامة، مع عدم تقديمه على المرفق الأحدث عند اختلاف المواعيد.'},
  daily:{label:'يتغير يوميًا',title:'التطبيق والاستقبال عند الوصول',use:'برنامج الفعاليات، أيام نيفرلاند، الصيانة والتغييرات التشغيلية.'}
 },
 services:[
  {name:'الإفطار المبكر – Soprano',kind:'مطعم',start:'05:00',end:'07:00'},{name:'الإفطار – Millennium',kind:'مطعم',start:'07:00',end:'10:00'},{name:'الإفطار – Soprano',kind:'مطعم',start:'08:00',end:'11:00'},
  {name:'المسابح والأكوا بارك',kind:'مياه',start:'10:00',end:'18:00'},{name:'Lobby Bar',kind:'بار',start:'00:00',end:'24:00'},{name:'معجنات Lobby Bar',kind:'وجبات خفيفة',start:'10:30',end:'22:00'},
  {name:'Olympus Bar',kind:'بار',start:'10:00',end:'17:30'},{name:'White Bar',kind:'بار',start:'10:00',end:'18:30'},{name:'Beach Bar',kind:'بار',start:'10:00',end:'17:00'},{name:'La Veranda Bar',kind:'بار',start:'10:00',end:'17:00'},{name:'Club Mac Bar',kind:'بار',start:'10:00',end:'17:00'},
  {name:'الغداء – Soprano',kind:'مطعم',start:'12:30',end:'14:30'},{name:'Club Mac Fast Food',kind:'وجبات خفيفة',start:'12:30',end:'17:00'},{name:'Food Court',kind:'وجبات خفيفة',start:'12:30',end:'15:00'},{name:'وجبات Beach Bar',kind:'وجبات خفيفة',start:'12:30',end:'14:30'},
  {name:'Crepe Bar',kind:'حلويات',start:'15:00',end:'17:00'},{name:'العشاء – Millennium',kind:'مطعم',start:'19:00',end:'21:30'},{name:'العشاء – Soprano',kind:'مطعم',start:'19:30',end:'21:30'},{name:'Terrace Bar',kind:'بار',start:'19:00',end:'23:00'},{name:'الآيس كريم',kind:'حلويات',start:'19:00',end:'23:00'},{name:'العشاء المتأخر – Soprano',kind:'مطعم',start:'22:00',end:'24:00'}
 ],
 shuttle:{hotelToBeach:['08:00','08:30','09:00','09:30','10:00','10:30','11:15','11:45','13:30','14:10','14:50','15:30','16:10','17:00'],beachToHotel:['11:00','11:30','12:00','12:30','13:50','14:30','15:10','15:50','16:30','17:30','18:00']},
 kids:[
  {name:'أكوا بارك الأطفال والزحاليق الصغيرة',source:'hotel',age8:{status:'yes',label:'مناسب'},age3:{status:'supervised',label:'مناسب بإشراف'},note:'الفندق ذكر ألعابًا مائية كثيرة مخصصة للصغار؛ تعليمات المنقذ هي المرجع لكل لعبة.'},
  {name:'نادي الأطفال',source:'hotel',age8:{status:'yes',label:'مناسب'},age3:{status:'no',label:'غير مقبول مستقلًا'},note:'الفئة العمرية المعلنة من 4 إلى 12 سنة.'},
  {name:'الألعاب العالية',source:'hotel',age8:{status:'no',label:'غير مناسب'},age3:{status:'no',label:'غير مناسب'},note:'تتطلب عمر 10 سنوات فأكثر وطول 120 سم فأكثر.'},
  {name:'Magic Loop',source:'hotel',age8:{status:'conditional',label:'حسب الوزن والعمر'},age3:{status:'no',label:'غير مناسب'},note:'الوزن بين 60 و90 كجم، وتطبق تعليمات السلامة في الموقع.'},
  {name:'مسبح الأمواج والمسابح العامة',source:'hotel',age8:{status:'supervised',label:'مناسب بإشراف'},age3:{status:'supervised',label:'مناسب بإشراف مباشر'},note:'وجود المنقذين لا يغني عن الإشراف المباشر على الأطفال.'}
 ],
 dining:[
  {time:'05:00–07:00',title:'إفطار مبكر',place:'Soprano',source:'hotel'},{time:'07:00–10:00',title:'الإفطار',place:'Millennium',source:'hotel',note:'الموقع الرسمي يصف Millennium بأنه مطعم بطابع آسيوي.'},{time:'08:00–11:00',title:'الإفطار',place:'Soprano',source:'hotel',note:'الموقع الرسمي يصف Soprano بأنه بوفيه إيطالي.'},
  {time:'12:30–14:30',title:'الغداء',place:'Soprano',source:'hotel'},{time:'12:30–17:00',title:'وجبات سريعة',place:'Club Mac',source:'hotel'},{time:'12:30–15:00',title:'وجبات سريعة',place:'Food Court',source:'hotel'},{time:'12:30–14:30',title:'وجبات الشاطئ',place:'Beach Bar',source:'hotel',note:'الموقع العام يذكر 14:00، لكن المرفق المرسل لحجزك يذكر 14:30.'},{time:'15:00–17:00',title:'كريب',place:'Crepe Bar',source:'hotel'},
  {time:'19:00–21:30',title:'العشاء',place:'Millennium',source:'hotel'},{time:'19:30–21:30',title:'العشاء',place:'Soprano',source:'hotel'},{time:'19:00–23:00',title:'آيس كريم',place:'Ice Cream',source:'hotel'},{time:'22:00–00:00',title:'عشاء متأخر',place:'Soprano',source:'hotel'},
  {time:'18:30–21:00',title:'طاجن – وقت منشور بالموقع',place:'Tagine',source:'website',note:'يتطلب الحجز المسبق، والزيارة المشمولة واحدة: طاجن أو نيفرلاند.'}
 ],
 differences:[
  {title:'وجبات الشاطئ',text:'الموقع الرسمي العام يذكر 12:30–14:00، بينما المرفق المرسل إليك يذكر 12:30–14:30.',decision:'12:30–14:30 لأنها المعلومة الأحدث المرتبطة بحجزك.'},
  {title:'عدد الألعاب والمنزلقات',text:'رد الفندق والموقع يستخدمان طرق تصنيف مختلفة للألعاب المائية، لذلك لا يجوز جمع الأرقام باعتبارها مجموعًا واحدًا.',decision:'عرض شروط الملاءمة والسلامة فقط، مع إبقاء كل رقم منسوبًا إلى مصدره عند ذكره.'},
  {title:'طاجن ونيفرلاند',text:'الموقع يصف المطعم والعرض، بينما المرفق ورد الفندق يحددان أن المشمول زيارة واحدة بالحجز المسبق لأحدهما.',decision:'زيارة واحدة: طاجن أو نيفرلاند، مع تأكيد تفاصيل الحجز عند الوصول.'},
  {title:'أوقات الأكوا بارك',text:'رد الفندق لحجزك يؤكد 10:00–18:00. صفحة الأسئلة العامة تذكر وقتًا مختلفًا لتذاكر اليوم الواحد، وهو لا يثبت ساعات النزلاء.',decision:'10:00–18:00 لنزلاء حجزك.'}
 ]
};
})();
