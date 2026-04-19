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
        className="flex-1 overflow-auto bg-gray-50"
        onClick={() => { if (isOpen || openProfile) closeSidebar(); }}
      >
        <div key={pathname} className="animate-fadeInPage">
          {children}
        </div>
      </div>
    </div>
  );
};
