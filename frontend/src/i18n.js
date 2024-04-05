import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EN from "./i18n/en/translation.json";
import NP from "./i18n/np/translation.json";
import HOME_NP from "./i18n/np/home.json"
import HOME_EN from "./i18n/en/home.json"
import HttpBackend from "i18next-http-backend";
import AUTH from "./i18n/en/auth.json"
import AUTH_NP from "./i18n/np/auth.json"
import NEWTICKET_NP from "./i18n/np/newTicket.json"
import NEWTICKET from "./i18n/en/newTicket.json"
import SIDEBAR_NP from "./i18n/np/sideBar.json"
import SIDEBAR from "./i18n/en/sideBar.json"


const selectedLanguage = localStorage.getItem("i18nextLng") || "en";

i18n
  .use(initReactI18next)
  .use(HttpBackend)
  .init({
    debug: true,
    fallbackLng: "en",
    lng: selectedLanguage,
    interpolation: {
      escapeValue: false,
    },
   // backend: {
   //   loadPath: "http://localhost:5000/locales/{{lng}}/{{ns}}.json",
  //  },
     resources: {
      en: {
        translation: { ...EN, ...HOME_EN, ...AUTH, ...NEWTICKET, ...SIDEBAR },
      },
     np: {
      translation: { ...NP, ...HOME_NP, ...AUTH_NP, ...NEWTICKET_NP, ...SIDEBAR_NP },
       },
     },
    // resources: {
    //   en: {
    //     translation: {
    //       welcome: "Welcome",
    //     },
    //   },
    //   de: {
    //     translation: {
    //       welcome: "Willkommen",
    //     },
    //   },
    // },
  });

export default i18n;