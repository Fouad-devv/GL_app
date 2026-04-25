import { useLocation } from 'react-router-dom';
import { Sidebar } from './Navigate';

export const Layout = ({ children, isOpen, setIsOpen, openProfile, setOpenProfile, closeSidebar }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
      />
      <div
        className="flex-1 overflow-auto"
        style={{
          background: '#faf5ec',
          backgroundImage: 'radial-gradient(rgba(194,65,12,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        onClick={() => { if (isOpen || openProfile) closeSidebar(); }}
      >
        <div key={pathname} className="animate-fadeInPage">
          {children}
        </div>
      </div>
    </div>
  );
};
