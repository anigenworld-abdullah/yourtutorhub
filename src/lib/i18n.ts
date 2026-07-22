import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: { home: "Home", services: "Services", why: "Why Us", teachers: "Teachers", contact: "Contact", signin: "Sign in", signup: "Sign up", install: "Install app", back: "Back" },
      hero: { cta: "Book a Class", secondary: "Explore Services" },
      services: { title: "Our Services", sub: "Pick the subject, we bring the teacher.", details: "View details" },
      why: { title: "Why Choose Us" },
      teachers: { title: "Meet Our Top Tutors", viewProfile: "View profile" },
      contact: { title: "Get In Touch", location: "Location", quick: "Contact us" },
      footer: { rights: "All rights reserved." },
      admin: { title: "Admin Panel", signout: "Sign out" },
    },
  },
  ur: {
    translation: {
      nav: { home: "ہوم", services: "خدمات", why: "کیوں ہم", teachers: "اساتذہ", contact: "رابطہ", signin: "سائن ان", signup: "سائن اپ", install: "ایپ انسٹال کریں", back: "واپس" },
      hero: { cta: "کلاس بک کریں", secondary: "خدمات دیکھیں" },
      services: { title: "ہماری خدمات", sub: "مضمون منتخب کریں، استاد ہم لائیں گے۔", details: "تفصیل دیکھیں" },
      why: { title: "ہمیں کیوں چنیں" },
      teachers: { title: "بہترین اساتذہ", viewProfile: "پروفائل دیکھیں" },
      contact: { title: "رابطہ کریں", location: "مقام", quick: "ہم سے رابطہ کریں" },
      footer: { rights: "جملہ حقوق محفوظ ہیں۔" },
      admin: { title: "ایڈمن پینل", signout: "سائن آؤٹ" },
    },
  },
  hi: {
    translation: {
      nav: { home: "होम", services: "सेवाएँ", why: "क्यों हम", teachers: "शिक्षक", contact: "संपर्क", signin: "साइन इन", signup: "साइन अप", install: "ऐप इंस्टॉल करें", back: "वापस" },
      hero: { cta: "क्लास बुक करें", secondary: "सेवाएँ देखें" },
      services: { title: "हमारी सेवाएँ", sub: "विषय चुनें, शिक्षक हम भेजेंगे।", details: "विवरण देखें" },
      why: { title: "हमें क्यों चुनें" },
      teachers: { title: "हमारे शीर्ष शिक्षक", viewProfile: "प्रोफ़ाइल देखें" },
      contact: { title: "संपर्क करें", location: "स्थान", quick: "संपर्क करें" },
      footer: { rights: "सर्वाधिकार सुरक्षित।" },
      admin: { title: "एडमिन पैनल", signout: "साइन आउट" },
    },
  },
  ar: {
    translation: {
      nav: { home: "الرئيسية", services: "الخدمات", why: "لماذا نحن", teachers: "المعلمون", contact: "تواصل", signin: "تسجيل الدخول", signup: "إنشاء حساب", install: "تثبيت التطبيق", back: "رجوع" },
      hero: { cta: "احجز درسًا", secondary: "استكشف الخدمات" },
      services: { title: "خدماتنا", sub: "اختر المادة، ونحن نجلب المعلم.", details: "عرض التفاصيل" },
      why: { title: "لماذا تختارنا" },
      teachers: { title: "أفضل المعلمين", viewProfile: "عرض الملف" },
      contact: { title: "تواصل معنا", location: "الموقع", quick: "اتصل بنا" },
      footer: { rights: "جميع الحقوق محفوظة." },
      admin: { title: "لوحة الإدارة", signout: "تسجيل الخروج" },
    },
  },
  es: {
    translation: {
      nav: { home: "Inicio", services: "Servicios", why: "Por qué nosotros", teachers: "Profesores", contact: "Contacto", signin: "Iniciar sesión", signup: "Registrarse", install: "Instalar app", back: "Atrás" },
      hero: { cta: "Reserva una clase", secondary: "Ver servicios" },
      services: { title: "Nuestros Servicios", sub: "Elige la materia, nosotros ponemos al profesor.", details: "Ver detalles" },
      why: { title: "Por qué elegirnos" },
      teachers: { title: "Nuestros mejores tutores", viewProfile: "Ver perfil" },
      contact: { title: "Contáctanos", location: "Ubicación", quick: "Contáctanos" },
      footer: { rights: "Todos los derechos reservados." },
      admin: { title: "Panel de administración", signout: "Cerrar sesión" },
    },
  },
  fr: {
    translation: {
      nav: { home: "Accueil", services: "Services", why: "Pourquoi nous", teachers: "Professeurs", contact: "Contact", signin: "Se connecter", signup: "S'inscrire", install: "Installer l'app", back: "Retour" },
      hero: { cta: "Réserver un cours", secondary: "Voir les services" },
      services: { title: "Nos Services", sub: "Choisissez la matière, on vous envoie le prof.", details: "Voir détails" },
      why: { title: "Pourquoi nous choisir" },
      teachers: { title: "Nos meilleurs tuteurs", viewProfile: "Voir le profil" },
      contact: { title: "Contactez-nous", location: "Emplacement", quick: "Contactez-nous" },
      footer: { rights: "Tous droits réservés." },
      admin: { title: "Panneau admin", signout: "Se déconnecter" },
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: (typeof window !== "undefined" && localStorage.getItem("lang")) || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export const RTL_LANGS = new Set(["ur", "ar"]);
export default i18n;
