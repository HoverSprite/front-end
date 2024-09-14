import React from 'react';
import { Link } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';
import { useTranslation } from '../localization/UseTranslation';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const Navbar = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={`${isDark ? 'bg-gray-800' : 'bg-green-600'} text-white p-4 transition-colors duration-200`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">HoverSprite</Link>
        <div className="flex items-center">
          {user && (
            <>
              <span className="mr-4">{t('Welcome')}, {t(user.role)}</span>
              <Link to="/sprayorder" className="mr-4 hover:underline">{t('Create Spray Order')}</Link>
              <NotificationIcon userId={user.id} userRole={user.role} />
            </>
          )}
          <button
            onClick={toggleLanguage}
            className={`mx-4 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-green-100'} ${isDark ? 'text-white' : 'text-green-600'} px-3 py-1 rounded transition-colors duration-200`}
          >
            {language === 'en' ? t('Vietnamese') : t('English')}
          </button>
          <button
            onClick={toggleTheme}
            className={`mr-4 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-green-100'} ${isDark ? 'text-white' : 'text-green-600'} p-2 rounded-full transition-colors duration-200`}
            aria-label={isDark ? t('Switch to Light Mode') : t('Switch to Dark Mode')}
          >
            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          {user ? (
            <button onClick={onLogout} className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-green-100 text-green-600'} px-4 py-2 rounded transition-colors duration-200`}>
              {t('Logout')}
            </button>
          ) : (
            <Link to="/" className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-green-100 text-green-600'} px-4 py-2 rounded transition-colors duration-200`}>
              {t('Login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;