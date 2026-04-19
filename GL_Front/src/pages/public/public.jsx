import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiBarChart2, FiCalendar, FiUsers, FiArrowRight, FiShield, FiActivity } from 'react-icons/fi';
import './public.css';

/* ─── Counter hook ───────────────────────────────────────────────────────── */
function useCounter(target, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, active]);
  return val;
}

/* ─── Particles (stable, generated once) ────────────────────────────────── */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id:       i,
  left:     `${8 + (i * 5.8) % 84}%`,
  bottom:   `${(i * 7.3) % 35}%`,
  delay:    `${(i * 1.3) % 11}s`,
  duration: `${7 + (i * 0.9) % 7}s`,
  size:     i % 3 === 0 ? '3px' : '2px',
  opacity:  0.25 + (i % 5) * 0.1,
}));

/* ─── Static data ────────────────────────────────────────────────────────── */
const STATS = [
  { value: 98,  suffix: '%', label: 'Disponibilité' },
  { value: 40,  suffix: '%', label: 'Moins de pannes' },
  { value: 360, suffix: '°', label: 'Visibilité live' },
];

const MODULES = [
  { icon: '⚙️', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  title: 'Machines',    desc: 'Gérez votre parc industriel avec historique complet' },
  { icon: '🔧', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   title: 'Maintenance', desc: 'Points et fréquences de maintenance personnalisés' },
  { icon: '📅', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  title: 'Planning',    desc: 'Calendrier interactif et planification automatique' },
  { icon: '📊', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  title: 'Rapports',    desc: 'Export PDF, Excel, CSV avec KPIs détaillés' },
  { icon: '👥', color: '#34d399', bg: 'rgba(52,211,153,0.12)',  title: 'Équipe',      desc: 'Gestion des techniciens et affectations' },
  { icon: '📈', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', title: 'Dashboard',   desc: 'Indicateurs clés et alertes en temps réel' },
];

const FEATURES = [
  'Gestion machines & historiques',
  'Points de maintenance personnalisés',
  'Suivi des interventions live',
  'Calendrier de planification interactif',
  'KPIs & indicateurs de performance',
  'Rapports exportables (PDF, Excel, CSV)',
  'Gestion utilisateurs & permissions',
  'API REST sécurisée + JWT',
];

const PILLS = [
  { icon: <FiCheckCircle />, color: '#34d399', text: 'Gestion complète machines & points de maintenance' },
  { icon: <FiCalendar />,    color: '#60a5fa', text: 'Planification automatique & intelligente' },
  { icon: <FiBarChart2 />,   color: '#a78bfa', text: 'Tableaux de bord & rapports détaillés' },
  { icon: <FiUsers />,       color: '#06b6d4', text: 'Gestion techniciens & interventions' },
];




/* ─── Component ──────────────────────────────────────────────────────────── */
export const Public = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  const c0 = useCounter(STATS[0].value, 1600, ready);
  const c1 = useCounter(STATS[1].value, 1900, ready);
  const c2 = useCounter(STATS[2].value, 2100, ready);
  const counts = [c0, c1, c2];

  useEffect(() => {
    if (initialized && keycloak.authenticated) navigate('/dashboard');
  }, [keycloak.authenticated, initialized, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = () =>
    keycloak.login({ redirectUri: window.location.origin + '/dashboard' });

  /* ── Loading state ── */
  if (!initialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060810' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: '2px solid rgba(59,130,246,0.18)', borderTop: '2px solid #3b82f6', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#4b5563' }}>Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-root">

      {/* ── Background layers ── */}
      <div className="bg-dots" />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="beam beam-1" />
        <div className="beam beam-2" />
        <div className="beam beam-3" />
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{ left: p.left, bottom: p.bottom, width: p.size, height: p.size, opacity: p.opacity, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}
      </div>

      {/* ── Nav ── */}
      <nav className="p-nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <div className="nav-logo-mark">G</div>
            <span className="nav-logo-text">GMPP</span>
            <span className="nav-badge">v2.0</span>
          </div>
          <button className="nav-btn" onClick={handleLogin}>
            Connexion <FiArrowRight size={13} />
          </button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="hero">
          <div className="hero-grid">

            {/* Left col */}
            <div>
              <div className="anim-in" style={{ animationDelay: '0.05s' }}>
                <div className="eyebrow">
                  <div className="eyebrow-dot" />
                  Système de maintenance industrielle
                </div>
              </div>

              <h1 className="hero-h1 anim-up" style={{ animationDelay: '0.15s' }}>
                Maîtrisez votre<br />
                <span className="h1-blue">maintenance</span><br />
                préventive
              </h1>

              <p className="hero-desc anim-up" style={{ animationDelay: '0.27s' }}>
                Solution complète pour gérer votre parc de machines, planifier vos interventions
                et piloter la performance en temps réel.
              </p>

              <div className="pills anim-up" style={{ animationDelay: '0.37s' }}>
                {PILLS.map((p, i) => (
                  <div key={i} className="pill">
                    <span style={{ color: p.color, fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
                    <span className="pill-text">{p.text}</span>
                  </div>
                ))}
              </div>

              <div className="cta-row anim-up" style={{ animationDelay: '0.5s' }}>
                <button className="btn-primary" onClick={handleLogin}>
                  <span className="btn-inner">
                    Se connecter <FiArrowRight className="btn-arrow" />
                  </span>
                </button>
                <div className="cta-hint">
                  <FiShield style={{ color: '#3b82f6', fontSize: 13 }} />
                  <span className="cta-hint-text">Accès sécurisé via SSO</span>
                </div>
              </div>
            </div>

            {/* Right col */}
            <div className="right-panel anim-right" style={{ animationDelay: '0.28s' }}>

              <div className="stat-grid">
                {STATS.map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-num">{counts[i]}{s.suffix}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="feat-panel">
                <div className="feat-panel-title">Fonctionnalités incluses</div>
                {FEATURES.map((f, i) => (
                  <div key={i} className="feat-item">
                    <div className="feat-dot" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="status-bar">
                <FiActivity style={{ color: '#60a5fa', fontSize: 15, flexShrink: 0 }} />
                <span className="status-text">Système opérationnel · Tous modules actifs</span>
                <div className="status-live" />
              </div>

            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="section-divider" />

        {/* ══ MODULES ════════════════════════════════════════════════════════ */}
        <section className="modules-section">
          <div className="section-head">
            <div className="section-tag">◈ Architecture modulaire</div>
            <h2 className="section-h2">Modules <span>disponibles</span></h2>
            <p className="section-sub">
              Chaque module est conçu pour s'intégrer parfaitement dans votre flux de travail industriel.
            </p>
          </div>

          <div className="modules-grid">
            {MODULES.map((m, i) => (
              <div key={i} className="mod-card">
                <div className="mod-icon-wrap" style={{ background: m.bg }}>{m.icon}</div>
                <div className="mod-title">{m.title}</div>
                <div className="mod-desc">{m.desc}</div>
                <div className="mod-link" style={{ color: m.color }}>
                  <span>Explorer</span>
                  <FiArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA ════════════════════════════════════════════════════════════ */}
        <div className="cta-band">
          <div className="cta-band-inner">
            <h3>Prêt à optimiser votre maintenance ?</h3>
            <p>Accédez à toutes les fonctionnalités de GMPP et prenez le contrôle total de votre parc industriel.</p>
            <button className="btn-primary" onClick={handleLogin} style={{ fontSize: 16, padding: '17px 42px' }}>
              <span className="btn-inner">
                Accéder à la plateforme <FiArrowRight className="btn-arrow" />
              </span>
            </button>
          </div>
        </div>

      </main>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="p-footer">
        <div className="footer-logo">
          <div className="footer-mark">G</div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>GMPP</span>
        </div>
        <p className="footer-copy">© 2026 GMPP — Système de Gestion de Maintenance Préventive Planifiée</p>
      </footer>

    </div>
  );
};