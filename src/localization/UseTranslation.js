// localization/useTranslation.js
import { useLanguage } from './LanguageContext';
import { translations } from './translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    return translations[language][key] || key;
  };

  return { t };
};