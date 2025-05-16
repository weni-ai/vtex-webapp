import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pt from './locales/pt-BR.json';
import es from './locales/es-ES.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.services.formatter?.add('lowerCase', (value: string) => {
  return value.toLowerCase();
});

i18n.services.formatter?.add('firstLetterUpperCase', (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
});

export const t = i18n.t.bind(i18n);

export default i18n;
