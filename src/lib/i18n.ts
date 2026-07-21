import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: { home: "Home", services: "Services", why: "Why Us", teachers: "Teachers", contact: "Contact" },
      hero: { cta: "Book a Free Class", secondary: "Explore Services" },
      services: { title: "Our Services", sub: "Pick the subject, we bring the teacher." },
      why: { title: "Why Choose Us" },
      teachers: { title: "Meet Our Top Tutors" },
      contact: { title: "Get In Touch", location: "Location" },
      footer: { rights: "All rights reserved." },
      admin: { title: "Admin Panel", signout: "Sign out" },
    },
  },
  ur: {
    translation: {
      nav: { home: "ہوم", services: "خدمات", why: "کیوں ہم", teachers: "اساتذہ", contact: "رابطہ" },
      hero: { cta: "مفت کلاس بک کریں", secondary: "خدمات دیکھیں" },
      services: { title: "ہماری خدمات", sub: "مضمون منتخب کریں، استاد ہم لائیں گے۔" },
      why: { title: "ہمیں کیوں چنیں" },
      teachers: { title: "بہترین اساتذہ" },
      contact: { title: "رابطہ کریں", location: "مقام" },
      footer: { rights: "جملہ حقوق محفوظ ہیں۔" },
      admin: { title: "ایڈمن پینل", signout: "سائن آؤٹ" },
    },
  },
  hi: {
    translation: {
      nav: { home: "होम", services: "सेवाएँ", why: "क्यों हम", teachers: "शिक्षक", contact: "संपर्क" },
      hero: { cta: "मुफ्त क्लास बुक करें", secondary: "सेवाएँ देखें" },
      services: { title: "हमारी सेवाएँ", sub: "विषय चुनें, शिक्षक हम भेजेंगे।" },
      why: { title: "हमें क्यों चुनें" },
      teachers: { title: "हमारे शीर्ष शिक्षक" },
      contact: { title: "संपर्क करें", location: "स्थान" },
      footer: { rights: "सर्वाधिकार सुरक्षित।" },
      admin: { title: "एडमिन पैनल", signout: "साइन आउट" },
    },
  },
  ar: {
    translation: {
      nav: { home: "الرئيسية", services: "الخدمات", why: "لماذا نحن", teachers: "المعلمون", contact: "تواصل" },
      hero: { cta: "احجز درسًا مجانيًا", secondary: "استكشف الخدمات" },
      services: { title: "خدماتنا", sub: "اختر المادة، ونحن نجلب المعلم." },
      why: { title: "لماذا تختارنا" },
      teachers: { title: "أفضل المعلمين" },
      contact: { title: "تواصل معنا", location: "الموقع" },
      footer: { rights: "جميع الحقوق محفوظة." },
      admin: { title: "لوحة الإدارة", signout: "تسجيل الخروج" },
    },
  },
  es: {
    translation: {
      nav: { home: "Inicio", services: "Servicios", why: "Por qué nosotros", teachers: "Profesores", contact: "Contacto" },
      hero: { cta: "Reserva una clase gratis", secondary: "Ver servicios" },
      services: { title: "Nuestros Servicios", sub: "Elige la materia, nosotros ponemos al profesor." },
      why: { title: "Por qué elegirnos" },
      teachers: { title: "Nuestros mejores tutores" },
      contact: { title: "Contáctanos", location: "Ubicación" },
      footer: { rights: "Todos los derechos reservados." },
      admin: { title: "Panel de administración", signout: "Cerrar sesión" },
    },
  },
  fr: {
    translation: {
      nav: { home: "Accueil", services: "Services", why: "Pourquoi nous", teachers: "Professeurs", contact: "Contact" },
      hero: { cta: "Réserver un cours gratuit", secondary: "Voir les services" },
      services: { title: "Nos Services", sub: "Choisissez la matière, on vous envoie le prof." },
      why: { title: "Pourquoi nous choisir" },
      teachers: { title: "Nos meilleurs tuteurs" },
      contact: { title: "Contactez-nous", location: "Emplacement" },
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
