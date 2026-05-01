import { useState } from "react";

import SEO, { breadcrumbSchema } from "../components/SEO";

const posts = [
  {
    id: 1,
    author: "Sardor Raximov",
    handle: "@sardortech",
    category: "Texnologiya",
    title: "Texnologiya blogeri bo'lishning haqiqiy yuzini ko'rsataman",
    excerpt:
      "450K obunachiга yetguncha nima qildim, qanday xatolar qildim va texnologiya nishida qanday o'zingni ajratib ko'rsatasan — bularni ochiq gapirib beraman.",
    date: "8 aprel, 2025",
    readTime: "5 daqiqa",
    content: `Texnologiya — O'zbekistonda eng tez o'sayotgan content nishi. Ammo aynan shu sababli raqobat ham juda kuchli. Mening 450K ga yetishim baxtiyor tasodif emas edi.

Boshida men ham barcha qiladigan xatoni qildim — har narsani bir vaqtda qamrab olmoqchi bo'ldim. Telefon sharhlari, kompyuter o'yinlari, dasturlash darslari, yangiliklar... Natija? Hech kim meni aniq bir narsa uchun kuzatmasdi.

**Burilish nuqtasi**

Bir kuni o'zim uchun savol qo'ydim: "Odamlar menga qaysi bir savolni eng ko'p berishadi?" Javob oddiy edi — "Qaysi smartfon olsam bo'ladi?" Shundan boshlab faqat shu yo'nalishga fokuslandim.

Texnologiya nishida eng muhim narsa — ishonch. Tomoshabin sizni ko'rganda "bu odam biladiyu" degan his bo'lishi kerak. Buning uchun siz haqiqatan bilishingiz kerak, tashqaridan emas, ichkaridan.

**Yangi boshlovchilarga maslahatim**

Texnologiya kontenti qimmat — qurilmalar sotib olish, sinash, qaytarish. Lekin aksar test qurilmalarni kompaniyalar o'zlari yuboradi, agar siz ularning auditoriyasiga loyiq bo'lsangiz. O'sha darajaga yetguncha o'z cho'ntagingizdan qilasiz — buni hisobga oling.

Eng katta afzallik: texnologiya hech qachon to'xtamaydi. Har hafta yangi narsa chiqadi, har hafta yangi kontent bor.`,
  },
  {
    id: 2,
    author: "Nilufar Hasanova",
    handle: "@nilufarlife",
    category: "Lifestyle",
    title:
      "Lifestyle blogger bo'lish — bu 'hamma narsani' ko'rsatish degani emas",
    excerpt:
      "Ko'pchilik lifestyle — bu shunchaki hayotingni suratga olish deb o'ylaydi. Men ham shunday o'ylagandim. 320K obunachidan keyin esa haqiqatni bildim.",
    date: "5 aprel, 2025",
    readTime: "4 daqiqa",
    content: `Lifestyle nishi — blogerlik dunyosidagi eng aldamchi yo'nalish. Nega? Chunki u "hamma uchun" ko'rinadi, aslida esa "hech kim uchun" bo'lib qolish xavfi katta.

Men boshlaganimda Instagram lentamda chiroyli kafe, kiyim-kechak va sayohat suratlari bor edi. Odamlar like bosardi. Ammo obunachilar esa o'smadi.

**Lifestyle nishi aslida nima?**

Bu sizning hayot falsafangiz. Siz qanday hayot kechirasiz va nima uchun shu tarzda? Tomoshabin sizni kuzatib, "men ham shunday yashagim keladi" degan his olishi kerak. Bu mahsulot reklama emas, qiymat namoyishi.

Mening auditoriyam o'sgan payt — men "ertalabki 5 daqiqam" seriyasini boshlaganimda. Hech qanday filter yo'q, hech qanday mukammal muhit yo'q. Shunchaki haqiqiy lahza.

**Eng ko'p so'raladigan savol**

"Nilufar, siz hamma narsani ko'rsatasizmi?" — Yo'q. Aynan nima ko'rsatmasligingizni bilish — bu ham strategiya. Auditoriya sizga ishonadi, chunki siz ulardan hech narsani yashirmayotgandek his qilishadi. Ammo chegaralar bor.

Lifestyle blogeri bo'lmoqchi bo'lsangiz, avval o'zingizning hayot falsafangizni aniq bilib oling. Shundan keyin kontent o'zi keladi.`,
  },
  {
    id: 3,
    author: "Kamola Ergasheva",
    handle: "@kamola_beauty",
    category: "Go'zallik",
    title:
      "Beauty blogger bo'lish: brendlar sizni topgunga qadar nima qilish kerak?",
    excerpt:
      "Har bir beauty blogger bir kun brendlar bilan ishlashni orzu qiladi. Men 280K ga yetguncha shu yo'lni bosib o'tdim — hammasini aytaman.",
    date: "3 aprel, 2025",
    readTime: "6 daqiqa",
    content: `Go'zallik nishi — O'zbekistondagi eng raqobatli blogerlik yo'nalishlaridan biri. Har kuni yangi beauty blogger paydo bo'ladi. Ammo brendlar faqat bir nechtasini tanlaydi. Nima uchun?

Men 2021-yilda boshlaganimda mahalliy brendlarning ham e'tiboriga tushish uchun 8 oy kutdim. O'sha 8 oy davomida hech kim meni kuzatmayotgandek his qilardim. Lekin o'sha davr mening eng muhim davrim bo'ldi.

**O'sha davrda nima qildim?**

Brendsiz kontentni toptim. O'zim sotib olgan mahsulotlarni halol ko'rsatdim — yaxshisini ham, yomonini ham. "Bu mahsulot menga to'g'ri kelmadi" deyishdan qo'rqmadim. Auditoriya shu halollikni sevdi.

**Brendlar qachon yozadi?**

Brendlar siz bilan shartnoma tuzishdan oldin sizning auditoriyangizni emas — engagement'ingizni tekshiradi. 10K obunachilik 80K dan ko'proq ta'sirli bo'lishi mumkin, agar engagement yuqori bo'lsa.

Mening birinchi brendim mahalliy kosmetika kompaniyasi edi. Katta pul emas. Ammo portfolio. O'sha portfolio keyingi kattaroq brendga eshik ochdi.

**Beauty nishida uzoq qolish uchun**

Trend quvlamaslik kerak. Har hafta yangi "viral" mahsulot chiqadi. Agar har biriga yugurasangiz, o'z ovozingizni yo'qotasiz. Siz kim ekansiz — shu aniq bo'lishi kerak.`,
  },
  {
    id: 4,
    author: "Ulugbek Nazarov",
    handle: "@foody_uz",
    category: "Ovqat",
    title: "Food blogger bo'lish: faqat taom emas, hikoya sotasiz",
    excerpt:
      "Suratga olish qiyin. Yoritish qiyin. Ammo eng qiyini — har bir taomdan hikoya yasash. Bu sirni bilganlar food nishida uzoq qoladi.",
    date: "1 aprel, 2025",
    readTime: "5 daqiqa",
    content: `Food blogerlik — ko'rinishidan eng oson, amalda esa eng ko'p mahorat talab qiladigan nishlardan biri. Taom sovib qolmasdan suratga olish, yoritishni to'g'rilash, keyin yeyish — bu ish.

Men 195K ga yetdim, ammo birinchi yil davomida mening contentim shunchaki taom suratlari edi. Yaxshi suratlar. Lekin xolos. O'sish yo'q edi.

**Burilish: hikoya qo'shish**

Bir kuni men onamning oshxonasida non pishirishini kuzatdim. Shu jarayonni — yo'qotilgan retsept, uning tarixi, bir necha avloddan o'tib kelishi — barchani ko'rsatdim. O'sha video mening eng ko'p ko'rilgan kontentim bo'ldi.

Odamlar taomni ko'rish uchun emas, taom ortidagi his uchun kuzatadi.

**Food nishida amaliy maslahatlar**

Yorug'lik — hammadan muhim. Tabiiy yorug'lik yaxshi kameradan ko'ra yaxshiroq natija beradi. Mahalliy taomlar — bu sizning eng kuchli qurolngiz. Xalqaro bloggerlar lagmon, shurva, somsa haqida sizcha bilmaydi. Bu ustunlikdan foydalaning.

Restoran bilan hamkorlik erta bosqichda ham mumkin — pul emas, bepul taom evaziga. Bu ham boshlanish.`,
  },
  {
    id: 5,
    author: "Meliqoziyev Jorabek",
    handle: "@jorabek_travel",
    category: "Sport",
    title: "15 million obunachilik: sport blogeri bo'lishda mening formulam",
    excerpt:
      "O'zbekistondagi eng yirik sport blogerlaridan biri sifatida bir narsani aniq aytaman: kattalik sabr va tizimlilikdan keladi, iqtidordan emas.",
    date: "29 mart, 2025",
    readTime: "7 daqiqa",
    content: `15 million. Bu raqam ko'p odamga katta tuyuladi. Menga ham shunday tuyulardi, boshlaganimda. Ammo bu raqam bir kunda kelmadi — 6 yil davomida, har kuni ishlash orqali keldi.

Sport nishi — O'zbekistonda juda katta auditoriyaga ega. Futbol, boks, kurash, fitness — odamlar sport kontentini sevadi. Ammo ko'pchilik yuzaki qoladi.

**Mening farqim nima edi?**

Men sport haqida emas, sportchilar haqida gaplardim. Natija emas, jarayon. Chempion bo'lgan payt emas, chempion bo'lishga harakat qilgan payt. O'sha ichki kurash — odamlarni jalb qiladi.

**Katta bloger bo'lishning haqiqiy narxi**

Ko'pchilik meni ko'rib "oson ko'rinadi" deydi. Ammo ular birinchi 2 yilni ko'rmagan. O'sha davr — har kuni kontent, hech qanday daromad yo'q, oila "bu nima ish?" deb so'raydi. O'sha davrdan o'tish — bu haqiqiy test.

**Sport nishida nimaga e'tibor bering?**

Faqat g'alaba emas, mag'lubiyatni ham ko'rsating. Odamlar mukammal sportchi emas, haqiqiy insonni kuzatishni yaxshi ko'radi. Va O'zbek auditoriyasi uchun — mahalliy sport, mahalliy qahramonlar. Buni hech kim chetdan qila olmaydi.`,
  },
  {
    id: 6,
    author: "Diyorbek Yuldashev",
    handle: "@diyorbek_music",
    category: "Musiqa",
    title: "Musiqa blogeri: tinglovchini qanday o'zingga bog'laysan?",
    excerpt:
      "Musiqa haqida gapirish — bu shunchaki qo'shiq tavsiya qilish emas. 800K odamni bir joyga to'plash uchun menga boshqa narsa kerak bo'ldi.",
    date: "27 mart, 2025",
    readTime: "5 daqiqa",
    content: `Musiqa nishi — O'zbekistonda o'ziga xos. Chunki bizning auditoriyamiz musiqa haqida suhbatga tayyor emas degan fikr bor edi. Men bu fikrni noto'g'ri ekanini isbotladim.

Boshida men ham shunchaki "yaxshi qo'shiqlar" ro'yxatlari qilardim. Odamlar eshitardi, ketardi. Hech qanday bog'liqlik yo'q edi.

**O'zgarish qachon keldi?**

Men musiqani tahlil qilishni boshlaganimda. "Nima uchun bu qo'shiq sizni yig'latadi?" — shu savolni qo'yganimda, kontent boshqacha bo'lib ketdi. Odamlar his-tuyg'ularini tushuntirib bergan kishi uchun qaytib keladi.

**Musiqa nishida raqobat haqiqati**

Bu nishda taqlid juda ko'p. Kimdir mashhur format topsa, o'nlab kanallar bir oyda o'xshashini chiqaradi. Bundan qo'rqmang — auditoriya haqiqiy ovozni soxtadan ajratadi.

Mening ovozim: O'zbek musiqasini xalqaro kontekstda ko'rsatish. "Bizning musiqa ham jahon darajasida" — bu xabarni uzatish. Auditoriya bu g'ururni his qildi va yopishib oldi.

**Yangi blogerlarga bitta maslahat**

Musiqa blogerligida eng katta xato — hamma musiqani yoqtirmoqchi bo'lish. Yo'q. Siz muxlis emas, mutaxasssissiz. Ba'zan "bu yaxshi emas" deyish kerak. Ishonch shundan quriladi.`,
  },
  {
    id: 7,
    author: "Gulnora Karimova",
    handle: "@gulnora_fashion",
    category: "Lifestyle",
    title: "Fashion blogger bo'lish: kiyim emas, identifikatsiya sotasiz",
    excerpt:
      "250K obunachiim meni kiyim uchun kuzatmaydi. Ular o'zlarini men orqali ko'radi. Bu tushunchani olguncha ko'p vaqt ketdi.",
    date: "24 mart, 2025",
    readTime: "6 daqiqa",
    content: `Fashion blogerlik — bu kiyim namoyishi emas. Bu hayot tarzini, o'zini ifodalashni ko'rsatish. Men buni tushungunimcha 1 yil o'tdi.

Boshida men har kuni yangi kiyim kiyib, suratga tushardim. Auditoriya o'smadi. Chunki ular menga emas, kiyimga qarardi. Men vosita edim, maqsad emas.

**O'zgarish nuqtasi**

Men bir kuni "bir hafta faqat 5 ta kiyim bilan qanday turli ko'rinishlar yarataman?" seriyasini boshladim. Bu mening fikrlashimni ko'rsatdi. Odamlar kiyimni emas, mening yondashuvimni ko'rishni xohlashlarini bildim.

**Fashion nishida brendlar bilan ishlash**

Fashion nishida brendlar ko'p, ammo hamkorlik qilish uchun ular sizdan bir narsa so'raydi: sizning auditoriyangiz kim? 250K umumiy obunachi emas — 250K aniq demografiya. Brendlar shu aniqlikni xohlaydi.

Mening auditoriyam: 22-35 yoshli, o'rta daromadli, stil haqida o'ylayotgan ayollar. Bu aniqlik — mening kuchim.

**Uzoq muddatli strategiya**

Trend kiyimlar — qisqa muddatli oqim. Klassik stil — uzoq muddatli ishonch. Men ikkinchisini tanladim. Shu sababli brendlar bir martali post emas, doimiy hamkorlikka keladi.`,
  },
  {
    id: 8,
    author: "Azizbek Qodirov",
    handle: "@azizbek_gaming",
    category: "Gaming",
    title:
      "O'zbek gaming kontenti: nima uchun biz hali potensialimizni ochmadik?",
    excerpt:
      "1.2M obunachilik bilan O'zbekistondagi gaming segmentini ko'raman. Va ochiq aytaman — biz hali 20% ni ishlatmoqdamiz.",
    date: "21 mart, 2025",
    readTime: "6 daqiqa",
    content: `O'zbekistonda gaming auditoriyasi — ulkan. Millionlab o'yinchi bor. Ammo ularni xizmat qiladigan mahalliy kontent — kam. Bu imkoniyat.

Men 1.2M ga yetdim, ammo bu raqam meni qoniqtirmaydi. Chunki auditoriya bor, kontent iste'moli bor, ammo sifatli O'zbek gaming kontenti hali yetishmaydi.

**Gaming nishida nima ishlaydi?**

Faqat o'yin ko'rsatish — endi yetarli emas. Twitch va YouTube gaming kanallarini to'lib ketdi. Farq qilish uchun shaxsiyat kerak. Tomoshabin o'yinni emas, sizni tomosha qilishi kerak.

Mening "shaxsiyatim" — tahlilchilik. Men o'ynayotganda nima va nima uchunni tushuntiraman. Auditoriya o'zini o'rgatilgandek his qiladi, shunchaki ko'rmaydi.

**Brendlar gaming nishida nima xohlaydi?**

Peripheral kompaniyalar, o'yin studiyalari, energy drink brendlari — bular gaming blogerlarining asosiy hamkorlari. Ammo ular faqat aniq auditoriyani xohlaydi.

**Kelajak qanday?**

O'zbekistonda esports rivojlanmoqda. Turnirlar ko'paymoqda. Bu gaming blogerlar uchun katta imkoniyat. Shu oqimni erta ushlagan blogerlar kelgusida katta o'yinchi bo'ladi.

Gaming nishi — endi o'yin emas, bu katta biznes.`,
  },
  {
    id: 9,
    author: "Shahnoza Yusupova",
    handle: "@shahnoza_travel",
    category: "Sayohat",
    title:
      "Sayohat blogeri: dunyoni ko'rish uchun pul yig'ish emas, pul topish",
    excerpt:
      "600K obunachiim bilan O'zbekistonda va dunyoda ko'p joyda bo'ldim. Ko'pchilik bilmagan sir: sayohat menga pul sarflatmaydi, pul toptiради.",
    date: "18 mart, 2025",
    readTime: "8 daqiqa",
    content: `Sayohat blogerligini ko'pchilik "boyman, sayohat qilaman" deb tushunadi. Haqiqat boshqacha. Men ham o'rta oiladan chiqdim. Va sayohat blogerlik menga sayohatni to'latmaydi — balki sayohat menga daromad keltiradi.

Bu teskari fikrlash — sayohat blogerligida muvaffaqiyatning kaliti.

**Qanday ishlaydi?**

Mehmonxonalar, aviakompaniyalar, turizm idoralari — ular content creatorlar bilan hamkorlik qiladi. Siz ularning joyini ko'rsatasiz, ular sizni bepul yoki to'lab joylashtiradi. Ammo bu faqat ma'lum darajadan keyin.

O'sha darajaga yetguncha nima qildim? O'zbekiston ichida ko'p joylar bor — Samarqand, Buxoro, Xiva, Termiz, Farg'ona... Bularni O'zbek va xorijiy ko'z bilan ko'rsatdim. Mahalliy turizm brendlari birinchi hamkorlarim bo'ldi.

**Sayohat nishida eng muhim narsa**

Odamlar joy haqida emas, o'sha joyda nima his qilganingiz haqida gapingizni eshitishni xohlaydi. "Katta shahar" emas — "bu ko'chada yurganingizda nimani his qilasiz". Hissiyot — bu sizning mahsulotingiz.

**Haqiqiy qiyinchilik**

Sayohat — doimiy harakat. Uy, oila, do'stlar — bulardan uzoq qolasiz. Kontent ham har doim yaxshi chiqmaydi. Lekin auditoriya bu haqiqiylikni sevadi.`,
  },
  {
    id: 10,
    author: "Bekzod Tursunov",
    handle: "@bekzod_education",
    category: "Ta'lim",
    title:
      "Ta'lim blogeri bo'lish: odamlar bilim uchun emas, natija uchun keladi",
    excerpt:
      "350K obunachiim ko'p narsani o'rgatdi. Eng muhimi: ular bilimni emas, o'zgarishni xohlaydi. Shu farqni bilish ta'lim kontentida hamma narsani o'zgartiradi.",
    date: "15 mart, 2025",
    readTime: "5 daqiqa",
    content: `Ta'lim nishi — eng mas'uliyatli blogerlik yo'nalishi deb o'ylayman. Chunki odamlar sizga vaqtlarini, ba'zan pullarini ham ishonib beradi. Va ular natija kutadi.

Men boshida akademik kontent qilardim. To'g'ri, to'liq, lekin zerikarli. Odamlar ko'rardi va ketardi. O'zgarish yo'q.

**Tushuncha qachon o'zgardi?**

Men shaxsiy tajribamni qo'shganimda. "Qanday qilib 3 oyda ingliz tilini yaxshiladim" — bu "ingliz tili grammatikasi" dan ko'ra ko'proq ko'rildi. Chunki birinchisida ular meni ko'rdi, ikkinchisida faqat ma'lumot.

**Ta'lim kontentida asosiy xato**

Juda ko'p ma'lumot, juda kam harakat. Tomoshabin dars ko'rgach nima qilishni bilishi kerak — bugun, hozir. Agar kontent ko'rilgach "qiziqarli edi" deb yopilsa — bu muvaffaqiyatsizlik. "Qilaman" deb yopilsa — bu g'alaba.

**Brendlar bilan hamkorlik**

Ta'lim platformalari, kurslar, kitoblar — bular ta'lim blogerlarining tabiiy hamkorlari. Ammo ular sizdan bir narsa so'raydi: sizning auditoriyangiz harakatlanadimi?

350K obunachimning 40% i mening tavsiyamdan keyin biror narsani sinab ko'rganini aytgan. Bu raqam — mening eng katta aktivim.`,
  },
  {
    id: 11,
    author: "Salohiddin Mirzakbarov",
    handle: "@salohiddin_fitness",
    category: "Sport",
    title: "Fitness bloger: 900K obunachilik meni qanday o'zgartirdi?",
    excerpt:
      "Fitness kontenti ko'p. Ammo 900K ga yetgan fitness bloger kam. Mening yo'lim to'g'ri chiqdi, ammo xatolar ham bo'ldi — barchasini aytaman.",
    date: "12 mart, 2025",
    readTime: "6 daqiqa",
    content: `Fitness nishi — O'zbekistonda eng tez o'sayotgan blogerlik segmentlaridan biri. Ammo shu bilan birga, eng ko'p noto'g'ri ma'lumot tarqaladigan joy.

Men 900K ga yetdim. Ammo bu yo'lda bir nechta marta noto'g'ri yo'lga kirdim.

**Birinchi yil: faqat natija ko'rsatish**

Boshida men faqat o'zgarishlarni ko'rsatardim — "oldin-keyin". Odamlar yoqtiardi. Ammo bu yuzaki edi. Ko'pchilik natijani ko'rgan, ammo yo'lni tushunmagan.

**O'zgarish: jarayonni ochiq qilish**

Men kundalik trening va ovqatlanishimni real ko'rsata boshladim. Og'riq, charchoq, xohlamaslik — bularni ham. Auditoriya "bu ham insoncha ekan" deb yaqinlashdi.

**Fitness nishida mas'uliyat**

Bu nishda siz faqat bloger emas, namuna bo'lasiz. Sertifikat, bilim, to'g'ri ma'lumot — bular shart. Ko'pchilik fitness blogger noto'g'ri maslahat beradi va odam zarar ko'radi. Men bu mas'uliyatni har doim his qilaman.

**Brendlar bilan ishlash**

Sport oziqlanish, kiyim, jihozlar brendlari — bular fitness blogerning asosiy hamkorlari. Ammo ular faqat o'z mahsulotini foydalanadigan blogerlar bilan ishlashni xohlaydi. Soxta ishlatsam — auditoriya biladi.`,
  },
  {
    id: 12,
    author: "Salimov Asadbek",
    handle: "@asadbek_gamer",
    category: "Gaming",
    title: "Yosh gaming bloger: 500K ga yetishda mening 3 ta asosiy qoidam",
    excerpt:
      "20 yoshda 500K — bu baxtiyor tasodif emas. Menda 3 ta qoida bor, shu qoidalar meni o'stirdi.",
    date: "9 mart, 2025",
    readTime: "4 daqiqa",
    content: `Men gaming blogeringga kirganimda 17 yoshda edim. Ko'pchilik "bu o'yin, katta bo'lganingda boshqa narsa qilasan" dedi. Men esa bu nishni kasb sifatida qabul qildim.

500K — bu raqam menga 3 yil davomida, har kuni kontent qilish orqali keldi. Qoida yo'q edi, ammo uch narsa har doim ishladi.

**Birinchi qoida: doimiylik iqtidordan kuchli**

Haftada 3 ta video — bu mening minimumim. Yaxshimi, yomonmi, kayfiyat boriymi yo'qmi. Algoritm doimiy kontentni sevadi. Va auditoriya kutishni o'rganadi.

**Ikkinchi qoida: o'yin tanlovida qat'iy bo'l**

Men bitta o'yinda ustamanning: Valorant. Barcha o'yinlarni bir oz o'ynash emas — bitta o'yinda haqiqiy mutaxassis bo'lish. Auditoriya sizni "Valorant bo'yicha" tanishi kerak.

**Uchinchi qoida: jamoa**

Gaming nishida hamkorlik — bu raqobat emas. Boshqa gaming blogerlari bilan birgalikda o'ynash, ularning auditoriyasiga chiqish — bu eng tez o'sish usuli. Men o'sishimning 30% ini hamkorlik orqali qildim.

Yosh blogerlar uchun gap: yosh — bu muammo emas, afzallik. Siz o'z avlodingiz tilida gaplashасиз. Bu hech kimga o'rgatib bo'lmaydi.`,
  },
  {
    id: 13,
    author: "Doniyorov Ozodbek",
    handle: "@ozodbek_Teach",
    category: "Ta'lim",
    title: "Ta'lim kontenti: nima uchun 'foydali' kontent ko'rilmaydi?",
    excerpt:
      "300K obunachilik bilan ta'lim nishida bir haqiqatni aniq ko'raman: foydali kontent va qiziqarli kontent — bular bir xil emas.",
    date: "6 mart, 2025",
    readTime: "5 daqiqa",
    content: `"Bu kontent foydali edi" — eng xavfli maqtov. Chunki "foydali" va "ko'raman" o'rtasida katta farq bor.

Men ta'lim kontenti qilaman. 300K obunachiim bor. Ammo mening eng ko'p ko'rilgan videolarim eng "foydali" bo'lmaganlari edi. Bu paradoks — va men bu paradoksni hal qilishga 1 yil sarfladim.

**Muammo nimada?**

Odamlar foydali narsani bilishadi ular qilishlari kerakligini. Lekin ko'rish uchun qiziqish kerak. "5 ta foydali maslahat" — bu sarlavha emas. "Nima uchun men 2 yil vaqtimni behuda sarfladim" — bu sarlavha.

**Hissiyot + ma'lumot = kontent**

Ta'lim kontentida ikkala komponent kerak. Faqat hissiyot — bu ko'ngil ochar kontent. Faqat ma'lumot — bu darslik. Ikkalasi birgalikda — bu ta'sir qiladigan kontent.

**Nish ichida nish toping**

"Ta'lim" — juda keng. Men o'zimni "o'zbek yoshlari uchun real hayot ko'nikmalari" ga fokusladim. Bu aniqlik — mening identifikatsiyam.

Auditoriya sizni qandaydir narsaning mutaxassisi sifatida ko'rishi kerak. Hamma narsani o'rgataman — bu ishonchni kamaytiradi. Bir narsani yaxshi o'rgataman — bu ishonchni oshiradi.`,
  },
];

