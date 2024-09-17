import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';
import { useTranslation } from '../localization/UseTranslation';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon, Bars3Icon, XMarkIcon, GlobeAltIcon, UserCircleIcon } from '@heroicons/react/24/solid';
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

  const handleRouteClick = () => {
    navigate('/route');
    setIsMenuOpen(false);
  };

  const navItemClass = `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
    isDark
      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
      : 'text-white hover:bg-green-500 hover:text-white'
  }`;

  const mobileNavItemClass = `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
    isDark
      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
      : 'text-white hover:bg-green-500 hover:text-white'
  }`;

  return (
    <nav className={`${isDark ? 'bg-gray-800' : 'bg-green-600'} shadow-lg transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white mr-2">HoverSprite</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                {/* Conditionally render based on user role */}
                {user.roles[0] === 'ROLE_SPRAYER' ? (
                  <button onClick={handleRouteClick} className={navItemClass}>
                    {t('View Route')}
                  </button>
                ) : (
                  <Link to="/create" className={navItemClass}>
                    {t('Create Spray Order')}
                  </Link>
                )}
                <button onClick={handleOrderManagementClick} className={navItemClass}>
                  {t('Order Management')}
                </button>
              </>
            )}
            <NotificationIcon userId={user?.id} userRole={user?.role} />
            <button onClick={toggleLanguage} className={`${navItemClass} flex items-center`}>
              <GlobeAltIcon className="h-5 w-5 mr-1" />
              {language === 'en' ? t('Vietnamese') : t('English')}
            </button>
            <button 
              onClick={toggleTheme} 
              className={`${navItemClass} p-2 rounded-full`} 
              aria-label={isDark ? t('Switch to Light Mode') : t('Switch to Dark Mode')}
            >
              {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            {user ? (
              <button onClick={logout} className={`${navItemClass} bg-red-500 hover:bg-red-600 text-white`}>
                {t('Logout')}
              </button>
            ) : (
              <Link to="/" className={`${navItemClass} bg-blue-500 hover:bg-blue-600 text-white`}>
                {t('Login')}
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700 focus:ring-white'
                  : 'text-white hover:text-white hover:bg-green-500 focus:ring-green-500'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && (
              <>
                {user.roles[0] === 'ROLE_SPRAYER' ? (
                  <button onClick={handleRouteClick} className={mobileNavItemClass}>
                    {t('View Route')}
                  </button>
                ) : (
                  <Link to="/sprayorder" className={mobileNavItemClass}>
                    {t('Create Spray Order')}
                  </Link>
                )}
                <button onClick={handleOrderManagementClick} className={mobileNavItemClass}>
                  {t('Order Management')}
                </button>
              </>
            )}
            <NotificationIcon userId={user?.id} userRole={user?.role} />
            <button onClick={toggleLanguage} className={`${mobileNavItemClass} flex items-center`}>
              <GlobeAltIcon className="h-5 w-5 mr-1" />
              {language === 'en' ? t('Vietnamese') : t('English')}
            </button>
            <button onClick={toggleTheme} className={`${mobileNavItemClass} flex items-center`}>
              {isDark ? <SunIcon className="h-5 w-5 mr-1" /> : <MoonIcon className="h-5 w-5 mr-1" />}
              {isDark ? t('Switch to Light Mode') : t('Switch to Dark Mode')}
            </button>
            {user ? (
              <button onClick={logout} className={`${mobileNavItemClass} bg-red-500 hover:bg-red-600 text-white`}>
                {t('Logout')}
              </button>
            ) : (
              <Link to="/" className={`${mobileNavItemClass} bg-blue-500 hover:bg-blue-600 text-white`}>
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
