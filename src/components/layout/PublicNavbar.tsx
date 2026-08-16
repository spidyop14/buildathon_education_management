import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EduIQLogo } from '@/components/ui/EduIQLogo';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Platform', path: '/platform' },
  { label: 'AI Intelligence', path: '/ai-intelligence' },
  { label: 'For Students', path: '/for-students' },
  { label: 'For Teachers', path: '/for-teachers' },
  { label: 'For Administrators', path: '/for-administrators' },
  { label: 'Courses', path: '/courses' },
];

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Close mobile drawer on route change & reset scroll
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/88 backdrop-blur-md border-b border-ink-150/70 h-[72px]">
      <div className="max-w-[1280px] w-[calc(100%-48px)] h-full mx-auto flex items-center justify-between">
        {/* LEFT: LOGO */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <EduIQLogo size={26} />
        </Link>

        {/* CENTER: DESKTOP NAV LINKS (<900px hidden) */}
        <nav className="hidden lg:flex items-center gap-[28px]">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`text-xs font-semibold whitespace-nowrap transition-colors duration-150 relative py-1.5 ${
                  isActive
                    ? 'text-cobalt-600 font-bold'
                    : 'text-ink-600 hover:text-cobalt-600'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="public-nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cobalt-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: DESKTOP ACTIONS (<900px hidden) */}
        <div className="hidden lg:flex items-center gap-[14px] shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="rounded-xl border-ink-200 text-xs font-semibold"
              >
                Dashboard &rarr;
              </Button>
              <Link
                to={`/${user.role}/profile`}
                className="w-8 h-8 rounded-full bg-cobalt-100 text-cobalt-800 font-bold text-xs flex items-center justify-center border border-cobalt-300 hover:scale-105 transition-transform"
                title={user.name}
              >
                {user.name.charAt(0)}
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-semibold text-ink-700 hover:text-cobalt-600 px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                Sign in
              </Link>
              <Link to="/register">
                <Button variant="accent" size="sm" className="rounded-xl shadow-glow text-xs font-semibold whitespace-nowrap">
                  Get started &rarr;
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE (<900px visible) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-ink-600 hover:text-ink-950 rounded-xl hover:bg-ink-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={22} />
        </button>
      </div>

      {/* MOBILE NAV DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-white border-b border-ink-150 px-6 py-5 space-y-4 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    className={`text-left text-xs font-semibold py-2.5 px-3.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-cobalt-50 text-cobalt-600 font-bold'
                        : 'text-ink-700 hover:bg-ink-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-ink-150 flex items-center justify-between gap-3">
              {isAuthenticated && user ? (
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => handleNavClick(`/${user.role}/dashboard`)}
                >
                  Dashboard &rarr;
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleNavClick('/login')}
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="accent"
                    className="flex-1"
                    onClick={() => handleNavClick('/register')}
                  >
                    Get started
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default PublicNavbar;
