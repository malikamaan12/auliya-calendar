import type { LangCode } from "./i18n";

type NonEnLang = Exclude<LangCode, "en">;
export type PhraseRow = Record<NonEnLang, string>;

/**
 * Comprehensive 10-Language UI Phrase & Term Dictionary
 * Order: ur, ar, ro_ur, hi, tr, bn, fa, id, fr
 */
function row(
  ur: string,
  ar: string,
  ro_ur: string,
  hi: string,
  tr: string,
  bn: string,
  fa: string,
  id: string,
  fr: string
): PhraseRow {
  return { ur, ar, ro_ur, hi, tr, bn, fa, id, fr };
}

export const UI_PHRASES: Record<string, PhraseRow> = {
  // Common Actions & Navigation
  "Back": row("واپس", "رجوع", "Wapas", "वापस", "Geri", "পিছনে", "بازگشت", "Kembali", "Retour"),
  "Home": row("مرکز", "الرئيسية", "Home", "मुख्य पृष्ठ", "Ana Sayfa", "হোম", "خانه", "Beranda", "Accueil"),
  "More": row("مزید", "المزيد", "Mazeed", "अधिक", "Daha Fazla", "আরও", "بیشتر", "Lainnya", "Plus"),
  "Open": row("کھولیں", "فتح", "Kholein", "खोलें", "Aç", "খুলুন", "باز کردن", "Buka", "Ouvrir"),
  "Close": row("بند کریں", "إغلاق", "Band Karein", "बंद करें", "Kapat", "বন্ধ করুন", "بستن", "Tutup", "Fermer"),
  "Save": row("محفوظ کریں", "حفظ", "Save Karein", "सहेजें", "Kaydet", "সংরক্ষণ", "ذخیره", "Simpan", "Enregistrer"),
  "Saved": row("محفوظ شدہ", "تم الحفظ", "Mehfooz", "सहेजा गया", "Kaydedildi", "সংরক্ষিত", "ذخیره شد", "Tersimpan", "Enregistré"),
  "Cancel": row("منسوخ", "إلغاء", "Cancel", "रद्द करें", "İptal", "বাতিল", "انصراف", "Batal", "Annuler"),
  "Reset": row("دوبارہ ترتیب", "إعادة ضبط", "Reset", "रीसेट", "Sıfırla", "রিসেট", "بازنشانی", "Atur Ulang", "Réinitialiser"),
  "Delete": row("حذف کریں", "حذف", "Delete", "हटाएं", "Sil", "মুছে ফেলুন", "حذف", "Hapus", "Supprimer"),
  "Edit": row("ترمیم", "تعديل", "Edit", "संपादित करें", "Düzenle", "সম্পাদনা", "ویرایش", "Ubah", "Modifier"),
  "Add": row("شامل کریں", "إضافة", "Shamil Karein", "जोड़ें", "Ekle", "যোগ করুন", "افزودن", "Tambah", "Ajouter"),
  "Search": row("تلاش کریں", "بحث", "Talash", "खोजें", "Ara", "অনুসন্ধান", "جستجو", "Cari", "Rechercher"),
  "Clear": row("صاف کریں", "مسح", "Saaf Karein", "साफ़ करें", "Temizle", "মুছুন", "پاک کردن", "Bersihkan", "Effacer"),
  "Copy": row("کاپی", "نسخ", "Copy", "कॉपी", "Kopyala", "কপি", "کپی", "Salin", "Copier"),
  "Copied": row("کاپی ہو گیا", "تم النسخ", "Copy Ho Gaya", "कॉपी हो गया", "Kopyalandı", "কপি হয়েছে", "کپی شد", "Tersalin", "Copié"),
  "Copied!": row("کاپی ہو گیا!", "تم النسخ!", "Copy Ho Gaya!", "कॉपी हो गया!", "Kopyalandı!", "কপি হয়েছে!", "کپی شد!", "Tersalin!", "Copié !"),
  "Share": row("شیئر کریں", "مشاركة", "Share Karein", "साझा करें", "Paylaş", "শেয়ার", "اشتراک‌گذاری", "Bagikan", "Partager"),
  "Play": row("تلاوت سنیں", "تشغيل", "Sunein", "चलाएं", "Oynat", "চালু করুন", "پخش", "Putar", "Lire"),
  "Pause": row("روکیں", "إيقاف مؤقت", "Rokein", "रोकें", "Duraklat", "বিরতি", "مکث", "Jeda", "Pause"),
  "Stop": row("بند کریں", "إيقاف", "Rokein", "रोकें", "Durdur", "থামান", "توقف", "Berhenti", "Arrêter"),
  "Next": row("اگلا", "التالي", "Agla", "अगला", "Sonraki", "পরবর্তী", "بعدی", "Berikutnya", "Suivant"),
  "Previous": row("پچھلا", "السابق", "Pichla", "पिछला", "Önceki", "পূর্ববর্তী", "قبلی", "Sebelumnya", "Précédent"),
  "Continue": row("جاری رکھیں", "متابعة", "Jari Rakhein", "जारी रखें", "Devam Et", "চালিয়ে যান", "ادامه", "Lanjutkan", "Continuer"),
  "Go": row("جائیں", "انتقال", "Jayein", "जाएं", "Git", "যান", "برو", "Buka", "Aller"),
  "All": row("تمام", "الكل", "Tamam", "सभी", "Tümü", "সব", "همه", "Semua", "Tout"),
  "Today": row("آج", "اليوم", "Aaj", "आज", "Bugün", "আজ", "امروز", "Hari Ini", "Aujourd'hui"),
  "Completed": row("مکمل", "مكتمل", "Mukammal", "पूर्ण", "Tamamlandı", "সম্পন্ন", "تکمیل شد", "Selesai", "Terminé"),
  "Active": row("فعال", "نشط", "Fa'al", "सक्रिय", "Aktif", "সক্রিয়", "فعال", "Aktif", "Actif"),
  "Pending": row("زیرِ غور", "قيد المراجعة", "Pending", "लंबित", "Beklemede", "অপেক্ষমাণ", "در انتظار", "Menunggu", "En attente"),
  "Published": row("شائع شدہ", "منشور", "Published", "प्रकाशित", "Yayında", "প্রকাশিত", "منتشر شده", "Terbit", "Publié"),
  "Bookmarks": row("نشان زدہ", "المحفوظات", "Bookmarks", "बुकमार्क", "Yer İmleri", "বুকমার্ক", "نشان‌شده‌ها", "Markah", "Favoris"),
  "Settings": row("ترتیبات", "الإعدادات", "Settings", "सेटिंग्स", "Ayarlar", "সেটিংস", "تنظیمات", "Pengaturan", "Paramètres"),
  "Loading": row("لوڈ ہو رہا ہے…", "جار التحميل…", "Load ho raha hai…", "लोड हो रहा है…", "Yükleniyor…", "লোড হচ্ছে…", "در حال بارگذاری…", "Memuat…", "Chargement…"),
  "Refresh": row("تازہ کریں", "تحديث", "Refresh", "रीफ़्रेश", "Yenile", "রিফ্রেশ", "بروزرسانی", "Segarkan", "Actualiser"),
  "Details": row("تفصیل", "التفاصيل", "Tafseel", "विवरण", "Detaylar", "বিস্তারিত", "جزئیات", "Detail", "Détails"),
  "Overview": row("جائزہ", "نظرة عامة", "Jaiza", "अवलोकन", "Genel Bakış", "সারসংক্ষেপ", "نمای کلی", "Ringkasan", "Aperçu"),
  "Enter": row("داخل ہوں", "دخول", "Dakhil Hon", "प्रवेश करें", "Gir", "প্রবেশ", "ورود", "Masuk", "Entrer"),

  // Prayer Names & Times
  "Fajr": row("فجر", "الفجر", "Fajr", "फ़ज्र", "İmsak / Sabah", "ফজর", "فجر", "Subuh", "Fajr"),
  "Sunrise": row("طلوعِ آفتاب", "الشروق", "Tulu-e-Aftab", "सूर्योदय", "Güneş", "সূর্যোদয়", "طلوع آفتاب", "Terbit", "Lever du soleil"),
  "Dhuhr": row("ظہر", "الظهر", "Zuhr", "ज़ुहर", "Öğle", "যোহর", "ظهر", "Dzuhur", "Dhuhr"),
  "Asr": row("عصر", "العصر", "Asr", "अस्र", "İkindi", "আসর", "عصر", "Ashar", "Asr"),
  "Asr (Mithlayn)": row("عصر (مثلین)", "العصر (المثلين)", "Asr (Mithlayn)", "अस्र (मिसलैन)", "İkindi (Asr-ı Sânî)", "আসর (মিসলাইন)", "عصر (مثلین)", "Ashar (Hanafi)", "Asr (Hanafite)"),
  "Maghrib": row("مغرب", "المغرب", "Maghrib", "मग़रिब", "Akşam", "মাগরিব", "مغرب", "Maghrib", "Maghrib"),
  "Isha": row("عشاء", "العشاء", "Isha", "इशा", "Yatsı", "এশা", "عشاء", "Isya", "Isha"),
  "Jumu'ah": row("جمعہ", "الجمعة", "Jumu'ah", "जुमुआ", "Cuma", "জুমুআ", "جمعه", "Jumat", "Joumou'a"),
  "Witr": row("وتر واجب", "الوتر", "Witr Wajib", "वित्र वाजिब", "Vitir", "বিতর", "وتر", "Witir", "Witr"),
  "Tahajjud": row("تہجد", "التهجد", "Tahajjud", "तहज्जुद", "Teheccüd", "তাহাজ্জুদ", "تهجد", "Tahajud", "Tahajjud"),
  "Ishraq": row("اشراق", "الإشراق", "Ishraq", "इशराक़", "İşrak", "ইশরাক", "اشراق", "Isyraq", "Ishraq"),
  "Chasht (Duha)": row("چاشت (ضحیٰ)", "الضحى", "Chasht (Duha)", "चाश्त (दुहा)", "Kuşluk (Duha)", "চাশত (দুহা)", "چاشت (ضحی)", "Dhuha", "Duha"),
  "Awwabin": row("اوابین", "الأوابين", "Awwabin", "अव्वाबीन", "Evvâbîn", "আওয়াবিন", "اوابین", "Awwabin", "Awwabin"),
  "Sehri": row("سحری", "السحور", "Sehri", "सहरी", "Sahur", "সেহরি", "سحری", "Sahur", "Suhoor"),
  "Sehri Ends": row("ختمِ سحری", "انتهاء السحور", "Khatm-e-Sehri", "सहरी समाप्त", "İmsak Vakti", "সেহরি শেষ", "پایان سحری", "Imsak", "Fin du Suhoor"),
  "Iftar": row("افطار", "الإفطار", "Iftar", "इफ़्तार", "İftar", "ইফতার", "افطار", "Buka Puasa", "Iftar"),
  "Zawal": row("زوال", "الزوال", "Zawal", "ज़वाल", "Kerahat (İstiva)", "যাওয়াল", "زوال", "Zawal", "Zawal"),
  "With Jamaat": row("باجماعت", "مع الجماعة", "Ba-Jamaat", "जमाअत के साथ", "Cemaatle", "জামাতের সাথে", "با جماعت", "Berjamaah", "En congrégation"),
  "Jamaat": row("باجماعت", "جماعة", "Jamaat", "जमाअत", "Cemaat", "জামাত", "جماعت", "Jamaah", "Congrégation"),
  "On Time": row("بروقت", "في الوقت", "Waqt Par", "समय पर", "Vaktinde", "সময়মতো", "در وقت", "Tepat Waktu", "À l'heure"),
  "Qaza": row("قضا", "قضاء", "Qaza", "क़ज़ा", "Kaza", "কাযা", "قضا", "Qadha", "Qada"),
  "Unlogged": row("درج نہیں", "غير مسجل", "Darj Nahin", "दर्ज नहीं", "Kaydedilmedi", "অলিখিত", "ثبت نشده", "Belum Dicatat", "Non noté"),
  "Azan": row("اذان", "الأذان", "Azan", "अज़ान", "Ezan", "আজান", "اذان", "Adzan", "Adhan"),
  "Qibla": row("قبلہ", "القبلة", "Qibla", "क़िबला", "Kıble", "কিবলা", "قبله", "Kiblat", "Qibla"),
  "Qibla Compass": row("سمتِ قبلہ کمپاس", "بوصلة القبلة", "Qibla Compass", "क़िबला कंपास", "Kıble Pusulası", "কিবলা কম্পাস", "قطب‌نمای قبله", "Kompas Kiblat", "Boussole Qibla"),
  "Prayer Schedule": row("اوقاتِ نماز", "مواقيت الصلاة", "Auqat-e-Namaz", "नमाज़ का समय", "Namaz Vakitleri", "নামাজের সময়সূচি", "اوقات نماز", "Jadwal Shalat", "Horaires de Prière"),
  "Qaza-e-Umri": row("قضائے عمری", "قضاء الفوائت", "Qaza-e-Umri", "क़ज़ा-ए-उम्री", "Kaza Namazları", "কাযায়ে উমরি", "قضای عمری", "Qadha Shalat", "Prières Manquées"),
  "Location & Timezone": row("مقام اور ٹائم زون", "الموقع والمنطقة الزمنية", "Maqam & Timezone", "स्थान व समय क्षेत्र", "Konum ve Saat Dilimi", "অবস্থান ও টাইমজোন", "مکان و منطقه زمانی", "Lokasi & Zona Waktu", "Lieu & Fuseau"),
  "Use Live GPS": row("لائیو جی پی ایس استعمال کریں", "استخدام الموقع المباشر", "Live GPS Istemal Karein", "लाइव GPS उपयोग करें", "Canlı Konumu Kullan", "লাইভ জিপিএস ব্যবহার করুন", "مکان‌یابی زنده", "Gunakan GPS Langsung", "Utiliser le GPS"),
  "Use Live GPS & Timezone": row("لائیو مقام اور وقت تلاش کریں", "تحديد الموقع تلقائياً", "Live GPS & Timezone", "लाइव GPS व समय क्षेत्र", "Canlı GPS ve Saat Dilimi", "লাইভ জিপিএস ও টাইমজোন", "مکان‌یابی خودکار", "Gunakan GPS & Zona Waktu", "Localisation GPS"),
  "Detecting GPS…": row("مقام تلاش کیا جا رہا ہے…", "جار تحديد الموقع…", "GPS talash ho raha hai…", "GPS खोजा जा रहा है…", "Konum bulunuyor…", "জিপিএস খোঁজা হচ্ছে…", "در حال مکان‌یابی…", "Mendeteksi GPS…", "Localisation…"),

  // Fiqh Categories & Rulings
  "Fard": row("فرض", "فرض", "Farz", "फ़र्ज़", "Farz", "ফরজ", "فرض", "Fardhu", "Fard"),
  "Wajib": row("واجب", "واجب", "Wajib", "वाजिब", "Vacip", "ওয়াজিব", "واجب", "Wajib", "Wajib"),
  "Sunnah Mu'akkadah": row("سنتِ مؤکدہ", "سنة مؤكدة", "Sunnat-e-Mu'akkadah", "सुन्नत मुअक्कदा", "Sünnet-i Müekkede", "সুন্নাতে মুয়াক্কাদা", "سنت مؤکده", "Sunnah Muakkadah", "Sunna Mou'akkada"),
  "Sunnah Ghayr Mu'akkadah": row("سنتِ غیر مؤکدہ", "سنة غير مؤكدة", "Sunnat Ghayr Mu'akkadah", "सुन्नत ग़ैर मुअक्कदा", "Sünnet-i Gayri Müekkede", "সুন্নাতে গায়রে মুয়াক্কাদা", "سنت غیر مؤکده", "Sunnah Ghairu Muakkadah", "Sunna Non-Mou'akkada"),
  "Mustahabb": row("مستحب", "مستحب", "Mustahab", "मुस्तहब", "Müstehap", "মুস্তাহাব", "مستحب", "Mustahab", "Moustahabb"),
  "Nafl": row("نفل", "نفل", "Nafl", "नफ़्ल", "Nafile", "নফল", "نفل", "Sunnah Nafilah", "Nafl"),
  "Wudu": row("وضو", "الوضوء", "Wuzu", "वुज़ू", "Abdest", "ওযু", "وضو", "Wudhu", "Ablutions (Wudu)"),
  "Ghusl": row("غسل", "الغسل", "Ghusl", "ग़ुस्ल", "Gusül", "গোসল", "غسل", "Mandi Wajib", "Ghusl"),
  "Tayammum": row("تیمم", "التيمم", "Tayammum", "तयम्मुम", "Teyemmüm", "তায়াম্মুম", "تیمم", "Tayamum", "Tayammum"),

  // Quran Module Phrases
  "Surah": row("سورۃ", "السورة", "Surah", "सूरह", "Sûre", "সূরা", "سوره", "Surah", "Sourate"),
  "Para": row("پارہ", "الجزء", "Para", "पारा", "Cüz", "পারা", "جزء", "Juz", "Juz"),
  "Page": row("صفحہ", "الصفحة", "Safha", "पृष्ठ", "Sayfa", "পৃষ্ঠা", "صفحه", "Halaman", "Page"),
  "Meccan": row("مکی", "مكية", "Makki", "मक्की", "Mekkî", "মাক্কী", "مکی", "Makkiyah", "Mecquoise"),
  "Medinan": row("مدنی", "مدنية", "Madani", "मदनी", "Medenî", "মাদানী", "مدنی", "Madaniyah", "Médinoise"),
  "Medinian": row("مدنی", "مدنية", "Madani", "मदनी", "Medenî", "মাদানী", "مدنی", "Madaniyah", "Médinoise"),
  "Verses": row("آیات", "آيات", "Aayaat", "आयतें", "Âyet", "আয়াত", "آیات", "Ayat", "Versets"),
  "Translation": row("ترجمہ", "الترجمة", "Tarjuma", "अनुवाद", "Meal", "অনুবাদ", "ترجمه", "Terjemahan", "Traduction"),
  "Transliteration": row("تلفظ", "النطق", "Talaffuz", "लिप्यंतरण", "Okunuş", "উচ্চারণ", "تلفظ", "Transliterasi", "Translittération"),
  "Audio Recitation": row("تلاوتِ قرآن", "التلاوة الصوتية", "Tilawat Audio", "तिलावत ऑडियो", "Sesli Tilavet", "তিলাওয়াত অডিও", "تلاوت صوتی", "Murottal Audio", "Récitation Audio"),
  "Mushaf Page": row("صفحۂ مصحف", "صفحة المصحف", "Mushaf Safha", "मुसहफ़ पृष्ठ", "Mushaf Sayfası", "মুসহাফ পৃষ্ঠা", "صفحه مصحف", "Halaman Mushaf", "Page du Moushaf"),
  "Sajda Verses": row("آیاتِ سجدہ", "آيات السجدة", "Aayaat-e-Sajda", "सजदा आयतें", "Secde Âyetleri", "সিজদার আয়াত", "آیات سجده", "Ayat Sajdah", "Versets de Prosternation"),
  "Wajib Sajda": row("سجدۂ تلاوت واجب", "سجدة تلاوة واجبة", "Wajib Sajda", "वाजिब सजदा", "Vacip Tilavet Secdesi", "ওয়াজিব সিজদা", "سجده واجب", "Sajdah Wajib", "Prosternation Wajib"),

  // Tasbih & Duas Phrases
  "Tasbih Counter": row("تسبیح کاؤنٹر", "عداد التسبيح", "Tasbih Counter", "तस्बीह काउंटर", "Tesbih Sayacı", "তাসবিহ কাউন্টার", "شمارنده تسبیح", "Penghitung Tasbih", "Compteur Tasbih"),
  "Daily Dhikr": row("روزانہ اذکار", "أذكار اليوم", "Rozana Azkar", "दैनिक ज़िक्र", "Günlük Zikirler", "দৈনিক যিকির", "اذکار روزانه", "Dzikir Harian", "Dhikr Quotidien"),
  "Checklist": row("معمولات فہرست", "قائمة الأوراد", "Mamoolat Checklist", "दिनचर्या सूची", "Çetele", "তালিকা", "برنامه روزانه", "Daftar Amalan", "Liste Quotidienne"),
  "Dua of the Day": row("آج کی دعا", "دعاء اليوم", "Aaj Ki Dua", "आज की दुआ", "Günün Duası", "আজকের দোয়া", "دعای روز", "Doa Hari Ini", "Doua du Jour"),
  "Dua Finder": row("دعا تلاش کریں", "باحث الأدعية", "Dua Finder", "दुआ खोजें", "Dua Rehberi", "দোয়া অনুসন্ধান", "جستجوی دعا", "Pencari Doa", "Recherche de Douas"),
  "Action Duas": row("مسنون دعائیں", "أدعية المناسبات", "Masnoon Duayein", "मसनून दुआएं", "Günlük Dualar", "মাসনুন দোয়া", "دعاهای مسنون", "Doa Sehari-hari", "Douas du Quotidien"),
  "Target": row("ہدف", "الهدف", "Hadaf", "लक्ष्य", "Hedef", "লক্ষ্য", "هدف", "Target", "Objectif"),
  "Save Session": row("تسبیح محفوظ کریں", "حفظ الجلسة", "Session Save Karein", "सत्र सहेजें", "Oturumu Kaydet", "সংরক্ষণ করুন", "ذخیره جلسه", "Simpan Sesi", "Enregistrer la session"),
  "Reminders": row("یاد دہانی", "التذكيرات", "Yad-dihani", "रिमाइंडर", "Hatırlatıcılar", "রিমাইন্ডার", "یادآورها", "Pengingat", "Rappels"),

  // Auliya & Ziyarat Phrases
  "Biography": row("سوانحِ حیات", "السيرة المباركة", "Sawaneh Hayat", "जीवनी", "Hayatı", "জীবনী", "زندگی‌نامه", "Biografi", "Biographie"),
  "Shajrah": row("شجرۂ طیبہ", "الشجرة المباركة", "Shajrah-e-Tayyiba", "शजरा शरीफ़", "Silsile-i Şerif", "শাজরা শরিফ", "شجره‌نامه", "Sanad Silsilah", "Lignée Spirituelle"),
  "Spiritual Lineage": row("سلسلہ و شجرہ", "السلسلة الروحية", "Silsila & Shajrah", "रूहानी सिलसिला", "Manevî Silsile", "আধ্যাত্মিক সিলসিলা", "سلسله طریقت", "Silsilah Ruhani", "Lignée Spirituelle"),
  "360° Ziyarat": row("۳۶۰° زیارت", "زيارة ٣٦٠°", "360° Ziyarat", "360° ज़ियारत", "360° Ziyaret", "৩৬০° জিয়ারত", "زیارت ۳۶۰ درجه", "Ziarah 360°", "Ziyarat 360°"),
  "World Map": row("عالمی نقشۂ مزارات", "خريطة المقامات", "World Shrine Map", "दरगाह मानचित्र", "Türbeler Haritası", "মাজার মানচিত্র", "نقشه مزارات", "Peta Makam", "Carte des Sanctuaires"),
  "Gallery": row("تصاویر", "معرض الصور", "Tasaveer", "गैलरी", "Galeri", "গ্যালারি", "نگارخانه", "Galeri", "Galerie"),
  "Media": row("بیانات و کلام", "المرئيات والصوتيات", "Media & Kalam", "वीडियो व ऑडियो", "Medya", "মিডিয়া", "رسانه", "Media", "Médias"),
  "Books": row("تصانیف و کتب", "المؤلفات والكتب", "Kutub & Tasanif", "किताबें", "Eserler", "কিতাবসমূহ", "تألیفات", "Kitab Karya", "Ouvrages"),
  "Annual Urs": row("سالانہ عرس", "الحولية المباركة", "Salana Urs", "सालाना उर्स", "Vuslat Günü", "বার্ষিক ওরস", "عرس سالانه", "Haul Tahunan", "Urs Annuel"),

  // Fiqh & Hadith Module Phrases
  "Hadith Library": row("کتبِ حدیث", "مكتبة الحديث", "Kutub-e-Hadith", "हदीस पुस्तकालय", "Hadis Külliyatı", "হাদিস গ্রন্থাগার", "کتابخانه حدیث", "Pustaka Hadis", "Bibliothèque de Hadiths"),
  "All Hadith Books": row("تمام کتبِ حدیث", "جميع كتب الحديث", "Tamam Kutub-e-Hadith", "सभी हदीस किताबें", "Tüm Hadis Kitapları", "সকল হাদিস গ্রন্থ", "تمام کتب حدیث", "Semua Kitab Hadis", "Tous les Livres de Hadiths"),
  "Prayer Method": row("طریقۂ نماز", "صفة الصلاة", "Tariqa-e-Namaz", "नमाज़ का तरीक़ा", "Namaz Rehberi", "নামাজের পদ্ধতি", "آموزش نماز", "Tata Cara Shalat", "Méthode de Prière"),
  "Hanafi Fiqh": row("فقہِ حنفی (بہارِ شریعت)", "الفقه الحنفي", "Fiqh-e-Hanafi", "हनफ़ी फ़िक़्ह", "Hanefî Fıkhı", "হানাফি ফিকহ", "فقه حنفی", "Fiqih Hanafi", "Fiqh Hanafite"),
  "Sunnah Playbooks": row("سنتِ نبوی ﷺ", "السنن النبوية", "Sunnat-e-Nabawi", "सुन्नत तरीक़े", "Sünnet Rehberi", "সুন্নাহ গাইড", "سنت‌های نبوی", "Panduan Sunnah", "Guides de la Sunna"),
  "Brothers": row("اسلامی بھائی", "للرجال", "Islami Bhai", "पुरुषों के लिए", "Erkekler", "পুরুষদের নিয়ম", "آقایان", "Laki-laki", "Hommes"),
  "Sisters": row("اسلامی بہنیں", "للنساء", "Islami Behnein", "महिलाओं के लिए", "Hanımlar", "মহিলাদের নিয়ম", "بانوان", "Perempuan", "Femmes"),

  // Sahib-e-Ilm Quiz Phrases
  "Start Challenge": row("مقابلہ شروع کریں", "ابدأ المسابقة", "Muqabla Shuru Karein", "क्विज़ शुरू करें", "Yarışmayı Başlat", "কুইজ শুরু করুন", "شروع مسابقه", "Mulai Kuis", "Commencer le Quiz"),
  "Fastest Finger First": row("سب سے تیز جواب", "الأسرع إجابة", "Sab Se Tez Jawab", "सबसे तेज़ जवाब", "En Hızlı Cevap", "দ্রুততম উত্তর", "سریع‌ترین پاسخ", "Jawab Tercepat", "Réponse Rapide"),
  "Lifelines": row("مددگار ذرائع", "وسائل المساعدة", "Lifelines", "लाइफ़लाइन", "Jokerler", "লাইফলাইন", "کمک‌ها", "Bantuan", "Jokers"),
  "Score": row("پوائنٹس", "النقاط", "Score", "स्कोर", "Puan", "স্কোর", "امتیاز", "Skor", "Score"),
  "Correct!": row("درست جواب!", "إجابة صحيحة!", "Durust Jawab!", "सही जवाब!", "Doğru Cevap!", "সঠিক উত্তর!", "پاسخ صحیح!", "Benar!", "Bonne réponse !"),
  "Play Again": row("دوبارہ کھیلیں", "العب مجدداً", "Dobara Khelein", "फिर से खेलें", "Tekrar Oyna", "আবার খেলুন", "بازی مجدد", "Main Lagi", "Rejouer"),

  // Zakat, Fitrah & Ushr Phrases
  "Zakat Calculator": row("زکوٰۃ کیلکولیٹر", "حاسبة الزكاة", "Zakat Calculator", "ज़कात कैलकुलेटर", "Zekât Hesaplayıcı", "যাকাত ক্যালকুলেটর", "محاسبه‌گر زکات", "Kalkulator Zakat", "Calculateur de Zakat"),
  "Hawl & Payments": row("حول اور ادائیگی", "الحول والمدفوعات", "Hawl & Adaigi", "हौल और भुगतान", "Havelân-ı Havl ve Ödemeler", "বর্ষপূর্তি ও পরিশোধ", "سال خمسی/زکات و پرداخت‌ها", "Haul & Pembayaran", "Hawl & Paiements"),
  "Fitrah & Fidyah": row("صدقۂ فطر و فدیہ", "صدقة الفطر والفدية", "Sadqa-e-Fitr & Fidyah", "सदक़ा-ए-फ़ित्र व फ़िदया", "Fitre ve Fidye", "সদকাতুল ফিতর ও ফিদইয়া", "زکات فطره و فدیه", "Zakat Fitrah & Fidyah", "Fitrah & Fidyah"),
  "Ushr & Rulings": row("عشر اور فقہی مسائل", "العشر والأحكام", "Ushr & Masail", "उश्र व मसाइल", "Öşür ve Hükümler", "উশর ও মাসায়েল", "عشر و احکام", "Usyur & Hukum", "Oushr & Règles"),
  "Above Nisab": row("صاحبِ نصاب", "فوق النصاب", "Sahib-e-Nisab", "साहिब-ए-निसाब", "Nisap Üzeri", "সাহেবে নিসাব", "واجد نصاب", "Wajib Zakat (Nisab)", "Au-dessus du Nisab"),
  "Below Nisab": row("نصاب سے کم", "دون النصاب", "Nisab Se Kam", "निसाब से कम", "Nisap Altı", "নিসাবের নিচে", "کمتر از نصاب", "Di Bawah Nisab", "Sous le Nisab"),
  "Net Zakatable Wealth": row("قابلِ زکوٰۃ مالیت", "صافي المال الزكوي", "Qabil-e-Zakat Maal", "ज़कात योग्य संपत्ति", "Net Zekât Malı", "যাকাতযোগ্য নিট সম্পদ", "دارایی خالص مشمول زکات", "Harta Bersih Wajib Zakat", "Patrimoine Zakatable Net"),
  "Zakat Due": row("واجب الادا زکوٰۃ", "الزكاة الواجبة", "Wajib-ul-Ada Zakat", "देय ज़कात", "Ödenecek Zekât", "প্রদেয় যাকাত", "زکات واجب", "Zakat yang Harus Dibayar", "Zakat Due"),
  "Gold": row("سونا", "الذهب", "Sona", "सोना", "Altın", "স্বর্ণ", "طلا", "Emas", "Or"),
  "Silver": row("چاندی", "الفضة", "Chandi", "चांदी", "Gümüş", "রৌপ্য", "نقره", "Perak", "Argent"),
  "Cash & Bank": row("نقد رقم و بینک", "النقد والحسابات البنكية", "Naqad & Bank", "नकद और बैंक", "Nakit ve Banka", "নগদ ও ব্যাংক", "وجه نقد و بانک", "Tunai & Bank", "Espèces & Banque"),

  // Family Barsi & Fatiha Phrases
  "Marhumeen": row("مرحومین", "المرحومون", "Marhumeen", "मरहूमीन", "Merhumlar", "মরহুমগণ", "مرحومین", "Almarhum", "Défunts"),
  "30-Para Khatm": row("۳۰ پارہ ختمِ قرآن", "ختمة ٣٠ جزءاً", "30-Para Khatm", "30 पारा ख़त्म", "30 Cüz Hatim", "৩০ পারা খতম", "ختم ۳۰ جزء", "Khataman 30 Juz", "Khatm 30 Juz"),
  "Method of Fatiha": row("طریقۂ فاتحہ", "طريقة الفاتحة وإيصال الثواب", "Tariqa-e-Fatiha", "फ़ातिहा का तरीक़ा", "Fatiha ve İthaf Usulü", "ফাতিহা পাঠের নিয়ম", "روش فاتحه‌خوانی", "Tata Cara Tahlil & Fatihah", "Méthode de la Fatiha"),
  "Send Fatiha Gift": row("ایصالِ ثواب ہدیہ کریں", "إهداء ثواب الفاتحة", "Isal-e-Sawab Bhejein", "ईसाल-ए-सवाब भेजें", "Fatiha Hediye Et", "ঈসালে সওয়াব পাঠান", "اهدای ثواب فاتحه", "Kirim Hadiah Fatihah", "Offrir une Fatiha"),
  "+ Add Family Barsi": row("+ خاندانی برسی شامل کریں", "+ إضافة ذكرى وفاة", "+ Family Barsi Shamil Karein", "+ पारिवारिक बरसी जोड़ें", "+ Vefat Günü Ekle", "+ পারিবারিক বার্ষিকী যোগ", "+ افزودن سالگرد", "+ Tambah Haul Keluarga", "+ Ajouter une Commémoration"),
  "+ Add Urs / Saint": row("+ عرس یا بزرگ شامل کریں", "+ إضافة مولد أو ولي", "+ Urs / Buzurg Shamil Karein", "+ उर्स / बुज़ुर्ग जोड़ें", "+ Evliya / Vuslat Ekle", "+ ওরস / ওলি যোগ", "+ افزودن عرس یا ولی", "+ Tambah Haul / Wali", "+ Ajouter un Saint / Urs"),

  // Studio, Roles & Account Phrases
  "Super Admin": row("سرپرستِ اعلیٰ", "المدير العام", "Super Admin", "सुपर एडमिन", "Baş Yönetici", "সুপার অ্যাডমিন", "مدیر ارشد", "Super Admin", "Super Admin"),
  "Scholar Editor": row("عالم ایڈیٹر", "محرر شرعي", "Scholar Editor", "आलिम एडिटर", "Âlim Editör", "আলেম সম্পাদক", "ویراستار علمی", "Editor Ulama", "Éditeur Savant"),
  "Curator / Creator": row("مرتب و خادم", "مساهم وموثق", "Curator / Khadim", "क्यूरेटर", "İçerik Üretici", "সংগ্রাহক", "مشارکت‌کننده", "Kurator", "Contributeur"),
  "Community Member": row("رکنِ محفل", "عضو المنصة", "Member", "सदस्य", "Üye", "সদস্য", "عضو", "Anggota", "Membre"),
  "Full Name": row("مکمل نام", "الاسم الكامل", "Mukammal Naam", "पूरा नाम", "Ad Soyad", "পূর্ণ নাম", "نام کامل", "Nama Lengkap", "Nom Complet"),
  "City": row("شہر", "المدينة", "Shehar", "शहर", "Şehir", "শহর", "شهر", "Kota", "Ville"),
  "Email Address": row("ای میل پتہ", "البريد الإلكتروني", "Email Address", "ईमेल पता", "E-posta Adresi", "ইমেইল ঠিকানা", "نشانی ایمیل", "Alamat Email", "Adresse E-mail"),
  "Password": row("پاس ورڈ", "كلمة المرور", "Password", "पासवर्ड", "Şifre", "পাসওয়ার্ড", "رمز عبور", "Kata Sandi", "Mot de passe"),

  // Seeded Daily Quests
  "Complete All 5 Fard Prayers": row(
    "پانچوں فرض نمازیں ادا کریں",
    "أداء الصلوات الخمس المفروضة",
    "Paanchon Farz Namazein Ada Karein",
    "पांचों फ़र्ज़ नमाज़ें अदा करें",
    "5 Vakit Farz Namazı Tamamla",
    "পাঁচ ওয়াক্ত ফরজ নামাজ আদায় করুন",
    "اقامه هر پنج نماز فرض",
    "Tunaikan 5 Shalat Fardhu",
    "Accomplir les 5 Prières Obligatoires"
  ),
  "Log Fajr, Dhuhr, Asr, Maghrib & Isha today": row(
    "آج فجر، ظہر، عصر، مغرب اور عشاء کی تکمیل درج کریں",
    "سجل الفجر والظهر والعصر والمغرب والعشاء اليوم",
    "Aaj Fajr, Zuhr, Asr, Maghrib aur Isha darj karein",
    "आज फ़ज्र, ज़ुहर, अस्र, मग़रिब और इशा दर्ज करें",
    "Bugün Sabah, Öğle, İkindi, Akşam ve Yatsı namazlarını kaydet",
    "আজ ফজর, যোহর, আসর, মাগরিব ও এশা নথিভুক্ত করুন",
    "ثبت نمازهای فجر، ظهر، عصر، مغرب و عشاء امروز",
    "Catat Subuh, Dzuhur, Ashar, Maghrib & Isya hari ini",
    "Noter Fajr, Dhuhr, Asr, Maghrib et Isha aujourd'hui"
  ),
  "Recite 100 Salawat & Adhkar": row(
    "۱۰۰ مرتبہ درود و اذکار پڑھیں",
    "قراءة ١٠٠ من الصلاة على النبي ﷺ والأذكار",
    "100 Martaba Durood o Azkar Parhein",
    "100 बार दुरूद व अज़कार पढ़ें",
    "100 Salavat ve Zikir Çek",
    "১০০ বার দরুদ ও যিকির পাঠ করুন",
    "قرائت ۱۰۰ صلوات و ذکر",
    "Baca 100 Shalawat & Dzikir",
    "Réciter 100 Salawat & Invocations"
  ),
  "Reach 100 beads on the Smart Tasbih Studio": row(
    "تسبیح میں ۱۰۰ دانے مکمل کریں",
    "أكمل ١٠٠ حبة في المسبحة الرقمية",
    "Tasbih mein 100 daane mukammal karein",
    "तस्बीह में 100 दाने पूरे करें",
    "Tesbih sayacında 100 adede ulaş",
    "তাসবিহ কাউন্টারে ১০০ পূর্ণ করুন",
    "تکمیل ۱۰۰ دانه در تسبیح",
    "Capai 100 butir di Tasbih Digital",
    "Atteindre 100 grains sur le Tasbih"
  ),
  "Recite 10 Blessed Verses": row(
    "۱۰ مبارکہ آیات کی تلاوت کریں",
    "تلاوة ١٠ آيات مباركة",
    "10 Mubarak Aayaat Ki Tilawat Karein",
    "10 मुबारक आयतों की तिलावत करें",
    "10 Mübarek Âyet Oku",
    "১০টি পবিত্র আয়াত তিলাওয়াত করুন",
    "تلاوت ۱۰ آیه مبارکه",
    "Tilawah 10 Ayat Suci",
    "Réciter 10 Versets Bénis"
  ),
  "Read Mushaf pages with Kanzul Iman translation": row(
    "ترجمہ کنز الایمان کے ساتھ قرآنِ مجید پڑھیں",
    "اقرأ صفحات المصحف مع الترجمة والتفسير",
    "Tarjuma Kanzul Iman ke saath Mushaf parhein",
    "कन्ज़ुल ईमान अनुवाद के साथ मुसहफ़ पढ़ें",
    "Kenzü'l-İman mealiyle Mushaf sayfalarını oku",
    "কানযুল ঈমান অনুবাদসহ মুসহাফ পাঠ করুন",
    "مطالعه مصحف همراه با ترجمه کنزالایمان",
    "Baca halaman Mushaf dengan terjemahan Kanzul Iman",
    "Lire le Moushaf avec la traduction Kanzul Iman"
  ),
  "Revive 3 Masnoon Sunnahs": row(
    "۳ مسنون سنتیں زندہ کریں",
    "إحياء ٣ سنن نبوية مباركة",
    "3 Masnoon Sunnatein Zinda Karein",
    "3 मसनून सुन्नतों पर अमल करें",
    "3 Sünnet-i Seniyyeyi İhya Et",
    "৩টি মাসনুন সুন্নাহ আমল করুন",
    "احیای ۳ سنت نبوی",
    "Amalkan 3 Sunnah Nabi ﷺ",
    "Raviver 3 Sunnas Prophétiques"
  ),
  "Check off Sunnah Rak'ats or Daily Sunnah Playbooks": row(
    "سنن و نوافل یا روزمرہ سنتوں پر عمل کریں",
    "أتمم السنن الرواتب أو آداب اليوم والليلة",
    "Sunnat Rakaat ya rozmarra Sunnaton par amal karein",
    "सुन्नत रकात या दैनिक सुन्नत पूरी करें",
    "Sünnet rekâtlarını veya günlük sünnetleri tamamla",
    "সুন্নাহ রাকাত বা দৈনিক সুন্নাহ সম্পন্ন করুন",
    "انجام رکعات سنت یا آداب روزانه",
    "Lengkapi shalat Sunnah atau amalan harian",
    "Accomplir les prières Sunna ou les pratiques du jour"
  ),
  "Gift Isal-e-Sawab Fatiha": row(
    "مرحومین کو ایصالِ ثواب ہدیہ کریں",
    "إهداء ثواب الفاتحة للمرحومين",
    "Marhumeen Ko Isal-e-Sawab Bhejein",
    "मरहूमीन को ईसाल-ए-सवाब भेजें",
    "Merhumlara Fatiha Hediye Et",
    "মরহুমদের জন্য ঈসালে সওয়াব পাঠান",
    "اهدای ثواب فاتحه به مرحومین",
    "Kirim Fatihah untuk Almarhum",
    "Offrir la récompense d'une Fatiha"
  ),
  "Dedicate Surah Fatiha or Durood to Marhumeen": row(
    "مرحومین کے لیے سورۂ فاتحہ یا درود شریف پڑھیں",
    "أهدِ سورة الفاتحة أو الصلاة على النبي ﷺ للأموات",
    "Marhumeen ke liye Surah Fatiha ya Durood parhein",
    "मरहूमीन के लिए सूरह फ़ातिहा या दुरूद पढ़ें",
    "Geçmişlerin ruhuna Fatiha veya Salavat bağışla",
    "মরহুমদের রুহের মাগফিরাতে সূরা ফাতিহা বা দরুদ পড়ুন",
    "قرائت سوره فاتحه یا صلوات برای گذشتگان",
    "Hadiahkan Surah Al-Fatihah atau Shalawat",
    "Dédier Sourate Al-Fatiha ou Salawat aux défunts"
  ),

  // Inner Module Exact Tab & Control Labels
  "Biography & Timeline": row("سوانح و حالات", "السيرة والتاريخ", "Sawaneh & Tareekh", "जीवनी व इतिहास", "Hayatı ve Kronoloji", "জীবনী ও সময়রেখা", "زندگی‌نامه و گاه‌شمار", "Biografi & Linimasa", "Biographie & Chronologie"),
  "Details & Gallery": row("مزار و تصاویر", "المقام والصور", "Mazar & Tasaveer", "विवरण व गैलरी", "Türbe ve Galeri", "মাজার ও গ্যালারি", "جزئیات و نگارخانه", "Detail & Galeri", "Détails & Galerie"),
  "360° Virtual Ziyarat": row("۳۶۰° ورچوئل زیارت", "زيارة افتراضية ٣٦٠°", "360° Ziyarat", "360° ज़ियारत", "360° Sanal Ziyaret", "৩৬০° জিয়ারত", "زیارت مجازی ۳۶۰°", "Ziarah Virtual 360°", "Ziyarat Virtuel 360°"),
  "Video & Documentary": row("دستاویزی بیان و کلام", "مرئيات ووثائقيات", "Video & Bayan", "वीडियो व बयान", "Video ve Belgesel", "ভিডিও ও প্রামাণ্যচিত্র", "ویدیو و مستند", "Video & Dokumenter", "Vidéo & Documentaire"),
  "Shajrah-e-Tayyibah": row("شجرۂ طیبہ", "الشجرة الطيبة", "Shajrah-e-Tayyibah", "शजरा-ए-तय्यिबा", "Silsile-i Tayyibe", "শাজরায়ে তাইয়্যিবা", "شجره طیبه", "Sanad Silsilah", "Lignée Spirituelle"),
  "Books & Malfuzat": row("تصانیف و ملفوظات", "المؤلفات والملفوظات", "Kutub & Malfuzat", "किताबें व मलफ़ूज़ात", "Eserler ve Sohbetler", "কিতাব ও মালফুজাত", "کتب و ملفوظات", "Kitab & Malfuzat", "Ouvrages & Paroles"),
  "Live Maps & Urs": row("نقشۂ مزار و عرس", "الخريطة والحوليات", "Naqsha & Urs", "मानचित्र व उर्स", "Harita ve Vuslat", "মানচিত্র ও ওরস", "نقشه و عرس", "Peta & Haul", "Carte & Urs"),
  "Day": row("دن", "نهار", "Din", "दिन", "Gündüz", "দিন", "روز", "Siang", "Jour"),
  "Golden": row("شفق", "غروب", "Shafaq", "संध्या", "Gün Batımı", "গোধূলি", "غروب طلایی", "Senja", "Crépuscule"),
  "Night": row("رات", "ليل", "Raat", "रात", "Gece", "রাত", "شب", "Malam", "Nuit"),

  // Tasbih Inner Tabs
  "Today's Dua (Learn Daily)": row("آج کی مسنون دعا", "دعاء اليوم", "Aaj Ki Dua", "आज की दुआ", "Günün Duası", "আজকের দোয়া", "دعای امروز", "Doa Hari Ini", "Doua du Jour"),
  "Dua Finder & Actions": row("مسنون دعائیں تلاش کریں", "الأدعية والمناسبات", "Dua Finder", "दुआ संग्रह", "Dua Rehberi", "দোয়া অনুসন্ধান", "جستجوی دعاها", "Pencari Doa", "Recherche de Douas"),
  "Daily Checklist": row("روزانہ معمولات", "أوراد اليوم", "Rozana Mamoolat", "दैनिक सूची", "Günlük Çetele", "দৈনিক আমল", "برنامه روزانه", "Daftar Amalan", "Liste Quotidienne"),
  "Custom Dhikr Creator": row("ذاتی ذکر بنائیں", "إنشاء ورد خاص", "Apna Zikr Banayein", "निजी ज़िक्र बनाएं", "Özel Zikir Oluştur", "নিজস্ব যিকির তৈরি", "ساخت ذکر شخصی", "Buat Dzikir Sendiri", "Créer un Dhikr"),
  "Morning Adhkar & Istighfar": row("صبح کے اذکار و استغفار", "أذكار الصباح والاستغفار", "Subah Ke Azkar", "सुबह के अज़कार", "Sabah Zikirleri", "সকালের যিকির", "اذکار صبحگاهی", "Dzikir Pagi", "Invocations du Matin"),
  "Evening Durood-e-Razawiyya": row("شام کا درودِ رضویہ", "الصلاة الرضوية مساءً", "Shaam Ka Durood", "शाम का दुरूद", "Akşam Salavatı", "সন্ধ্যার দরুদ", "صلوات شامگاهی", "Shalawat Sore", "Salawat du Soir"),
  "Before Sleep Tasbih-e-Fatima": row("سونے سے پہلے تسبیحِ فاطمہ", "تسبيح السيدة فاطمة عند النوم", "Sone Se Pehle Tasbih-e-Fatima", "सोने से पहले तस्बीह-ए-फ़ातिमा", "Uyku Öncesi Tesbih-i Fatıma", "ঘুমানোর আগে তাসবিহে ফাতিমা", "تسبیحات حضرت فاطمه پیش از خواب", "Tasbih Fatimah Sebelum Tidur", "Tasbih de Fatima avant de dormir"),

  // Fiqh & Hadith Inner Tabs
  "Prayer Method (Namaz)": row("طریقۂ نماز", "صفة الصلاة", "Tariqa-e-Namaz", "नमाज़ का तरीक़ा", "Namaz Rehberi", "নামাজের পদ্ধতি", "آموزش نماز", "Tata Cara Shalat", "Méthode de Prière"),
  "Hanafi Fiqh (Masa'il)": row("فقہِ حنفی (مسائل)", "الفقه الحنفي", "Fiqh-e-Hanafi", "हनफ़ी मसाइल", "Hanefî Fıkhı", "হানাফি ফিকহ", "مسائل فقه حنفی", "Masail Fiqih Hanafi", "Règles Hanafites"),
  "16-Step Salah Walkthrough": row("نماز کے ۱۶ مراحل", "خطوات الصلاة الـ ١٦", "Namaz Ke 16 Marahil", "नमाज़ के 16 चरण", "16 Adımda Namaz", "১৬ ধাপে নামাজ", "۱۶ مرحله نماز", "16 Langkah Shalat", "Prière en 16 Étapes"),
  "All 12 Prayer Types (Witr, Eid, Janazah...)": row("۱۲ اقسامِ نماز (وتر، عید، جنازہ…)", "أنواع الصلوات الـ ١٢ (الوتر، العيد، الجنازة…)", "12 Aqsam-e-Namaz (Witr, Eid, Janazah…)", "12 प्रकार की नमाज़ें (वित्र, ईद, जनाज़ा…)", "12 Namaz Çeşidi (Vitir, Bayram, Cenaze…)", "১২ প্রকার নামাজ (বিতর, ঈদ, জানাজা…)", "۱۲ نوع نماز (وتر، عید، جنازه…)", "12 Jenis Shalat (Witir, Id, Jenazah…)", "12 Types de Prières (Witr, Aïd, Janaza…)"),
  "Wudu, Ghusl & Tayammum Method": row("وضو، غسل اور تیمم کا طریقہ", "طريقة الوضوء والغسل والتيمم", "Wuzu, Ghusl aur Tayammum", "वुज़ू, ग़ुस्ल और तयम्मुम", "Abdest, Gusül ve Teyemmüm", "ওযু, গোসল ও তায়াম্মুম", "روش وضو، غسل و تیمم", "Tata Cara Wudhu, Mandi & Tayamum", "Ablutions, Ghusl & Tayammum"),
  "Fara'id, Wajibat & Nullifiers Matrix": row("فرائض، واجبات اور مفسداتِ نماز", "فرائض وواجبات ومبطلات الصلاة", "Fara'id, Wajibat aur Mufsidat", "फ़राइज़, वाजिबात व मुफ़्सिदात", "Farzlar, Vacipler ve Bozan Haller", "ফরজ, ওয়াজিব ও নামাজ ভঙ্গের কারণ", "فرائض، واجبات و مبطلات نماز", "Rukun, Wajib & Pembatal Shalat", "Piliers, Obligations & Annulatifs"),
  "Compare Both": row("دونوں کا تقابل", "مقارنة الاثنين", "Dono Dekhein", "दोनों देखें", "Her İkisini Göster", "উভয় তুলনা", "مقایسه هر دو", "Bandingkan Keduanya", "Comparer les Deux"),
  "Brothers (Men)": row("اسلامی بھائی", "للرجال", "Mardon Ke Liye", "पुरुषों के लिए", "Erkekler", "পুরুষ", "آقایان", "Laki-laki", "Hommes"),
  "Sisters (Women)": row("اسلامی بہنیں", "للنساء", "Khwateen Ke Liye", "महिलाओं के लिए", "Hanımlar", "মহিলা", "بانوان", "Perempuan", "Femmes"),
  "Arabic": row("عربی", "العربية", "Arabi", "अरबी", "Arapça", "আরবি", "عربی", "Arab", "Arabe"),
  "English": row("انگریزی", "الإنجليزية", "English", "अंग्रेज़ी", "İngilizce", "ইংরেজি", "انگلیسی", "Inggris", "Anglais"),
  "Urdu": row("اردو", "الأردية", "Urdu", "उर्दू", "Urduca", "উর্দু", "اردو", "Urdu", "Ourdou"),

  // Quiz Lifelines & Controls
  "Scholar Call": row("عالم کا اشارہ", "استشارة عالم", "Aalim Ka Ishara", "आलिम संकेत", "Âlim İpucu", "আলেমের ইঙ্গিত", "راهنمایی عالم", "Petunjuk Ulama", "Indice Savant"),
  "Ijma' Poll": row("اجماع رائے", "استطلاع الجمهور", "Ijma' Poll", "राय पोल", "Cemaat Görüşü", "জনমত জরিপ", "نظرسنجی جمع", "Jajak Pendapat", "Avis du Public"),
  "Flip Sawal": row("سوال بدلیں", "تبديل السؤال", "Sawal Badlein", "सवाल बदलें", "Soruyu Değiştir", "প্রশ্ন পরিবর্তন", "تغییر سؤال", "Ganti Soal", "Changer de Question"),
  "Do Mauqe": row("دو مواقع", "فرصتان", "Do Mauqe", "दो अवसर", "Çift Cevap", "দুই সুযোগ", "دو فرصت", "Dua Kesempatan", "Double Chance"),
  "Walk Away": row("محفوظ واپسی", "انسحاب آمن", "Mehfooz Wapsi", "सुरक्षित वापसी", "Çekil", "নিরাপদ প্রস্থান", "انصراف امن", "Amankan Skor", "Conserver les Points"),
  "New Game": row("نیا مقابلہ", "مسابقة جديدة", "Naya Muqabla", "नया खेल", "Yeni Oyun", "নতুন খেলা", "مسابقه جدید", "Permainan Baru", "Nouvelle Partie"),

  // Zakat & Barsi Tabs
  "Hawl & Payment Ledger": row("سالِ زکوٰۃ اور ادائیگی ریکارڈ", "الحول وسجل المدفوعات", "Hawl & Adaigi खाता", "हौल और भुगतान खाता", "Havl ve Ödeme Defteri", "বর্ষপূর্তি ও পরিশোধ খাতা", "سال زکوی و دفتر پرداخت‌ها", "Haul & Catatan Pembayaran", "Hawl & Registre des Paiements"),
  "Fitrah, Fidyah & Kaffarah": row("صدقۂ فطر، فدیہ اور کفارہ", "صدقة الفطر والفدية والكفارة", "Fitrah, Fidyah & Kaffarah", "फ़ितरा, फ़िदया व कफ़्फ़ारा", "Fitre, Fidye ve Kefaret", "ফিতরা, ফিদইয়া ও কাফফারা", "فطریه، فدیه و کفاره", "Fitrah, Fidyah & Kafarat", "Fitrah, Fidyah & Kaffarah"),
  "Ushr & Masarif Guide": row("عشر اور مصارفِ زکوٰۃ", "العشر ومصارف الزكاة", "Ushr & Masarif", "उश्र व मसारिफ़", "Öşür ve Zekât Rehberi", "উশর ও যাকাতের খাত", "عشر و مصارف زکات", "Usyur & Mustahik", "Oushr & Bénéficiaires"),
  "Gold Vault": row("سونے کی مالیت", "الذهب", "Sona", "सोना", "Altın", "স্বর্ণ", "طلا", "Emas", "Or"),
  "Silver Vault": row("چاندی کی مالیت", "الفضة", "Chandi", "चांदी", "Gümüş", "রৌপ্য", "نقره", "Perak", "Argent"),
  "Trade & Shares": row("تجارتی مال و حصص", "عروض التجارة والأسهم", "Tijarti Maal", "व्यापारिक माल व शेयर", "Ticaret Malları", "ব্যবসায়িক পণ্য", "کالای تجاری و سهام", "Barang Dagang & Saham", "Marchandises & Actions"),
  "Receivables & PF": row("قرضِ حسنہ و واجب الوصول", "الديون المرجوة", "Qabil-e-Wasool Qarz", "प्राप्य राशि", "Alacaklar", "প্রাপ্য অর্থ", "مطالبات", "Piutang", "Créances"),
  "Self & Adults": row("خود اور بالغ افراد", "النفس والبالغون", "Khud aur Baligh Afrad", "स्वयं व वयस्क", "Kendisi ve Yetişkinler", "নিজে ও প্রাপ্তবয়স্ক", "خود و بزرگسالان", "Diri & Dewasa", "Soi-même & Adultes"),
  "Minor Children": row("نابالغ بچے", "الأطفال القصر", "Nabaligh Bachche", "नाबालिग बच्चे", "Küçük Çocuklar", "নাবালক সন্তান", "فرزندان نابالغ", "Anak Belum Baligh", "Enfants Mineurs"),
  "Newborns": row("نومولود بچے", "المواليد الجدد", "Nau-maulood", "नवजात शिशु", "Yeni Doğanlar", "নবজাতক", "نوزادان", "Bayi Baru Lahir", "Nouveau-nés"),
  "All Rules": row("تمام مسائل", "جميع الأحكام", "Tamam Masail", "सभी नियम", "Tüm Hükümler", "সকল মাসায়েল", "همه احکام", "Semua Hukum", "Toutes les Règles"),
  "Can Receive": row("مستحقِ زکوٰۃ", "يجوز إعطاؤهم", "Mustahiq-e-Zakat", "पात्र", "Verilebilir", "যাকাতের উপযুক্ত", "مستحق دریافت", "Berhak Menerima", "Éligibles"),
  "Cannot Receive": row("غیر مستحق", "لا يجوز إعطاؤهم", "Ghayr Mustahiq", "अपात्र", "Verilemez", "অযোগ্য", "غیر مستحق", "Tidak Berhak", "Non Éligibles"),
  "Sadat & Tamlik": row("سادات و تملیک", "السادات والتمليك", "Sadat & Tamlik", "सादात व तमलीक", "Seyyidler ve Temlik", "সাদাত ও তামলিক", "سادات و تملیک", "Sadat & Tamlik", "Sadat & Tamlik"),
  "Marhumeen Sanctuary": row("یادگارِ مرحومین", "واحة المرحومين", "Marhumeen", "मरहूमीन स्मृति", "Merhumlar Köşesi", "মরহুমদের স্মরণ", "یادمان مرحومین", "Ruang Almarhum", "Espace des Défunts"),
  "30-Para Khatm Board": row("۳۰ پارہ ختمِ قرآن", "لوحة ختمة ٣٠ جزءاً", "30-Para Khatm", "30 पारा ख़त्म", "30 Cüz Hatim Tablosu", "৩০ পারা খতম বোর্ড", "جدول ختم ۳۰ جزء", "Papan Khataman 30 Juz", "Tableau Khatm 30 Juz"),
  "Tariqa-e-Fatiha & Dua": row("طریقۂ فاتحہ و دعا", "طريقة الفاتحة والدعاء", "Tariqa-e-Fatiha", "फ़ातिहा व दुआ तरीक़ा", "Fatiha ve Dua Usulü", "ফাতিহা ও দোয়ার নিয়ম", "روش فاتحه و دعا", "Tata Cara Fatihah & Doa", "Méthode de Fatiha & Doua"),
  "Barsi Calendar & Adab": row("تقویمِ برسی و آدابِ قبور", "تقويم الذكرى وآداب القبور", "Barsi Calendar & Adab", "बरसी कैलेंडर व अदब", "Vefat Takvimi ve Kabir Âdâbı", "বার্ষিকী ক্যালেন্ডার ও আদব", "تقویم سالگرد و آداب قبور", "Kalender Haul & Adab Ziarah", "Calendrier & Adab des Tombes"),
  "My Family (Private)": row("میرا خاندان (ذاتی)", "عائلتي (خاص)", "Mera Khandan", "मेरा परिवार (निजी)", "Ailem (Özel)", "আমার পরিবার (ব্যক্তিগত)", "خانواده من (خصوصی)", "Keluarga Saya (Pribadi)", "Ma Famille (Privé)"),
  "Community Endowment": row("اجتماعی ایصالِ ثواب", "الوقف الجماعي", "Ijtimai Isal-e-Sawab", "सामूहिक ईसाल-ए-सवाब", "Topluluk Hatmi", "সম্মিলিত ঈসালে সওয়াব", "ایصال ثواب عمومی", "Khataman Bersama", "Dotation Communautaire"),

  // Sanctuary Studio (Admin) Clean Labels
  "Account & RBAC Matrix": row("اکاؤنٹ اور اختیارات", "الحساب والصلاحيات", "Account & Ikhtiyarat", "अकाउंट व अधिकार", "Hesap ve Yetkiler", "অ্যাকাউন্ট ও অনুমতি", "حساب و دسترسی‌ها", "Akun & Akses", "Compte & Accès"),
  "Auliya Allah CMS": row("تذکرۂ اولیاء", "ملفات الأولياء", "Tazkirah Auliya", "औलिया प्रोफ़ाइल", "Evliya Profilleri", "আউলিয়া প্রোফাইল", "پرونده اولیاء", "Profil Auliya", "Profils Auliya"),
  "Urs & Sacred Calendar CMS": row("تقویمِ عرس و ایام", "تقويم المناسبات", "Urs Calendar", "उर्स व पवित्र तिथियां", "Vuslat Takvimi", "ওরস ক্যালেন্ডার", "تقویم عرس", "Kalender Haul", "Calendrier des Urs"),
  "Modular Dashboard Builder": row("ترتیبِ شعبہ جات", "ترتيب الواجهة", "Home Tarteeb", "होम लेआउट", "Ana Ekran Düzeni", "হোম লেআউট", "چیدمان صفحه اصلی", "Tata Letak Beranda", "Disposition de l'Accueil"),
  "Zakat & Gamification Engine": row("زکوٰۃ و معمولات ترتیبات", "إعدادات الزكاة والأوراد", "Zakat & Mamoolat", "ज़कात व आमाल सेटिंग्स", "Zekât ve Görev Ayarları", "যাকাত ও আমল সেটিংস", "تنظیمات زکات و اوراد", "Pengaturan Zakat & Amalan", "Paramètres Zakat & Objectifs"),
  "SHA-256 Audit & DB Snapshot": row("سجلِ عمل اور بیک اَپ", "سجل النشاط والنسخ الاحتياطي", "Activity Log & Backup", "गतिविधि लॉग व बैकअप", "İşlem Kaydı ve Yedek", "লগ ও ব্যাকআপ", "گزارش فعالیت و پشتیبان", "Log Aktivitas & Cadangan", "Journal & Sauvegarde"),
};