const categories = ["Barchasi", ...new Set(posts.map((p) => p.category))];
const PER_PAGE = 6;

function getInitials(name) {
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

const catColors = {
  Texnologiya: "bg-blue-50 text-blue-600",
  Lifestyle: "bg-pink-50 text-pink-600",
  "Go'zallik": "bg-rose-50 text-rose-600",
  Ovqat: "bg-yellow-50 text-yellow-700",
  Sport: "bg-green-50 text-green-600",
  Musiqa: "bg-purple-50 text-purple-600",
  Gaming: "bg-orange-50 text-orange-600",
  Sayohat: "bg-teal-50 text-teal-600",
  "Ta'lim": "bg-indigo-50 text-indigo-600",
};

const avatarColors = [
  "bg-red-100 text-red-700",
  "bg-yellow-100 text-yellow-700",
  "bg-red-200 text-red-800",
  "bg-yellow-200 text-yellow-800",
  "bg-orange-100 text-orange-700",
  "bg-amber-100 text-amber-700",
  "bg-red-50 text-red-600",
];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Barchasi");
  const [currentPage, setCurrentPage] = useState(1);
  const [openPost, setOpenPost] = useState(null);

  const filtered = posts.filter((p) => {
    const matchCat = activeFilter === "Barchasi" || p.category === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const handleFilter = (cat) => {
    setActiveFilter(cat);
    setCurrentPage(1);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <SEO
        title="Blog — Marketing va Reklama Maqolalari"
        description="Reklama, marketing va blogging bo'yicha foydali maqolalar va qo'llanmalar. O'zbekiston bozori uchun amaliy tavsiyalar va yangiliklar."
        canonical="/blogs"
        schema={breadcrumbSchema([{ name: "Bosh sahifa", path: "/" }, { name: "Blog", path: "/blogs" }])}
      />
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="10" cy="10" r="7" />
            <line x1="15" y1="15" x2="21" y2="21" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Maqola yoki muallif qidirish..."
            className="w-full pl-9 pr-4 py-2.5 border border-red-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-red-300"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeFilter === cat
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-red-500 border-red-200 hover:bg-red-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-20 text-red-200 text-lg">
          Hech narsa topilmadi
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((post) => (
            <ArticleCard
              key={post.id}
              post={post}
              colorIndex={posts.indexOf(post) % avatarColors.length}
              onClick={() => setOpenPost(post)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-sm disabled:opacity-30 hover:bg-red-50 transition"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                currentPage === p
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-red-500 border-red-200 hover:bg-red-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-sm disabled:opacity-30 hover:bg-red-50 transition"
          >
            →
          </button>
        </div>
      )}

      {openPost && (
        <ArticleModal
          post={openPost}
          colorIndex={posts.indexOf(openPost) % avatarColors.length}
          onClose={() => setOpenPost(null)}
        />
      )}
    </section>
  );
}

function ArticleCard({ post, colorIndex, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:border-red-200 transition-all group"
    >
      <div className="h-1.5 bg-red-600 w-full" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColors[post.category] || "bg-gray-100 text-gray-500"}`}
          >
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.readTime}</span>
        </div>
        <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[colorIndex]}`}
            >
              {getInitials(post.author)}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 leading-none">
                {post.author}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{post.date}</p>
            </div>
          </div>
          <span className="text-red-500 text-xs font-medium group-hover:translate-x-1 transition-transform inline-block">
            O'qish →
          </span>
        </div>
      </div>
    </div>
  );
}

function ArticleModal({ post, colorIndex, onClose }) {
  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[colorIndex]}`}
            >
              {getInitials(post.author)}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {post.author}
            </span>
            <span className="text-gray-300 text-xs">{post.handle}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 transition font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">
          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${catColors[post.category] || "bg-gray-100 text-gray-500"}`}
          >
            {post.category}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-400 mb-6 flex items-center gap-2">
            <span>{post.readTime}</span>
            <span>·</span>
            <span>{post.date}</span>
          </p>
          <div className="flex flex-col gap-4 text-gray-700 text-sm leading-relaxed">
            {paragraphs.map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return (
                  <h4
                    key={i}
                    className="text-base font-bold text-gray-900 mt-2"
                  >
                    {para.replace(/\*\*/g, "")}
                  </h4>
                );
              }
              if (para.includes("**")) {
                const parts = para.split(/\*\*(.*?)\*\*/g);
                return (
                  <p key={i}>
                    {parts.map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className="text-gray-900 font-semibold">
                          {part}
                        </strong>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                );
              }
              return <p key={i}>{para}</p>;
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="text-sm text-red-600 border border-red-200 px-5 py-2 rounded-xl hover:bg-red-50 transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
