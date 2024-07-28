import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from 'src/utils/languages/en.json';
import french from 'src/utils/languages/fr.json';

const resources = {
  en: {
    translation: english,
  },
  fr: {
    translation: french,
  }
};

const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('i18nextLng');
  console.log(savedLanguage);

  return savedLanguage || 'en'; // Default language if none is saved
};

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: getInitialLanguage(),

    interpolation: {
      escapeValue: false, // React already safeguards from XSS
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
