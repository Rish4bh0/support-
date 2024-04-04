import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./i18n/en/translation.json";
import np from "./i18n/np/translation.json";
import HttpBackend from "i18next-http-backend";

i18n
  .use(initReactI18next)
  .use(HttpBackend)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
   // backend: {
   //   loadPath: "http://localhost:5000/locales/{{lng}}/{{ns}}.json",
  //  },
     resources: {
      en: {
         translation: en,
      },
     np: {
         translation: np,
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