const CASE_INSENSITIVE_MAP: Map<string, PhraseRow> = new Map(
  Object.entries(UI_PHRASES).map(([k, v]) => [k.toLowerCase(), v])
);

const PATTERN_WORDS = {
  page: row("صفحہ", "صفحة", "Safha", "पृष्ठ", "Sayfa", "পৃষ্ঠা", "صفحه", "Halaman", "Page"),
  para: row("پارہ", "الجزء", "Para", "पारा", "Cüz", "পারা", "جزء", "Juz", "Juz"),
  verses: row("آیات", "آيات", "Aayaat", "आयतें", "Âyet", "আয়াত", "آیات", "Ayat", "Versets"),
  step: row("مرحلہ", "الخطوة", "Marhala", "चरण", "Adım", "ধাপ", "مرحله", "Langkah", "Étape"),
  tier: row("درجہ", "المستوى", "Darja", "स्तर", "Seviye", "স্তর", "سطح", "Tingkat", "Niveau"),
  today: row("آج", "اليوم", "Aaj", "आज", "Bugün", "আজ", "امروز", "Hari Ini", "Aujourd'hui"),
};

/**
 * Translates an English UI phrase or dynamic short label into any of the 10 supported languages.
 */
export function translatePhrase(lang: LangCode, input: string): string {
  if (!input || lang === "en") return input;
  const trimmed = input.trim();
  if (!trimmed) return input;

  const exact = UI_PHRASES[trimmed] || CASE_INSENSITIVE_MAP.get(trimmed.toLowerCase());
  if (exact) {
    const leading = input.match(/^\s*/)?.[0] || "";
    const trailing = input.match(/\s*$/)?.[0] || "";
    return `${leading}${exact[lang]}${trailing}`;
  }

  // Pattern: "Page 14" / "Mushaf Page 14"
  const pageMatch = trimmed.match(/^(?:Mushaf\s+)?Page\s+(\d+)$/i);
  if (pageMatch) {
    return `${PATTERN_WORDS.page[lang]} ${pageMatch[1]}`;
  }

  // Pattern: "Para 3" / "Juz 3"
  const paraMatch = trimmed.match(/^(?:Para|Juz)\s+(\d+)$/i);
  if (paraMatch) {
    return `${PATTERN_WORDS.para[lang]} ${paraMatch[1]}`;
  }

  // Pattern: "MECCAN • 7 VERSES" or "Medinian • 286 Verses"
  const revMatch = trimmed.match(/^(Meccan|Medinan|Medinian)\s*•\s*(\d+)\s*Verses$/i);
  if (revMatch) {
    const originKey = revMatch[1].toLowerCase() === "meccan" ? "Meccan" : "Medinan";
    const origin = UI_PHRASES[originKey][lang];
    return `${origin} • ${revMatch[2]} ${PATTERN_WORDS.verses[lang]}`;
  }

  // Pattern: "7 Verses"
  const versesMatch = trimmed.match(/^(\d+)\s*Verses$/i);
  if (versesMatch) {
    return `${versesMatch[1]} ${PATTERN_WORDS.verses[lang]}`;
  }

  // Pattern: "Step 2" or "Tier 4"
  const stepMatch = trimmed.match(/^Step\s+(\d+)$/i);
  if (stepMatch) {
    return `${PATTERN_WORDS.step[lang]} ${stepMatch[1]}`;
  }

  const tierMatch = trimmed.match(/^Tier\s+(\d+)(?:\/(\d+))?$/i);
  if (tierMatch) {
    return tierMatch[2]
      ? `${PATTERN_WORDS.tier[lang]} ${tierMatch[1]}/${tierMatch[2]}`
      : `${PATTERN_WORDS.tier[lang]} ${tierMatch[1]}`;
  }

  return input;
}
