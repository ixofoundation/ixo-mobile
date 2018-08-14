import i18n from 'i18next';
import _ from 'underscore';
// @ts-ignore
import { DangerZone } from 'expo';
const { Localization } = DangerZone;

const en = require('./locales/en_ZA.json');
const es = require('./locales/es.json');

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: (cb: Function) => {
      return Localization.getCurrentLocaleAsync()
        .then((lng: string) => { 
            cb(lng);
         })
    },
    init: () => {},
    cacheUserLanguage: () => {}
}

i18n.use(languageDetector).init({
    // @ts-ignore
    fallbackLng: 'en',   
    resources: {
      en_ZA: en,
      es: es,
      ns: ['translation'],
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false
      },
  }
});
export default i18n;