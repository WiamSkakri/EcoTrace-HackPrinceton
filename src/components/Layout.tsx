import { useRouter } from 'next/router';
import Link from 'next/link';
import { Home, Trophy, MessageCircle, MapPin, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Use system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
      document.documentElement.setAttribute('data-theme', defaultTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const tabs = [
    { name: 'My Impact', path: '/', icon: Home },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Eco Chat', path: '/chat', icon: MessageCircle },
    { name: 'Map', path: '/map', icon: MapPin },
  ];

  return (
    <>
      <nav className="nav-container">
        <div className="nav-content">
          <div className="nav-tabs">
            {tabs.map((tab) => {
              const isActive = router.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`nav-tab ${isActive ? 'active' : ''}`}
                >
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </>
  );
}
