import { useRouter } from 'next/router';
import Link from 'next/link';
import { Home, Trophy, MessageCircle, MapPin } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const tabs = [
    { name: 'My Impact', path: '/', icon: Home },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Eco Chat', path: '/chat', icon: MessageCircle },
    { name: 'Map', path: '/map', icon: MapPin },
  ];

  return (
    <>
      <main className="main-content">{children}</main>
      <nav className="nav-container">
        <div className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = router.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`nav-tab ${isActive ? 'active' : ''}`}
              >
                <Icon size={24} />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
