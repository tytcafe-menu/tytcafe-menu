/* =========================================================================
   TYT — i18n.js : English / Arabic translation + RTL switching
   -------------------------------------------------------------------------
   - Static page text is translated via [data-i18n] / [data-i18n-html] /
     [data-i18n-placeholder] / [data-i18n-aria-label] attributes.
   - The menu (rendered dynamically by main.js from MENU_DATA) is
     translated via MENU_I18N, keyed by category id + the item's original
     English name so it stays correct even if items are reordered.
   - Selected language persists in localStorage under "tyt-lang".
   ========================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "tyt-lang";

  /* -----------------------------------------------------------------------
     STATIC UI STRINGS
  ----------------------------------------------------------------------- */
  var STRINGS = {
    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.menu": "Menu",
      "nav.offers": "Offers",
      "nav.gallery": "Gallery",
      "nav.location": "Location",
      "nav.contact": "Contact",
      "nav.viewMenu": "View Menu",
      "actionbar.reviews": "Reviews",

      "offers.emptyTitle": "No Offers Right Now",
      "offers.emptyText": "We don't have any active promotions at the moment — check back soon for new deals.",

      "hero.eyebrow": "Coffee & Lounge · 10th of Ramadan",
      "hero.sub": "Take Your Time",
      "hero.tagline1": "Unique Coffee",
      "hero.tagline2": "Unmatched Vibes",
      "hero.sip": "Take Your Time — Sip, Chill, Repeat.",
      "hero.directions": "Get Directions",
      "hero.stat1": "Menu Sections",
      "hero.stat2": "Drinks & Bites",
      "hero.stat3": "Community",
      "hero.stat4": "Specialty Beans",

      "marquee.1": "Unique Coffee. Unmatched Vibes.",
      "marquee.2": "Sip, Chill, Repeat.",
      "marquee.3": "Take Your Time.",

      "exp.eyebrow": "The TYT Feeling",
      "exp.title": "More than a coffee run —<br /><em>an actual pause.</em>",
      "exp.lede": "Every corner of TYT is built around one idea: slow down, and let the cup catch up to you.",
      "exp.card1.title": "Great Coffee",
      "exp.card1.desc": "From single-origin V60 pours to a rich Turkish brew — every cup is made to be noticed.",
      "exp.card2.title": "Cozy Vibes",
      "exp.card2.desc": "Warm light, soft seating, low noise — a lounge built for staying a while, not rushing out.",
      "exp.card3.title": "Good Company",
      "exp.card3.desc": "A table for two, a corner for the group chat, a spot to study solo — everyone gets their space.",
      "exp.card4.title": "Take Your Time",
      "exp.card4.desc": "No clock-watching here. Stay for one espresso or an entire afternoon — the seat's yours.",

      "about.eyebrow": "About TYT",
      "about.title": "Coffee is the excuse.<br /><em>Taking your time</em> is the point.",
      "about.p1": "TYT was built on a simple idea: a good cup deserves a good pause. This is a coffee lounge where the seats are comfortable on purpose, the pace is unhurried on purpose, and the menu covers whatever the moment calls for — a fast espresso, a slow specialty pour, or a shake to share.",
      "about.p2": "Whether you're catching up with friends, getting through a stack of work, or just want somewhere warm to sit with a good drink, TYT is built around one house rule: take your time.",
      "about.quote": "\u201cTake a break. Take your time.\u201d",
      "about.badge": "Sip · Chill<br />Repeat",

      "menu.eyebrow": "The Full Menu",
      "menu.title": "Everything on tap,<br /><em>straight from the counter.</em>",
      "menu.lede": "Every item, description, and price below is taken directly from our printed menu — search or browse by category to find what calls to you.",
      "menu.searchPlaceholder": "Search the menu…",
      "menu.searchAria": "Search the menu",
      "menu.empty": "No drinks or bites match your search — try a different word.",
      "menu.ctaText": "Ready to take your time?",
      "menu.ctaBtn": "Find Us",
      "menu.all": "All",
      "menu.item": "item",
      "menu.items": "items",
      "menu.favorites": "Favorites",
      "menu.favAdd": "Add to favorites",
      "menu.favRemove": "Remove from favorites",
      "menu.favEmpty": "You haven't added any favorites yet — tap the heart on any item to save it here.",
      "menu.currency": "EGP",
      "menu.prevPage": "Previous",
      "menu.nextPage": "Next",
      "menu.inOffer": "🎁 In an Offer",

      "modal.note": "Prices & availability as listed on our printed menu.",
      "modal.defaultDesc": "A TYT favorite, made fresh to order.",

      "offers.eyebrow": "Offers",
      "offers.title": "Deals worth<br /><em>slowing down for.</em>",
      "offers.lede": "Grab one of our current specials, or check back — new drops land here often.",
      "offers.note": "Offers shown are current promotions and may change without notice.",

      "nav.comments": "Reviews",
      "comments.eyebrow": "Reviews",
      "comments.title": "Tell us<br /><em>what you think.</em>",
      "comments.lede": "Leave a review and a rating about TYT — your visit, your favorite drink, anything at all.",
      "comments.ratingLabel": "Your rating",
      "comments.namePlaceholder": "Your name",
      "comments.messagePlaceholder": "Write your review…",
      "comments.submit": "Post Review",
      "comments.submitting": "Posting…",
      "comments.success": "Thanks! Your review has been posted.",
      "comments.error": "Something went wrong — please try again.",
      "comments.errorFields": "Please fill in your name and review.",
      "comments.errorRating": "Please choose a star rating.",
      "comments.empty": "No reviews yet — be the first to say hi!",
      "comments.ratingCountOne": "based on 1 review",
      "comments.ratingCountMany": "based on {n} reviews",
      "comments.loading": "Loading reviews…",

      "gallery.eyebrow": "Gallery",
      "gallery.title": "A little look<br /><em>inside TYT.</em>",
      "gallery.lede": "A quick peek at the space, the drinks, and the pace we keep — take a minute and take it in.",
      "gallery.videoAria": "A short video tour of TYT – Take Your Time coffee lounge",
      "gallery.videoFallback": "Your browser doesn't support embedded video. You can",
      "gallery.videoDownload": "download the video",
      "gallery.videoInstead": "instead.",

      "location.eyebrow": "Find Us",
      "location.title": "Come sit with us<br /><em>in 10th of Ramadan.</em>",
      "location.coffeeLounge": "Coffee & Lounge",
      "location.address": "📍 10th of Ramadan – Neighborhood 32 – Mobil Station",
      "location.address2": "10th of Ramadan – Neighborhood 32 – Mobil Station",
      "location.getInTouch": "Get In Touch",
      "location.facebook": "Facebook / Messenger",
      "location.phone": "Phone",
      "location.instagram": "Instagram",
      "location.hours": "Opening Hours",
      "location.hoursValue": "Open 24/7",
      "location.mapBtn": "الموقع على الخريطة",
      "location.mapEmbedTitle": "TYT Cafe location on Google Maps",

      "footer.tagline1": "Unique Coffee. Unmatched Vibes.",
      "footer.tagline2": "Take Your Time – Sip, Chill, Repeat.",
      "footer.quickLinks": "Quick Links",
      "footer.visit": "Visit",
      "footer.rights": "TYT – Take Your Time. All rights reserved.",
      "footer.builtWith": "Built with care for slow mornings."
    },
    ar: {
      "nav.home": "الرئيسية",
      "nav.about": "من نحن",
      "nav.menu": "المنيو",
      "nav.offers": "العروض",
      "nav.gallery": "معرض الصور",
      "nav.location": "الموقع",
      "nav.contact": "تواصل معنا",
      "nav.viewMenu": "اطلب المنيو",
      "actionbar.reviews": "التقييمات",

      "offers.emptyTitle": "لا توجد عروض حاليًا",
      "offers.emptyText": "مفيش عروض شغالة دلوقتي — تابعنا، هنضيف عروض جديدة قريبًا.",

      "hero.eyebrow": "كافيه ولاونج · العاشر من رمضان",
      "hero.sub": "خُد وقتك",
      "hero.tagline1": "قهوة مميزة",
      "hero.tagline2": "أجواء لا تُنسى",
      "hero.sip": "خُد وقتك — اشرب، استرخِ، وكرر.",
      "hero.directions": "احصل على الاتجاهات",
      "hero.stat1": "قسم بالمنيو",
      "hero.stat2": "مشروب ومقبلات",
      "hero.stat3": "متابع",
      "hero.stat4": "حبوب مختصة",

      "marquee.1": "قهوة مميزة. أجواء لا تُنسى.",
      "marquee.2": "اشرب، استرخِ، وكرر.",
      "marquee.3": "خُد وقتك.",

      "exp.eyebrow": "تجربة TYT",
      "exp.title": "مش مجرد كوب قهوة —<br /><em>دي فترة راحة حقيقية.</em>",
      "exp.lede": "كل ركن في TYT اتصمم على فكرة واحدة: خفف السرعة، وخلي الكوب يلحقك.",
      "exp.card1.title": "قهوة رائعة",
      "exp.card1.desc": "من V60 أحادي المصدر لقهوة تركي غنية — كل كوب معمول عشان يتلاحظ.",
      "exp.card2.title": "أجواء دافئة",
      "exp.card2.desc": "إضاءة دافئة، مقاعد مريحة، هدوء — لاونج مصمم عشان تقعد فيه مش عشان تجري منه.",
      "exp.card3.title": "صحبة حلوة",
      "exp.card3.desc": "ترابيزة لاتنين، ركن لمجموعة الأصحاب، مكان للمذاكرة لوحدك — الكل له مساحته.",
      "exp.card4.title": "خُد وقتك",
      "exp.card4.desc": "من غير نظر للساعة. اقعد لكوب إسبريسو أو لعصر كامل — المكان مكانك.",

      "about.eyebrow": "عن TYT",
      "about.title": "القهوة هي الشماعة.<br /><em>خد وقتك</em> هو الأساس.",
      "about.p1": "TYT اتبنى على فكرة بسيطة: كل كوب حلو يستاهل وقفة حلوة. ده كافيه ولاونج المقاعد فيه مريحة عن قصد، والإيقاع فيه هادي عن قصد، والمنيو فيه اللي يناسب أي لحظة — إسبريسو سريع، أو قهوة مختصة بتاخد وقتها، أو ميلك شيك تتقسم مع صحابك.",
      "about.p2": "سواء بتقعد مع صحابك، أو بتخلص شغل، أو نفسك بس تقعد في مكان دافي مع مشروب حلو، TYT مبني على قاعدة واحدة: خد وقتك.",
      "about.quote": "\u201cخد بريك. خد وقتك.\u201d",
      "about.badge": "اشرب · استرخِ<br />وكرر",

      "menu.eyebrow": "المنيو كاملة",
      "menu.title": "كل حاجة موجودة،<br /><em>على أصولها من الكاونتر.</em>",
      "menu.lede": "كل صنف ووصف وسعر تحت منقول زي ما هو من المنيو المطبوع عندنا — دور بالبحث أو تصفح حسب القسم عشان توصل للي نفسك فيه.",
      "menu.searchPlaceholder": "دور في المنيو…",
      "menu.searchAria": "دور في المنيو",
      "menu.empty": "مفيش مشروبات أو أكل مطابق لبحثك — جرّب كلمة تانية.",
      "menu.ctaText": "جاهز تاخد وقتك؟",
      "menu.ctaBtn": "لاقينا",
      "menu.all": "الكل",
      "menu.item": "صنف",
      "menu.items": "أصناف",
      "menu.favorites": "المفضلة",
      "menu.favAdd": "إضافة للمفضلة",
      "menu.favRemove": "إزالة من المفضلة",
      "menu.favEmpty": "لسه مفيش حاجة في المفضلة — دوس على القلب على أي صنف عشان تحفظه هنا.",
      "menu.currency": "جنيه",
      "menu.prevPage": "السابق",
      "menu.nextPage": "التالي",

      "modal.note": "الأسعار والتوافر زي ما هي مدرجة في المنيو المطبوع عندنا.",
      "modal.defaultDesc": "من أشهر أصناف TYT، بتتحضر طازة لحد ما تطلبها.",

      "offers.eyebrow": "العروض",
      "offers.title": "عروض تستاهل<br /><em>تقعد لأجلها.</em>",
      "offers.lede": "اختار واحد من عروضنا الحالية، أو ارجع تاني — عروض جديدة بتنزل هنا باستمرار.",
      "offers.note": "العروض المعروضة هي العروض الحالية وممكن تتغير من غير إشعار مسبق.",

      "nav.comments": "التقييمات",
      "comments.eyebrow": "التقييمات",
      "comments.title": "قولّنا<br /><em>رأيك إيه.</em>",
      "comments.lede": "اترك تقييمك عن TYT — زيارتك، مشروبك المفضل، أو أي حاجة تحب تقولها.",
      "comments.ratingLabel": "تقييمك",
      "comments.namePlaceholder": "اسمك",
      "comments.messagePlaceholder": "اكتب تقييمك…",
      "comments.submit": "انشر التقييم",
      "comments.submitting": "جاري النشر…",
      "comments.success": "شكرًا! تم نشر تقييمك.",
      "comments.error": "حصل خطأ — حاول تاني.",
      "comments.errorFields": "من فضلك اكتب اسمك وتقييمك.",
      "comments.errorRating": "من فضلك اختار تقييم بالنجوم.",
      "comments.empty": "لسه مفيش تقييمات — كن أول حد يسلّم علينا!",
      "comments.ratingCountOne": "بناءً على تقييم واحد",
      "comments.ratingCountMany": "بناءً على {n} تقييم",
      "comments.loading": "جاري تحميل التقييمات…",

      "gallery.eyebrow": "معرض الصور",
      "gallery.title": "لمحة سريعة<br /><em>من جوه TYT.</em>",
      "gallery.lede": "نظرة سريعة على المكان، المشروبات، والإيقاع اللي بنحافظ عليه — خد دقيقة واستمتع.",
      "gallery.videoAria": "فيديو قصير لجولة داخل كافيه ولاونج TYT – خد وقتك",
      "gallery.videoFallback": "المتصفح بتاعك مش بيدعم الفيديو المضمّن. ممكن",
      "gallery.videoDownload": "تنزّل الفيديو",
      "gallery.videoInstead": "بدل كده.",

      "location.eyebrow": "لاقينا",
      "location.title": "تعالى اقعد معانا<br /><em>في العاشر من رمضان.</em>",
      "location.coffeeLounge": "كافيه ولاونج",
      "location.address": "📍 العاشر من رمضان – الحي 32 – محطة موبيل",
      "location.address2": "العاشر من رمضان – الحي 32 – محطة موبيل",
      "location.getInTouch": "تواصل معانا",
      "location.facebook": "فيسبوك / ماسنجر",
      "location.phone": "التليفون",
      "location.instagram": "إنستجرام",
      "location.hours": "مواعيد العمل",
      "location.hoursValue": "مفتوح 24 ساعة طول الأسبوع",
      "location.mapBtn": "الموقع على الخريطة",
      "location.mapEmbedTitle": "موقع TYT Cafe على خرائط جوجل",

      "footer.tagline1": "قهوة مميزة. أجواء لا تُنسى.",
      "footer.tagline2": "خُد وقتك – اشرب، استرخِ، وكرر.",
      "footer.quickLinks": "روابط سريعة",
      "footer.visit": "زورنا",
      "footer.rights": "TYT – خد وقتك. جميع الحقوق محفوظة.",
      "footer.builtWith": "اتعمل باهتمام عشان صباحاتك الهادية."
    }
  };

  /* -----------------------------------------------------------------------
     MENU TRANSLATIONS
     Keyed by category id, then by the item's original English name
     (lowercased) so lookups stay correct regardless of item order.
  ----------------------------------------------------------------------- */
  var MENU_AR = {
    categories: {
      "hot-coffee": { name: "قهوة ساخنة" },
      "iced-coffee": { name: "قهوة مثلجة" },
      "specialty-coffee": { name: "قهوة مختصة", description: "حبوب قهوة مختصة" },
      "hot-non-coffee": { name: "مشروبات ساخنة بدون قهوة" },
      "fresh-juices": { name: "عصائر طازجة" },
      "smoothies": { name: "سموذي" },
      "milkshakes": { name: "ميلك شيك" },
      "coffee-frappe": { name: "فرابيه بالقهوة" },
      "non-coffee-frappe": { name: "فرابيه بدون قهوة" },
      "soda-soft-drinks": { name: "مشروبات غازية ومنعشة" },
      "canned-soft-drinks": { name: "مشروب غازي", description: "مشروبات غازية معلبة وزجاجات" },
      "playstation": { name: "بلايستيشن", description: "وقت لعب داخل الكافيه" },
      "birthday": { name: "عيد ميلاد", description: "إضافات حجز عيد الميلاد" },
      "cigarettes": { name: "سجائر", description: "متاحة عند الكاشير" },
      "croissant": { name: "كرواسون" },
      "tyt-beans": { name: "حبوب بن TYT", description: "أكياس بن حبوب كامل للمنزل" },
      "sandwiches": { name: "سندوتشات" },
      "waffle-pancake": { name: "وافل وبان كيك" },
      "food": { name: "أكل خفيف", description: "سندوتشات، سناكس، دونتس ودانش" },
      "desserts": { name: "حلويات" },
      "mochi": { name: "موتشي" },
      "suhoor": { name: "سحور", description: "منيو السحور — رمضان فقط" },
      "shisha": { name: "شيشة", description: "خدمة الشيشة" },
      "extras": { name: "إضافات", description: "أضفها لأي مشروب" }
    },
    items: {
      "hot-coffee::single espresso": { name: "إسبريسو مفرد", description: "شوت إسبريسو مسحوب" },
      "hot-coffee::double espresso": { name: "إسبريسو دبل", description: "شوت دبل إسبريسو مسحوب" },
      "hot-coffee::american coffee": { name: "قهوة أمريكانو", description: "إسبريسو · مية سخنة" },
      "hot-coffee::cappuccino": { name: "كابتشينو", description: "إسبريسو · لبن مبخر · فوم لبن" },
      "hot-coffee::latte": { name: "لاتيه", description: "إسبريسو · لبن مبخر · فوم خفيف" },
      "hot-coffee::cortado": { name: "كورتادو", description: "إسبريسو · لبن مبخر بنسب متساوية" },
      "hot-coffee::spanish latte": { name: "لاتيه إسباني", description: "إسبريسو · لبن · لبن مكثف" },
      "hot-coffee::macchiato": { name: "ماكياتو", description: "إسبريسو · رشة فوم لبن" },
      "hot-coffee::nutella coffee": { name: "قهوة بالنوتيلا", description: "إسبريسو · نوتيلا · كريمة مخفوقة · بسكويت كون" },
      "hot-coffee::lotus coffee": { name: "قهوة باللوتس", description: "إسبريسو · صوص لوتس · كريمة مخفوقة · بسكويت لوتس" },
      "hot-coffee::flat white": { name: "فلات وايت", description: "إسبريسو · لبن مبخر · فوم رفيع" },
      "hot-coffee::pistachio coffee": { name: "قهوة بالفستق", description: "إسبريسو · صوص فستق · كريمة مخفوقة · مكسرات" },
      "hot-coffee::hot mocha": { name: "موكا ساخنة", description: "إسبريسو · صوص شوكولاتة · لبن مبخر · كريمة مخفوقة" },
      "hot-coffee::white mocha": { name: "وايت موكا", description: "إسبريسو · صوص شوكولاتة بيضاء · لبن مبخر" },
      "hot-coffee::turkish coffee": { name: "قهوة تركي", description: "بن مطحون ناعم مغلي بالمية" },
      "hot-coffee::turkish coffee double": { name: "قهوة تركي دبل", description: "مقدار دبل من القهوة التركي" },
      "hot-coffee::turkish coffee with milk": { name: "قهوة تركي باللبن", description: "قهوة تركي · لبن" },
      "hot-coffee::turkish coffee with flavors": { name: "قهوة تركي بالفلايفرز", description: "قهوة تركي · اختار النكهة" },
      "hot-coffee::nescafé": { name: "نسكافيه", description: "قهوة سريعة التحضير · مية سخنة" },
      "hot-coffee::tyt caffè": { name: "تي واي تي كافيه", description: "زبدة الفول السوداني · صوص شوكولاتة بيضاء · بودرة شوكولاتة · لبن · شوت إسبريسو مفرد" },
      "hot-coffee::special coffee": { name: "قهوة خاص" },

      "iced-coffee::iced latte": { name: "لاتيه مثلج", description: "إسبريسو · لبن بارد · ثلج" },
      "iced-coffee::iced spanish latte": { name: "لاتيه إسباني مثلج", description: "إسبريسو · لبن · لبن مكثف · ثلج" },
      "iced-coffee::iced cappuccino": { name: "كابتشينو مثلج", description: "إسبريسو · لبن بارد · ثلج · فوم" },
      "iced-coffee::iced mocha": { name: "موكا مثلجة", description: "إسبريسو · صوص شوكولاتة · لبن بارد · ثلج" },
      "iced-coffee::iced white mocha": { name: "وايت موكا مثلجة", description: "إسبريسو · صوص شوكولاتة بيضاء · لبن بارد · ثلج" },
      "iced-coffee::matcha latte": { name: "لاتيه ماتشا", description: "ماتشا · لبن · ثلج" },
      "iced-coffee::caramel macchiato": { name: "ماكياتو كراميل", description: "إسبريسو · نكهة فانيليا · لبن · صوص كراميل · ثلج" },
      "iced-coffee::salted caramel latte": { name: "لاتيه كراميل مملح", description: "إسبريسو · صوص كراميل مملح · لبن · ثلج" },
      "iced-coffee::spanish matcha": { name: "ماتشا إسباني", description: "لبن · لبن مكثف · ماتشا" },
      "iced-coffee::strawberry matcha": { name: "ماتشا بالفراولة", description: "فراولة · ماتشا · لبن · ثلج" },
      "iced-coffee::mango matcha": { name: "ماتشا بالمانجو", description: "مانجو · ماتشا · لبن · ثلج" },
      "iced-coffee::bottle iced spanish latte": { name: "لاتيه إسباني مثلج (زجاجة)", description: "إسبريسو · لبن · لبن مكثف · بالزجاجة" },
      "iced-coffee::boba iced coffee": { name: "قهوة مثلجة بالبوبا", description: "بوبا · لبن قهوة مثلج · إسبريسو" },

      "specialty-coffee::v60": { name: "في 60", description: "ساخن أو بارد" },
      "specialty-coffee::syphon": { name: "سايفون", description: "ساخن أو بارد" },
      "specialty-coffee::chemex": { name: "كيمكس", description: "ساخن أو بارد" },
      "specialty-coffee::cold brew": { name: "كولد برو", description: "قهوة مطحونة خشنة منقوعة في مية باردة لساعات" },
      "specialty-coffee::aeropress": { name: "إيروبرس", description: "ساخن أو بارد" },
      "specialty-coffee::french press": { name: "فرنش برس", description: "قهوة مطحونة خشنة منقوعة في مية سخنة ومضغوطة" },

      "hot-non-coffee::red tea": { name: "شاي أحمر", description: "شاي أسود مغلي بالمية السخنة" },
      "hot-non-coffee::green tea": { name: "شاي أخضر", description: "شاي أخضر مغلي بالمية السخنة" },
      "hot-non-coffee::flavored tea": { name: "شاي بالفلايفرز", description: "شاي · اختار النكهة" },
      "hot-non-coffee::anise": { name: "يانسون", description: "حبة يانسون مغلية بالمية السخنة" },
      "hot-non-coffee::mint": { name: "نعناع", description: "نعناع طازج مغلي بالمية السخنة" },
      "hot-non-coffee::herbal cocktail": { name: "كوكتيل أعشاب", description: "يانسون · نعناع طازج · ليمون · عسل" },
      "hot-non-coffee::apple cider": { name: "سيدر التفاح", description: "عصير تفاح · أعواد قرفة" },
      "hot-non-coffee::hot chocolate": { name: "شوكولاتة ساخنة", description: "بودرة شوكولاتة · كريمة مخفوقة · لبن" },
      "hot-non-coffee::hot avocado": { name: "أفوكادو ساخن", description: "أفوكادو · آيس كريم فانيليا" },
      "hot-non-coffee::hot lotus": { name: "لوتس ساخن", description: "صوص لوتس · لبن · نكهة كراميل · كريمة مخفوقة" },

      "fresh-juices::mango": { name: "مانجو", description: "مانجو طازج" },
      "fresh-juices::guava": { name: "جوافة", description: "جوافة طازجة" },
      "fresh-juices::strawberry": { name: "فراولة", description: "فراولة طازجة" },
      "fresh-juices::orange": { name: "برتقال", description: "برتقال طازج" },
      "fresh-juices::lemon or lemon mint": { name: "ليمون أو ليمون بالنعناع", description: "نعناع طازج · لايم · نكهة نعناع" },
      "fresh-juices::alaska cocktail": { name: "كوكتيل ألاسكا", description: "أناناس · خوخ · نعناع طازج · شريحة أناناس" },
      "fresh-juices::mango peach cocktail": { name: "كوكتيل مانجو وخوخ", description: "نعناع طازج · لايم · مانجو" },
      "fresh-juices::banana with milk": { name: "موز باللبن", description: "موز · لبن" },
      "fresh-juices::dates with milk": { name: "تمر باللبن", description: "تمر · لبن" },
      "fresh-juices::power cocktail": { name: "باور كوكتيل" },
      "fresh-juices::avocado": { name: "أفوكادو", description: "أفوكادو طازج · لبن" },
      "fresh-juices::avocado honey": { name: "أفوكادو بالعسل", description: "أفوكادو طازج · لبن · عسل" },

      "smoothies::smooth lemon mint": { name: "سموذي ليمون بالنعناع", description: "نعناع طازج · لبن" },
      "smoothies::tyt smoothie": { name: "سموذي تي واي تي" },
      "smoothies::smoothie mixed berry": { name: "سموذي توت مشكل", description: "توت مشكل" },
      "smoothies::smoothie passion fruit": { name: "سموذي باشن فروت", description: "باشن فروت" },
      "smoothies::smoothie piña colada": { name: "سموذي بينا كولادا", description: "بلو كوراساو · نكهة جوز الهند · أناناس · شريحة أناناس" },
      "smoothies::smoothie blueberry": { name: "سموذي بلوبيري", description: "بلوبيري" },

      "milkshakes::vanilla shake": { name: "ميلك شيك فانيليا", description: "آيس كريم · لبن · كريمة مخفوقة" },
      "milkshakes::blueberry vanilla shake": { name: "ميلك شيك بلوبيري وفانيليا", description: "آيس كريم · بلوبيري · لبن · كريمة مخفوقة" },
      "milkshakes::strawberry shake": { name: "ميلك شيك فراولة", description: "آيس كريم · لبن · كريمة مخفوقة" },
      "milkshakes::pistachio shake": { name: "ميلك شيك فستق", description: "صوص فستق · لبن · كريمة مخفوقة" },
      "milkshakes::cake shake": { name: "ميلك شيك بالكيك", description: "آيس كريم · كريمة مخفوقة · قطعة الحلوى اللي تختارها" },
      "milkshakes::cookies shake": { name: "ميلك شيك كوكيز", description: "آيس كريم بنكهة الكوكيز · كريمة مخفوقة" },
      "milkshakes::mango shake": { name: "ميلك شيك مانجو", description: "آيس كريم · مانجو · كريمة مخفوقة" },
      "milkshakes::oreo shake": { name: "ميلك شيك أوريو", description: "آيس كريم · أوريو · كريمة مخفوقة" },

      "coffee-frappe::vanilla coffee frappé": { name: "فرابيه فانيليا بالقهوة", description: "نكهة فانيليا · لبن · كريمة مخفوقة" },
      "coffee-frappe::caramel frappé": { name: "فرابيه كراميل", description: "نكهة كراميل · لبن · صوص كراميل · كريمة مخفوقة" },
      "coffee-frappe::mocha frappé": { name: "فرابيه موكا", description: "بودرة شوكولاتة · لبن · صوص شوكولاتة · كريمة مخفوقة" },
      "coffee-frappe::lotus frappé": { name: "فرابيه لوتس", description: "صوص لوتس · لبن · بسكويت لوتس · كريمة مخفوقة" },
      "coffee-frappe::cookies frappé": { name: "فرابيه كوكيز", description: "نكهة كوكيز · لبن · بودرة شوكولاتة · كريمة مخفوقة" },
      "coffee-frappe::tyt frappé": { name: "فرابيه تي واي تي", description: "لبن · صوص كراميل · كريمة مخفوقة · لبن مكثف" },
      "coffee-frappe::white mocha frappé": { name: "فرابيه وايت موكا", description: "صوص شوكولاتة بيضاء · لبن · صوص كراميل · كريمة مخفوقة" },
      "coffee-frappe::irish frappé": { name: "فرابيه إيرش", description: "نكهة إيرش · لبن · صوص كراميل · كريمة مخفوقة" },

      "non-coffee-frappe::vanilla frappé": { name: "فرابيه فانيليا", description: "نكهة فانيليا · لبن" },
      "non-coffee-frappe::strawberry frappé": { name: "فرابيه فراولة", description: "فراولة · لبن" },
      "non-coffee-frappe::mango frappé": { name: "فرابيه مانجو", description: "مانجو · لبن" },
      "non-coffee-frappe::blueberry frappé": { name: "فرابيه بلوبيري", description: "بلوبيري · لبن" },
      "non-coffee-frappe::passion frappé": { name: "فرابيه باشن فروت", description: "باشن فروت · لبن" },

      "soda-soft-drinks::soft drink": { name: "مشروب غازي" },
      "soda-soft-drinks::red bull": { name: "ريد بُل" },
      "soda-soft-drinks::mojito soda": { name: "موهيتو صودا", description: "صودا لايم · نكهة نعناع · نكهة موهيتو · نعناع طازج · لايم" },
      "soda-soft-drinks::red bull coffee": { name: "ريد بُل بالقهوة", description: "شوت إسبريسو مفرد" },
      "soda-soft-drinks::red bull mix berry": { name: "ريد بُل بالتوت المشكل", description: "توت مشكل" },
      "soda-soft-drinks::scotch mint": { name: "سكوتش منت", description: "صودا لايم · نكهة نعناع · لايم" },
      "soda-soft-drinks::sunshine": { name: "صن شاين", description: "صودا لايم · نكهة رمان · برتقال · لايم" },
      "soda-soft-drinks::cherry cola": { name: "شيري كولا", description: "نكهة كرز · كولا" },
      "soda-soft-drinks::boba soda": { name: "صودا بالبوبا", description: "صودا لايم · بوبا · نعناع طازج · لايم" },

      "canned-soft-drinks::pepsi can": { name: "بيبسي كانز" },
      "canned-soft-drinks::7up can": { name: "بيبسي 7 اب كانز" },
      "canned-soft-drinks::mirinda can": { name: "بيبسي ميريندا كانز" },
      "canned-soft-drinks::pepsi mojito can": { name: "بيبسي موهيتو كانز" },
      "canned-soft-drinks::mountain dew can": { name: "ديو كانز" },
      "canned-soft-drinks::fayrouz pineapple": { name: "فيروز أناناس" },
      "canned-soft-drinks::birell can": { name: "بيريل كانز" },
      "canned-soft-drinks::v7 pink lemonade": { name: "V7 بينك ليمونيد" },
      "canned-soft-drinks::v7 flavor": { name: "V7 أطعم" },
      "canned-soft-drinks::v7 cola": { name: "V7 كولا" },
      "canned-soft-drinks::nescafé can": { name: "نسكافية كانز" },
      "canned-soft-drinks::rani juice": { name: "راني حبيبات" },

      "playstation::half hour": { name: "نص ساعة" },
      "playstation::full hour": { name: "ساعة" },

      "birthday::service": { name: "خدمة" },
      "birthday::person": { name: "فرد" },

      "cigarettes::marlboro": { name: "مالبورو" },
      "cigarettes::cleopatra": { name: "كليوبترا" },
      "cigarettes::cleopatra box": { name: "كليوبترا بوكس" },
      "cigarettes::merit yellow": { name: "ميريت أصفر" },
      "cigarettes::winston": { name: "وينستون" },
      "cigarettes::shamlan": { name: "شاملان" },
      "cigarettes::winston box": { name: "وينستون بوكس" },
      "cigarettes::master": { name: "ماستر" },
      "cigarettes::manchester": { name: "مانشستر" },
      "cigarettes::kent black": { name: "كنت بلاك" },
      "cigarettes::captain black green": { name: "كابتن بلاك أخضر" },

      "croissant::plain croissant": { name: "كرواسون سادة" },
      "croissant::cheese croissant": { name: "كرواسون بالجبنة" },
      "croissant::turkey cheese croissant": { name: "كرواسون بالتركي والجبنة" },

      "extras::shot": { name: "شوت إضافي" },
      "extras::sauce": { name: "صوص" },
      "extras::flavor": { name: "نكهة" },
      "extras::ice cream": { name: "آيس كريم" },
      "extras::honey": { name: "عسل" },
      "extras::whipped cream": { name: "كريمة مخفوقة" },
      "extras::nuts": { name: "مكسرات" },
      "extras::nutella": { name: "نوتيلا" },
      "extras::milk": { name: "لبن" },

      "tyt-beans::light roast": { name: "تحميص فاتح" },
      "tyt-beans::medium roast": { name: "تحميص وسط" },

      "sandwiches::cheese & tomato sandwich": { name: "سندوتش جبنة وطماطم" },
      "sandwiches::halawa & qishta sandwich": { name: "سندوتش حلاوة بالقشطة" },
      "sandwiches::cheese & luncheon sandwich": { name: "سندوتش جبنة ولانشون" },
      "sandwiches::roumy cheese sandwich": { name: "سندوتش جبنة رومي" },
      "sandwiches::halawa sandwich": { name: "سندوتش حلاوة قشطة" },

      "waffle-pancake::waffle": { name: "وافل" },
      "waffle-pancake::pancake (6 pieces)": { name: "بان كيك 6 قطع" },
      "waffle-pancake::pancake (12 pieces)": { name: "بان كيك 12 قطعة" },
      "waffle-pancake::pancake (24 pieces)": { name: "بان كيك 24 قطعة" },

      "food::shish tawook sandwich": { name: "سندوتش شيش طاووق" },
      "food::instant noodles (small)": { name: "اندومي جاهز صغير" },
      "food::instant noodles (large)": { name: "اندومي جاهز كبير" },
      "food::fruit salad": { name: "فروت سلاطة" },
      "food::fruit salad with ice cream": { name: "فروت سلاط ايس كريم" },
      "food::ice cream mix": { name: "ايس كريم ميكس" },
      "food::ice cream scoop": { name: "آيس كريم بولة" },
      "food::croissant hot dog": { name: "كرواسون هوت دوج" },
      "food::cream donut": { name: "دونتس كريم" },
      "food::nutella donut": { name: "دونتس نوتيلا" },
      "food::lotus donut": { name: "دونتس لوتس" },
      "food::raspberry danish": { name: "دانش راسبيري" },
      "food::blueberry danish": { name: "دانش بلوبيري" },
      "food::chocolate danish": { name: "دانش شوكولاتة" },
      "food::vanilla danish": { name: "دانش فانيليا" },

      "desserts::molten cake": { name: "مولتن كيك" },
      "desserts::cheesecake": { name: "تشيز كيك" },
      "desserts::chocolate fudge": { name: "شوكليت فادج" },
      "desserts::red velvet": { name: "ريد فيلفت" },

      "mochi::mochi (1 piece)": { name: "موتشي قطعة" },

      "suhoor::fuul (fava beans)": { name: "فول" },
      "suhoor::taameya (falafel)": { name: "طعمية" },
      "suhoor::fried potatoes": { name: "بطاطس" },
      "suhoor::eggs": { name: "بيض" },
      "suhoor::cheese": { name: "جبنة" },
      "suhoor::salad": { name: "سلطة" },
      "suhoor::pickled eggplant": { name: "باذنجان مخلل" },

      "shisha::moasel (single flavor)": { name: "معسل" },
      "shisha::fruit head shisha": { name: "شيشة فواكه" },
      "shisha::mix shisha": { name: "شيشة ميكس" },
      "shisha::clay head add-on": { name: "لاي طبي" }
    }
  };

  var BADGE_AR = { "new": "جديد", "best-seller": "⭐ الأكثر طلبًا", "popular": "الأكثر رواجًا" };
  var OFFER_BADGE_AR = { "SPECIAL OFFER": "عرض خاص", "LIMITED TIME": "لفترة محدودة" };
  var OFFER_CTA_AR = { "Order Now": "اطلب الآن", "View Offer": "شاهد العرض" };

  /* -----------------------------------------------------------------------
     STATE + CORE
  ----------------------------------------------------------------------- */
  var currentLang = "en";
  try { currentLang = localStorage.getItem(STORAGE_KEY) || "en"; } catch (e) {}

  function t(key) {
    var dict = STRINGS[currentLang] || STRINGS.en;
    return dict[key] != null ? dict[key] : (STRINGS.en[key] || key);
  }

  function applyStaticTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label")));
    });

    document.querySelectorAll(".lang-switch").forEach(function (group) {
      group.querySelectorAll(".lang-switch-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
      });
    });

    document.title = currentLang === "ar"
      ? "TYT – خد وقتك | كافيه ولاونج"
      : "TYT – Take Your Time | Coffee & Lounge";
  }

  function translateCategory(cat) {
    if (currentLang !== "ar") return cat;
    var tr = MENU_AR.categories[cat.id];
    if (!tr) return cat;
    var out = Object.assign({}, cat);
    if (tr.name) out.name = tr.name;
    if (tr.description) out.description = tr.description;
    return out;
  }

  function translateItem(catId, item) {
    if (currentLang !== "ar") return item;
    var out = Object.assign({}, item);
    // Prefer Arabic text saved per-item from the Admin Panel (works for
    // every item, including ones added after the printed menu). Fall back
    // to the bundled printed-menu translation dictionary, then to the
    // original English text if neither is available.
    var key = catId + "::" + String(item.name || "").trim().toLowerCase();
    var tr = MENU_AR.items[key];
    out.name = (item.nameAr && item.nameAr.trim()) || (tr && tr.name) || item.name;
    out.description = (item.descriptionAr && item.descriptionAr.trim()) || (tr && tr.description) || item.description;
    return out;
  }

  function translateBadgeLabel(key) {
    if (currentLang === "ar" && BADGE_AR[key]) return BADGE_AR[key];
    return null; // let main.js fall back to its own English label map
  }

  function translateOfferField(kind, value) {
    if (currentLang !== "ar" || !value) return value;
    if (kind === "badge") return OFFER_BADGE_AR[value] || value;
    if (kind === "cta") return OFFER_CTA_AR[value] || value;
    return value;
  }

  function itemCountLabel(count) {
    if (currentLang === "ar") {
      return count === 1 ? "صنف واحد" : (count + " " + t("menu.items"));
    }
    return count + " " + (count === 1 ? t("menu.item") : t("menu.items"));
  }

  function setLanguage(lang) {
    lang = lang === "ar" ? "ar" : "en";
    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    applyStaticTranslations();
    if (typeof window.TYT_rerenderMenu === "function") {
      window.TYT_rerenderMenu();
    }
  }

  function initSwitchers() {
    document.querySelectorAll(".lang-switch-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLanguage(btn.getAttribute("data-lang"));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    applyStaticTranslations();
    initSwitchers();
  });

  window.TYT_I18N = {
    t: t,
    getLang: function () { return currentLang; },
    setLanguage: setLanguage,
    applyStaticTranslations: applyStaticTranslations,
    translateCategory: translateCategory,
    translateItem: translateItem,
    translateBadgeLabel: translateBadgeLabel,
    translateOfferField: translateOfferField,
    itemCountLabel: itemCountLabel
  };
})();
