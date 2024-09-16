import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';
import { useTranslation } from '../localization/UseTranslation';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOrderManagementClick = () => {
    navigate('/order-manage');
    setIsMenuOpen(false);
  };

  const navItemClass = `px-3 py-2 rounded-md text-sm font-medium ${
    isDark
      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
      : 'text-green-100 hover:bg-green-700 hover:text-white'
  }`;

  const mobileNavItemClass = `block px-3 py-2 rounded-md text-base font-medium ${
    isDark
      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
      : 'text-green-100 hover:bg-green-700 hover:text-white'
  }`;

  return (
    <nav className={`${isDark ? 'bg-gray-800' : 'bg-green-600'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">HoverSprite</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {user && (
                <>
                  <span className={navItemClass}>{t('Welcome')}, {t(user.role)}</span>
                  <Link to="/create" className={navItemClass}>{t('Create Spray Order')}</Link>
                  <button onClick={handleOrderManagementClick} className={navItemClass}>
                    {t('Order Management')}
                  </button>
                </>
              )}
              <NotificationIcon userId={user?.id} userRole={user?.role} />
              <button
                onClick={toggleLanguage}
                className={`${navItemClass} ${isDark ? 'bg-gray-700' : 'bg-green-700'}`}
              >
                {language === 'en' ? t('Vietnamese') : t('English')}
              </button>
              <button
                onClick={toggleTheme}
                className={`${navItemClass} ${isDark ? 'bg-gray-700' : 'bg-green-700'}`}
                aria-label={isDark ? t('Switch to Light Mode') : t('Switch to Dark Mode')}
              >
                {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              {user ? (
                <button onClick={logout} className={`${navItemClass} ${isDark ? 'bg-gray-700' : 'bg-green-700'}`}>
                  {t('Logout')}
                </button>
              ) : (
                <Link to="/" className={`${navItemClass} ${isDark ? 'bg-gray-700' : 'bg-green-700'}`}>
                  {t('Login')}
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-green-200 hover:text-white hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDark ? 'focus:ring-offset-gray-800 focus:ring-white' : 'focus:ring-offset-green-600 focus:ring-white'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (
              <>
                <span className={mobileNavItemClass}>{t('Welcome')}, {t(user.role)}</span>
                <Link to="/sprayorder" className={mobileNavItemClass}>{t('Create Spray Order')}</Link>
                <button onClick={handleOrderManagementClick} className={mobileNavItemClass}>
                  {t('Order Management')}
                </button>
              </>
            )}
            <NotificationIcon userId={user?.id} userRole={user?.role} />
            <button
              onClick={toggleLanguage}
              className={`${mobileNavItemClass} ${isDark ? 'bg-gray-700' : 'bg-green-700'} w-full text-left`}
            >
              {language === 'en' ? t('Vietnamese') : t('English')}
            </button>
            <button
              onClick={toggleTheme}
              className={`${mobileNavItemClass} ${isDark ? 'bg-gray-700' : 'bg-green-700'} w-full text-left`}
              aria-label={isDark ? t('Switch to Light Mode') : t('Switch to Dark Mode')}
            >
              {isDark ? <SunIcon className="h-5 w-5 inline mr-2" /> : <MoonIcon className="h-5 w-5 inline mr-2" />}
              {isDark ? t('Switch to Light Mode') : t('Switch to Dark Mode')}
            </button>
            {user ? (
              <button onClick={logout} className={`${mobileNavItemClass} ${isDark ? 'bg-gray-700' : 'bg-green-700'} w-full text-left`}>
                {t('Logout')}
              </button>
            ) : (
              <Link to="/" className={`${mobileNavItemClass} ${isDark ? 'bg-gray-700' : 'bg-green-700'} block`}>
                {t('Login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;