import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import {
  FiLogOut, FiMenu, FiX,
  FiChevronLeft, FiChevronRight,
} from "react-icons/fi";

import "./navigateStyles.css";
import { NAV_SECTIONS, ROLE_STYLES } from "../data/navigateData";

/* ─── Component ─────────────────────────────────────────────────────────────── */
export const Sidebar = ({ isOpen, setIsOpen, openProfile, setOpenProfile }) => {
  const { keycloak } = useKeycloak();
  const [collapsed, setCollapsed] = useState(false);
  const dropdownRef = useRef(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (openProfile && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openProfile, setOpenProfile]);

  // user info
  const raw      = keycloak.tokenParsed?.preferred_username || "User";
  const username = raw.includes("@") ? raw.split("@")[0] : raw;
  const email    = keycloak.tokenParsed?.email || (raw.includes("@") ? raw : null);
  const initial  = username.charAt(0).toUpperCase();

  // roles
  const allRoles     = keycloak.tokenParsed?.realm_access?.roles || [];
  const filteredRoles = allRoles.filter(
    r => r !== "offline_access" && r !== "uma_authorization" && !r.startsWith("default-roles-")
  );
  const primaryRole = filteredRoles[0] || "utilisateur";
  const roleLabel   = primaryRole.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const roleStyle   = ROLE_STYLES[primaryRole] ?? { badge: "bg-blue-500/20 text-blue-300", dot: "bg-blue-400" };

  const canSee = item => item.roles.length === 0 || item.roles.some(r => filteredRoles.includes(r));




  
  return (
    <>
      {/* ── mobile overlay ── */}
      {isOpen && (
        <div
          className="mobile-overlay fixed inset-0 z-20 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          style={{ opacity: isOpen ? 1 : 0 }}
        />
      )}

      {/* ── mobile top bar ── */}
      <div className="fixed flex items-center gap-3 w-full z-50 md:hidden px-4 py-3"
           style={{ background:'rgba(15,18,30,0.95)', borderBottom:'1px solid rgba(59,130,246,0.12)', backdropFilter:'blur(16px)' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-white transition"
          style={{ background:'rgba(59,130,246,0.2)', border:'1px solid rgba(59,130,246,0.3)' }}
        >
          {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
        <span className="text-lg font-extrabold tracking-widest logo-text">GMPP</span>
      </div>

      {/* ── sidebar panel ── */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 flex flex-col h-screen h-[100dvh]
          shadow-2xl
          transition-[transform,width] duration-300 ease-in-out
          ${collapsed ? "md:w-[68px]" : "md:w-56"}
          ${isOpen ? "translate-x-0 w-56" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          background: 'linear-gradient(180deg, #0e1120 0%, #0a0d18 100%)',
          borderRight: '1px solid rgba(59,130,246,0.10)',
        }}
      >
        {/* ── header ── */}
        <div className="flex items-center h-16 px-4 flex-shrink-0"
             style={{ borderBottom:'1px solid rgba(59,130,246,0.10)' }}>
          <div className="mr-auto flex items-center gap-2.5 overflow-hidden"
               style={{ maxWidth: collapsed ? 0 : 160, opacity: collapsed ? 0 : 1, transition: 'max-width 0.3s ease-in-out, opacity 0.2s ease-in-out' }}>
            <div style={{
              width:30, height:30, borderRadius:7, flexShrink:0,
              background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:800, fontSize:13, color:'#fff',
              boxShadow:'0 4px 12px rgba(59,130,246,0.4)',
            }}>G</div>
            <span className="text-lg font-extrabold tracking-widest logo-text whitespace-nowrap">GMPP</span>
          </div>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="collapse-btn hidden md:flex items-center justify-center w-8 h-8 rounded-lg ml-auto"
            style={{ color:'#4b5563' }}
            onMouseEnter={e => { e.currentTarget.style.color='#93c5fd'; e.currentTarget.style.background='rgba(59,130,246,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='#4b5563'; e.currentTarget.style.background='transparent'; }}
            title={collapsed ? "Agrandir" : "Réduire"}
          >
            {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>
        </div>

        {/* ── navigation ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-5 hide-scrollbar">
          {NAV_SECTIONS.map((section, si) => {
            const visible = section.items.filter(canSee);
            if (visible.length === 0) return null;
            return (
              <div
                key={section.title}
                className="nav-section"
                style={{ animationDelay: `${si * 0.07}s` }}
              >
                <p className="section-label text-[10px] font-bold uppercase tracking-[0.18em] px-3 mb-2"
                   style={{
                     color:'rgba(59,130,246,0.45)',
                     maxHeight: collapsed ? 0 : 20,
                     opacity: collapsed ? 0 : 1,
                     overflow: 'hidden',
                     transition: 'max-height 0.3s ease-in-out, opacity 0.2s ease-in-out',
                     marginBottom: collapsed ? 0 : undefined,
                   }}>
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {visible.map((item, ii) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `nav-link flex items-center px-3 py-2.5 rounded-xl group
                        ${isActive ? "active" : ""}
                        `
                      }
                      style={({ isActive }) => ({
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: collapsed ? 0 : 12,
                        transition: 'gap 0.3s ease-in-out',
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(37,99,235,0.15))'
                          : 'transparent',
                        color: isActive ? '#93c5fd' : '#6b7280',
                        boxShadow: isActive ? 'inset 0 0 0 1px rgba(59,130,246,0.2)' : 'none',
                        animationDelay: `${(si * 4 + ii) * 0.05}s`,
                        animationFillMode: 'both',
                      })}
                      onMouseEnter={e => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
                          e.currentTarget.style.color = '#e5e7eb';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#6b7280';
                        }
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            size={18}
                            style={{
                              flexShrink: 0,
                              color: isActive ? '#60a5fa' : 'inherit',
                              transition: 'color 0.2s',
                              filter: isActive ? 'drop-shadow(0 0 6px rgba(96,165,250,0.5))' : 'none',
                            }}
                          />
                          <span className="text-sm font-medium truncate" style={{
                            transition: 'max-width 0.3s ease-in-out, opacity 0.2s ease-in-out, color 0.15s',
                            maxWidth: collapsed ? 0 : 120,
                            opacity: collapsed ? 0 : 1,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}>
                            {item.label}
                          </span>
                          {/* active indicator dot */}
                          <span style={{
                            marginLeft:'auto', width:6, height:6, borderRadius:'50%',
                            background:'#3b82f6', boxShadow:'0 0 8px #3b82f6', flexShrink:0,
                            maxWidth: collapsed || !isActive ? 0 : 6,
                            opacity: collapsed || !isActive ? 0 : 1,
                            overflow: 'hidden',
                            transition: 'max-width 0.3s ease-in-out, opacity 0.2s ease-in-out',
                          }} />
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── user profile ── */}
        <div className="flex-shrink-0 relative p-3 pb-8 md:pb-3 mb-10 md:mb-0"
             style={{ borderTop:'1px solid rgba(59,130,246,0.10)' }}
             ref={dropdownRef}>

          <button
            onClick={() => setOpenProfile(p => !p)}
            className="profile-btn flex items-center w-full rounded-xl p-2"
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? 0 : 12,
              transition: 'gap 0.3s ease-in-out, background 0.2s, border-color 0.2s',
              background: openProfile ? 'rgba(59,130,246,0.1)' : 'transparent',
              border: '1px solid transparent',
              borderColor: openProfile ? 'rgba(59,130,246,0.2)' : 'transparent',
            }}
          >
            {/* avatar */}
            <div className="avatar-ring" style={{
              width:36, height:36, borderRadius:'50%',
              background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:700, fontSize:14, flexShrink:0,
              boxShadow:'0 4px 14px rgba(59,130,246,0.35)',
              transition:'box-shadow 0.25s',
            }}>
              {initial}
            </div>

            <div className="flex flex-col items-start min-w-0 flex-1" style={{
              maxWidth: collapsed ? 0 : 140,
              opacity: collapsed ? 0 : 1,
              overflow: 'hidden',
              transition: 'max-width 0.3s ease-in-out, opacity 0.2s ease-in-out',
            }}>
              <span className="text-sm font-semibold text-white truncate max-w-[120px]">
                {username}
              </span>
              <span className={`inline-flex items-center gap-1.5 mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleStyle.badge}`}>
                <span className={`role-dot w-1.5 h-1.5 rounded-full flex-shrink-0 ${roleStyle.dot}`} />
                {roleLabel}
              </span>
            </div>

            <FiChevronRight
              size={14}
              style={{
                color:'#4b5563', flexShrink:0,
                maxWidth: collapsed ? 0 : 14,
                opacity: collapsed ? 0 : 1,
                overflow: 'hidden',
                transform: openProfile ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), max-width 0.3s ease-in-out, opacity 0.2s ease-in-out',
              }}
            />
          </button>

          {/* ── profile dropdown ── */}
          <div
            className={`profile-dropdown ${openProfile ? 'open' : ''} absolute z-50 w-56`}
            style={{
              background:'linear-gradient(145deg, #131929, #0e1120)',
              border:'1px solid rgba(59,130,246,0.18)',
              borderRadius:16,
              boxShadow:'0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.05)',
              padding:16,
              ...(collapsed
                ? { left:'calc(100% + 12px)', bottom:8 }
                : { left:12, right:12, bottom:76 }),
              opacity:    openProfile ? 1 : 0,
              transform:  openProfile ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(6px)',
              pointerEvents: openProfile ? 'auto' : 'none',
            }}
          >
            {/* user info */}
            <div className="flex items-center gap-3 mb-4 pb-4"
                 style={{ borderBottom:'1px solid rgba(59,130,246,0.1)' }}>
              <div style={{
                width:42, height:42, borderRadius:'50%',
                background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', fontWeight:700, fontSize:16,
                boxShadow:'0 4px 14px rgba(59,130,246,0.4)',
              }}>
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{username}</p>
                {email && (
                  <p className="text-[11px] text-gray-400 truncate max-w-[140px] mt-0.5">{email}</p>
                )}
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${roleStyle.badge}`}>
                  <span className={`role-dot w-1.5 h-1.5 rounded-full ${roleStyle.dot}`} />
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* logout */}
            <button
              onClick={() => { setOpenProfile(false); keycloak.logout({ redirectUri: window.location.origin + '/' }); }}
              className="logout-btn w-full text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
              style={{
                background:'linear-gradient(135deg, #dc2626, #b91c1c)',
                border:'1px solid rgba(239,68,68,0.25)',
              }}
            >
              <FiLogOut size={14} />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};