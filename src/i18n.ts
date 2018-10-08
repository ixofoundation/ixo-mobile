import i18n from 'i18next';
// @ts-ignore

const en_ZA = require('./locales/en_ZA.json');
const es = require('./locales/es.json');

const languageDetector = {
	type: 'languageDetector',
	async: true,
	detect: (cb: Function) => {
		// return Localization.getCurrentLocaleAsync()
		//   .then((lng: string) => {
		//       cb(lng);
		//    })
		// TODO replace with non-expo localization
	},
	init: () => {},
	cacheUserLanguage: () => {}
};

i18n.use(languageDetector).init({
	// @ts-ignore
	fallbackLng: 'en_ZA',
	resources: {
		en_ZA,
		es,
		ns: ['translation'],
		defaultNS: 'translation',
		interpolation: {
			escapeValue: false
		}
	}
});
export default i18n;
