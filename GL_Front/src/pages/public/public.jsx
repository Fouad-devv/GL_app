import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiBarChart2, FiCalendar, FiUsers, FiArrowRight, FiShield, FiActivity, FiSun, FiMoon, FiZap, FiCpu } from 'react-icons/fi';
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

/* ─── Typewriter hook ────────────────────────────────────────────────────── */
function useTypewriter(words, speed = 80, pause = 2200) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    const delay = deleting ? speed / 2 : speed;
    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.substring(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplay(current.substring(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
}

/* ─── Scroll-reveal hook ─────────────────────────────────────────────────── */
function useReveal(threshold = 0.15, enabled = true) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);  // re-runs once keycloak is initialized and real DOM is mounted
  return [ref, on];
}

/* ─── Particles (stable, generated once) ────────────────────────────────── */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id:       i,
  left:     `${8 + (i * 5.8) % 84}%`,
  bottom:   `${(i * 7.3) % 35}%`,
  delay:    `${(i * 1.3) % 11}s`,
  duration: `${7 + (i * 0.9) % 7}s`,
  size:     i % 3 === 0 ? '3px' : i % 5 === 0 ? '4px' : '2px',
  opacity:  0.15 + (i % 5) * 0.05,
}));

/* ─── Static data ────────────────────────────────────────────────────────── */
const STATS = [
  { value: 98,  suffix: '%', label: 'Disponibilité' },
  { value: 40,  suffix: '%', label: 'Moins de pannes' },
  { value: 360, suffix: '°', label: 'Visibilité live' },
];

const MODULES = [
  { icon: '⚙️', color: '#f97316', bg: 'rgba(249,115,22,0.1)',   title: 'Machines',    desc: 'Gérez votre parc industriel avec historique complet' },
  { icon: '🔧', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   title: 'Maintenance', desc: 'Points et fréquences de maintenance personnalisés' },
  { icon: '📅', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',   title: 'Planning',    desc: 'Calendrier interactif et planification automatique' },
  { icon: '📊', color: '#fb923c', bg: 'rgba(251,146,60,0.1)',   title: 'Rapports',    desc: 'Export PDF, Excel, CSV avec KPIs détaillés' },
  { icon: '👥', color: '#10b981', bg: 'rgba(16,185,129,0.1)',   title: 'Équipe',      desc: 'Gestion des techniciens et affectations' },
  { icon: '📈', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',  title: 'Dashboard',   desc: 'Indicateurs clés et alertes en temps réel' },
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
  { icon: <FiCheckCircle />, color: '#10b981', text: 'Gestion complète machines & points de maintenance' },
  { icon: <FiCalendar />,    color: '#fb923c', text: 'Planification automatique & intelligente' },
  { icon: <FiBarChart2 />,   color: '#a78bfa', text: 'Tableaux de bord & rapports détaillés' },
  { icon: <FiUsers />,       color: '#f59e0b', text: 'Gestion techniciens & interventions' },
];

const TYPEWRITER_WORDS = ['maintenance', 'performance', 'fiabilité', 'productivité'];

/* ─── Inline SVG: Industrial Gear Machine ───────────────────────────────── */
const IndustrialSVG = () => (
  <svg viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg" aria-hidden="true">
    {Array.from({ length: 9 }, (_, i) => (
      <line key={`hg-${i}`} x1="20" y1={40 + i * 40} x2="460" y2={40 + i * 40}
        stroke="rgba(249,115,22,0.05)" strokeWidth="1" />
    ))}
    {Array.from({ length: 12 }, (_, i) => (
      <line key={`vg-${i}`} x1={20 + i * 40} y1="20" x2={20 + i * 40} y2="400"
        stroke="rgba(249,115,22,0.05)" strokeWidth="1" />
    ))}

    <rect x="120" y="160" width="240" height="160" rx="8" fill="rgba(19,9,2,0.95)"
      stroke="rgba(249,115,22,0.3)" strokeWidth="1.5" />
    <rect x="130" y="140" width="220" height="28" rx="4" fill="rgba(194,65,12,0.15)"
      stroke="rgba(249,115,22,0.35)" strokeWidth="1" />
    <text x="240" y="159" textAnchor="middle" fill="rgba(251,146,60,0.75)"
      fontFamily="monospace" fontSize="9" letterSpacing="3">GMPP CONTROL</text>

    <rect x="145" y="178" width="140" height="90" rx="4" fill="rgba(8,4,1,0.9)"
      stroke="rgba(249,115,22,0.3)" strokeWidth="1" />
    {Array.from({length:4},(_,i)=>(
      <line key={`sg-${i}`} x1="145" y1={193+i*22} x2="285" y2={193+i*22}
        stroke="rgba(249,115,22,0.06)" strokeWidth="0.5"/>
    ))}
    <rect x="155" y="230" width="10" height="30" rx="2" fill="rgba(249,115,22,0.7)" className="svg-bar svg-bar-1"/>
    <rect x="170" y="220" width="10" height="40" rx="2" fill="rgba(251,146,60,0.7)" className="svg-bar svg-bar-2"/>
    <rect x="185" y="210" width="10" height="50" rx="2" fill="rgba(245,158,11,0.7)" className="svg-bar svg-bar-3"/>
    <rect x="200" y="225" width="10" height="35" rx="2" fill="rgba(249,115,22,0.7)" className="svg-bar svg-bar-4"/>
    <rect x="215" y="215" width="10" height="45" rx="2" fill="rgba(251,146,60,0.7)" className="svg-bar svg-bar-5"/>
    <rect x="230" y="205" width="10" height="55" rx="2" fill="rgba(245,158,11,0.7)" className="svg-bar svg-bar-6"/>
    <rect x="245" y="220" width="10" height="40" rx="2" fill="rgba(249,115,22,0.7)" className="svg-bar svg-bar-7"/>
    <rect x="260" y="210" width="10" height="50" rx="2" fill="rgba(251,146,60,0.7)" className="svg-bar svg-bar-8"/>
    <polyline points="155,215 172,204 189,210 206,196 223,200 240,188 257,193 274,185"
      stroke="rgba(16,185,129,0.85)" strokeWidth="1.5" fill="none" className="svg-line-anim"/>

    <g className="gear-rotate-slow" style={{ transformOrigin: '100px 240px' }}>
      <circle cx="100" cy="240" r="38" stroke="rgba(249,115,22,0.45)" strokeWidth="2" fill="rgba(19,9,2,0.6)" />
      <circle cx="100" cy="240" r="24" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5" fill="rgba(19,9,2,0.8)" />
      <circle cx="100" cy="240" r="8"  fill="rgba(251,146,60,0.35)" />
      {Array.from({length:12},(_,i)=>{
        const angle = (i/12)*Math.PI*2;
        const ix = 100 + Math.cos(angle)*35, iy = 240 + Math.sin(angle)*35;
        const ox = 100 + Math.cos(angle)*42, oy = 240 + Math.sin(angle)*42;
        const nx = 100 + Math.cos(angle + 0.22)*38, ny = 240 + Math.sin(angle + 0.22)*38;
        const mx = 100 + Math.cos(angle - 0.22)*38, my = 240 + Math.sin(angle - 0.22)*38;
        return <polygon key={i} points={`${ix},${iy} ${nx},${ny} ${ox},${oy} ${mx},${my}`}
          fill="rgba(249,115,22,0.55)" stroke="rgba(249,115,22,0.2)" strokeWidth="0.5"/>;
      })}
      {Array.from({length:4},(_,i)=>{
        const angle = (i/4)*Math.PI*2;
        return <line key={`sp-${i}`}
          x1={100+Math.cos(angle)*9} y1={240+Math.sin(angle)*9}
          x2={100+Math.cos(angle)*22} y2={240+Math.sin(angle)*22}
          stroke="rgba(251,146,60,0.45)" strokeWidth="2"/>;
      })}
    </g>

    <g className="gear-rotate-fast" style={{ transformOrigin: '62px 197px' }}>
      <circle cx="62" cy="197" r="22" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" fill="rgba(19,9,2,0.6)" />
      <circle cx="62" cy="197" r="13" stroke="rgba(245,158,11,0.28)" strokeWidth="1" fill="rgba(19,9,2,0.8)" />
      <circle cx="62" cy="197" r="5"  fill="rgba(245,158,11,0.4)" />
      {Array.from({length:8},(_,i)=>{
        const angle = (i/8)*Math.PI*2;
        const ix = 62 + Math.cos(angle)*20, iy = 197 + Math.sin(angle)*20;
        const ox = 62 + Math.cos(angle)*25, oy = 197 + Math.sin(angle)*25;
        const nx = 62 + Math.cos(angle+0.28)*22, ny = 197 + Math.sin(angle+0.28)*22;
        const mx = 62 + Math.cos(angle-0.28)*22, my = 197 + Math.sin(angle-0.28)*22;
        return <polygon key={i} points={`${ix},${iy} ${nx},${ny} ${ox},${oy} ${mx},${my}`}
          fill="rgba(245,158,11,0.55)" stroke="rgba(245,158,11,0.15)" strokeWidth="0.5"/>;
      })}
    </g>

    <g className="gear-rotate-medium" style={{ transformOrigin: '388px 250px' }}>
      <circle cx="388" cy="250" r="30" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5" fill="rgba(10,22,52,0.6)" />
      <circle cx="388" cy="250" r="18" stroke="rgba(139,92,246,0.25)" strokeWidth="1" fill="rgba(10,22,52,0.8)" />
      <circle cx="388" cy="250" r="6"  fill="rgba(167,139,250,0.35)" />
      {Array.from({length:10},(_,i)=>{
        const angle = (i/10)*Math.PI*2;
        const ix = 388 + Math.cos(angle)*27, iy = 250 + Math.sin(angle)*27;
        const ox = 388 + Math.cos(angle)*33, oy = 250 + Math.sin(angle)*33;
        const nx = 388 + Math.cos(angle+0.24)*30, ny = 250 + Math.sin(angle+0.24)*30;
        const mx = 388 + Math.cos(angle-0.24)*30, my = 250 + Math.sin(angle-0.24)*30;
        return <polygon key={i} points={`${ix},${iy} ${nx},${ny} ${ox},${oy} ${mx},${my}`}
          fill="rgba(139,92,246,0.55)" stroke="rgba(139,92,246,0.15)" strokeWidth="0.5"/>;
      })}
    </g>

    <line x1="138" y1="240" x2="120" y2="240" stroke="rgba(249,115,22,0.35)" strokeWidth="3" strokeLinecap="round"/>
    <line x1="360" y1="240" x2="360" y2="250" stroke="rgba(139,92,246,0.35)" strokeWidth="3" strokeLinecap="round"/>
    <path d="M360,250 Q370,250 370,240" stroke="rgba(139,92,246,0.35)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M100,202 Q100,160 140,140" stroke="rgba(245,158,11,0.2)" strokeWidth="1" fill="none" strokeDasharray="4 3"/>

    <circle cx="305" cy="188" r="5" fill="#10b981" className="svg-led-pulse"/>
    <circle cx="320" cy="188" r="5" fill="#fb923c" className="svg-led-pulse" style={{animationDelay:'0.4s'}}/>
    <circle cx="335" cy="188" r="5" fill="#f59e0b" className="svg-led-pulse" style={{animationDelay:'0.8s'}}/>

    <rect x="300" y="202" width="46" height="14" rx="3" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.28)" strokeWidth="1"/>
    <text x="323" y="213" textAnchor="middle" fill="rgba(251,146,60,0.75)" fontFamily="monospace" fontSize="7">START</text>
    <rect x="300" y="222" width="46" height="14" rx="3" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.22)" strokeWidth="1"/>
    <text x="323" y="233" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontFamily="monospace" fontSize="7">REPORT</text>
    <rect x="300" y="242" width="46" height="14" rx="3" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.2)" strokeWidth="1"/>
    <text x="323" y="253" textAnchor="middle" fill="rgba(167,139,250,0.65)" fontFamily="monospace" fontSize="7">CONFIG</text>

    <rect x="100" y="320" width="280" height="12" rx="4" fill="rgba(194,65,12,0.12)" stroke="rgba(249,115,22,0.18)" strokeWidth="1"/>
    <rect x="140" y="332" width="200" height="6" rx="3" fill="rgba(249,115,22,0.08)"/>

    <circle r="3" fill="rgba(16,185,129,0.9)" className="svg-packet-1">
      <animateMotion dur="3s" repeatCount="indefinite" path="M145,268 L285,268"/>
    </circle>
    <circle r="2.5" fill="rgba(251,146,60,0.9)" className="svg-packet-2">
      <animateMotion dur="4s" repeatCount="indefinite" begin="-1.5s" path="M285,220 L145,220"/>
    </circle>

    <path d="M20,30 L40,30 L40,50" stroke="rgba(249,115,22,0.25)" strokeWidth="1" fill="none"/>
    <path d="M460,30 L440,30 L440,50" stroke="rgba(249,115,22,0.25)" strokeWidth="1" fill="none"/>
    <path d="M20,390 L40,390 L40,370" stroke="rgba(249,115,22,0.25)" strokeWidth="1" fill="none"/>
    <path d="M460,390 L440,390 L440,370" stroke="rgba(249,115,22,0.25)" strokeWidth="1" fill="none"/>

    <g className="svg-float-1">
      <rect x="310" y="100" width="100" height="28" rx="6" fill="rgba(19,9,2,0.95)" stroke="rgba(16,185,129,0.35)" strokeWidth="1"/>
      <circle cx="324" cy="114" r="4" fill="#10b981" className="svg-led-pulse"/>
      <text x="334" y="118" fill="rgba(52,211,153,0.9)" fontFamily="monospace" fontSize="9">98% uptime</text>
    </g>
    <g className="svg-float-2">
      <rect x="30" y="290" width="90" height="28" rx="6" fill="rgba(19,9,2,0.95)" stroke="rgba(249,115,22,0.38)" strokeWidth="1"/>
      <circle cx="44" cy="304" r="4" fill="#f97316" className="svg-led-pulse" style={{animationDelay:'0.5s'}}/>
      <text x="53" y="308" fill="rgba(251,146,60,0.9)" fontFamily="monospace" fontSize="9">Live KPIs</text>
    </g>
    <g className="svg-float-3">
      <rect x="330" y="355" width="108" height="28" rx="6" fill="rgba(19,9,2,0.95)" stroke="rgba(139,92,246,0.35)" strokeWidth="1"/>
      <circle cx="344" cy="369" r="4" fill="#8b5cf6" className="svg-led-pulse" style={{animationDelay:'1s'}}/>
      <text x="354" y="373" fill="rgba(167,139,250,0.9)" fontFamily="monospace" fontSize="9">AI Planning</text>
    </g>
  </svg>
);

/* ─── SVG: Animated network topology ────────────────────────────────────── */
const NetworkSVG = () => (
  <svg viewBox="0 0 900 500" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="network-svg" aria-hidden="true">
    {[
      [100,80],[300,60],[500,90],[700,75],[850,110],
      [50,200],[200,230],[400,210],[600,240],[800,220],
      [150,350],[350,380],[550,360],[750,340],
      [80,440],[450,460],[820,430]
    ].map(([cx,cy],i)=>(
      <g key={i}>
        <circle cx={cx} cy={cy} r="4" fill="rgba(249,115,22,0.5)" className="net-node"/>
        <circle cx={cx} cy={cy} r="10" fill="none" stroke="rgba(249,115,22,0.1)"
          strokeWidth="1" className="net-ring"/>
      </g>
    ))}
    {[
      [[100,80],[300,60]],[[300,60],[500,90]],[[500,90],[700,75]],[[700,75],[850,110]],
      [[100,80],[50,200]],[[300,60],[200,230]],[[500,90],[400,210]],
      [[700,75],[600,240]],[[850,110],[800,220]],
      [[50,200],[200,230]],[[200,230],[400,210]],[[400,210],[600,240]],[[600,240],[800,220]],
      [[200,230],[150,350]],[[400,210],[350,380]],[[600,240],[550,360]],[[800,220],[750,340]],
      [[150,350],[350,380]],[[350,380],[550,360]],[[550,360],[750,340]],
      [[150,350],[80,440]],[[350,380],[450,460]],[[750,340],[820,430]],
    ].map(([[x1,y1],[x2,y2]],i)=>(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="rgba(249,115,22,0.07)" strokeWidth="1"/>
    ))}
    <circle r="3" fill="rgba(251,146,60,0.7)">
      <animateMotion dur="4s" repeatCount="indefinite"
        path="M100,80 L300,60 L500,90 L700,75 L850,110"/>
    </circle>
    <circle r="2.5" fill="rgba(245,158,11,0.7)">
      <animateMotion dur="5s" repeatCount="indefinite" begin="-2s"
        path="M50,200 L200,230 L400,210 L600,240 L800,220"/>
    </circle>
    <circle r="2" fill="rgba(16,185,129,0.7)">
      <animateMotion dur="6s" repeatCount="indefinite" begin="-1s"
        path="M150,350 L350,380 L550,360 L750,340"/>
    </circle>
  </svg>
);


/* ─── Component ──────────────────────────────────────────────────────────── */
export const Public = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [lightMode, setLightMode] = useState(false);

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

  const typewriterText = useTypewriter(TYPEWRITER_WORDS);
  const [hoveredMod, setHoveredMod] = useState(null);

  // Scroll progress
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setScrollPct(Math.min((scrollTop / (scrollHeight - clientHeight)) * 100, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll reveals — pass `initialized` so the observer is only set up
  // after Keycloak finishes and the real DOM (with refs) is mounted
  const [sectHeadRef, sectHeadOn] = useReveal(0.25, initialized);
  const [modulesRef,  modulesOn]  = useReveal(0.05, initialized);
  const [ctaRef,      ctaOn]      = useReveal(0.2,  initialized);

  // SVG panel 3D tilt on hero mouse-move
  const svgPanelRef = useRef(null);
  const handleHeroMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    if (svgPanelRef.current) {
      svgPanelRef.current.style.transform =
        `rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    }
  };
  const handleHeroMouseLeave = () => {
    if (svgPanelRef.current) {
      svgPanelRef.current.style.transition =
        'transform 0.65s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s';
      svgPanelRef.current.style.transform = '';
      setTimeout(() => {
        if (svgPanelRef.current) svgPanelRef.current.style.transition = '';
      }, 650);
    }
  };

  // Card spotlight + 3D tilt
  const handleCardMouseMove = (e) => {
    const el = e.currentTarget;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    el.style.setProperty('--spot-x', `${x * 100}%`);
    el.style.setProperty('--spot-y', `${y * 100}%`);
    el.style.transform =
      `translateY(-8px) rotateX(${(y - 0.5) * -10}deg) rotateY(${(x - 0.5) * 10}deg)`;
  };
  const handleCardMouseLeave = (e, i) => {
    const el = e.currentTarget;
    el.style.transition =
      'transform 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, box-shadow 0.3s';
    el.style.transform = '';
    setTimeout(() => { el.style.transition = ''; }, 560);
    setHoveredMod(null);
  };

  if (!initialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080401' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="p-loading-spinner" />
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#475569', marginTop: 12 }}>Initialisation…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-root${lightMode ? ' light' : ''}`}>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      {/* ── Network SVG background ── */}
      <div className="network-bg">
        <NetworkSVG />
      </div>

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
            <div className="nav-logo-mark">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="3" fill="white"/>
                {Array.from({length:6},(_,i)=>{
                  const a=(i/6)*Math.PI*2;
                  return <rect key={i} x="8.2" y="1" width="1.6" height="3" rx="0.8" fill="white"
                    transform={`rotate(${a*(180/Math.PI)} 9 9)`}/>;
                })}
              </svg>
            </div>
            <span className="nav-logo-text">GMPP</span>
            <span className="nav-badge">v2.0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="nav-status">
              <div className="nav-status-dot"/>
              <span>Système actif</span>
            </div>
            <button className="theme-toggle" onClick={() => setLightMode(m => !m)} title={lightMode ? 'Mode sombre' : 'Mode clair'}>
              {lightMode ? <FiMoon size={15} /> : <FiSun size={15} />}
            </button>
            <button className="nav-btn" onClick={handleLogin}>
              Connexion <FiArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="hero" onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
          <div className="hero-grid">

            {/* Left col */}
            <div className="hero-left">
              <div className="anim-in" style={{ animationDelay: '0.05s' }}>
                <div className="eyebrow">
                  <div className="eyebrow-dot" />
                  Système de maintenance industrielle
                </div>
              </div>

              <h1 className="hero-h1 anim-up" style={{ animationDelay: '0.15s' }}>
                Maîtrisez votre<br />
                <span className="h1-blue h1-typewriter">
                  {typewriterText}
                  <span className="typewriter-cursor">|</span>
                </span>
                <br />
                <span className="h1-dim">préventive</span>
              </h1>

              <p className="hero-desc anim-up" style={{ animationDelay: '0.27s' }}>
                Solution complète pour gérer votre parc de machines, planifier vos interventions
                et piloter la performance en temps réel.
              </p>

              <div className="pills anim-up" style={{ animationDelay: '0.37s' }}>
                {PILLS.map((p, i) => (
                  <div key={i} className="pill">
                    <span className="pill-icon" style={{ color: p.color }}>{p.icon}</span>
                    <span className="pill-text">{p.text}</span>
                  </div>
                ))}
              </div>

              <div className="cta-row anim-up" style={{ animationDelay: '0.5s' }}>
                <button className="btn-primary" onClick={handleLogin}>
                  <div className="btn-ring" />
                  <div className="btn-ring btn-ring-2" />
                  <span className="btn-inner">
                    Se connecter <FiArrowRight className="btn-arrow" />
                  </span>
                </button>
                <div className="cta-hint">
                  <FiShield style={{ color: '#f97316', fontSize: 13, flexShrink: 0 }} />
                  <span className="cta-hint-text">Accès sécurisé via SSO · Keycloak</span>
                </div>
              </div>

              <div className="mini-kpi-row anim-up" style={{ animationDelay: '0.65s' }}>
                {STATS.map((s, i) => (
                  <div key={i} className="mini-kpi">
                    <div className="mini-kpi-num">{counts[i]}{s.suffix}</div>
                    <div className="mini-kpi-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right col — SVG panel */}
            <div className="hero-right anim-right" style={{ animationDelay: '0.3s' }}>
              <div className="svg-panel" ref={svgPanelRef}>
                <div className="svg-panel-header">
                  <span className="svg-panel-title">
                    <FiCpu size={11}/> Tableau de contrôle interactif
                  </span>
                  <div className="svg-panel-dots">
                    <span className="svg-dot red"/>
                    <span className="svg-dot yellow"/>
                    <span className="svg-dot green"/>
                  </div>
                </div>
                <IndustrialSVG />
                <div className="svg-panel-footer">
                  <FiActivity size={11} style={{color:'#10b981'}}/>
                  <span>Tous les systèmes opérationnels</span>
                  <div className="status-live" style={{marginLeft:'auto'}}/>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Divider ── */}
        <div className="section-divider" />

        {/* ══ MODULES ════════════════════════════════════════════════════════ */}
        <section className="modules-section">
          <div className={`section-head${sectHeadOn ? ' revealed' : ''}`} ref={sectHeadRef}>
            <div className="section-tag">◈ Architecture modulaire</div>
            <h2 className="section-h2">Modules <span>disponibles</span></h2>
            <p className="section-sub">
              Chaque module est conçu pour s'intégrer parfaitement dans votre flux de travail industriel.
            </p>
          </div>

          <div className={`modules-grid${modulesOn ? ' revealed' : ''}`} ref={modulesRef}>
            {MODULES.map((m, i) => (
              <div key={i} className="mod-card-outer" style={{ '--reveal-delay': `${i * 0.08}s` }}>
                <div
                  className="mod-card"
                  onMouseEnter={() => setHoveredMod(i)}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={(e) => handleCardMouseLeave(e, i)}
                >
                  <div className="mod-spotlight" />
                  <div className="mod-glow" style={{ '--mod-color': m.color }} />
                  <div className="mod-icon-wrap" style={{ background: m.bg }}>
                    <span className="mod-icon-inner" style={{ fontSize: 22 }}>{m.icon}</span>
                  </div>
                  <div className="mod-title">{m.title}</div>
                  <div className="mod-desc">{m.desc}</div>
                  <div className="mod-link" style={{ color: m.color }}>
                    <span>Explorer</span>
                    <FiArrowRight size={12} />
                  </div>
                  <div className="mod-shimmer" />
                  <div className="mod-accent" style={{ background: m.color }}/>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA ════════════════════════════════════════════════════════════ */}
        <div className="cta-band">
          <div className={`cta-band-inner cta-reveal${ctaOn ? ' revealed' : ''}`} ref={ctaRef}>
            <div className="cta-band-icon">
              <FiZap size={26} />
            </div>
            <h3>Prêt à optimiser votre maintenance ?</h3>
            <p>Accédez à toutes les fonctionnalités de GMPP et prenez le contrôle total de votre parc industriel.</p>
            <button className="btn-primary" onClick={handleLogin} style={{ fontSize: 15, padding: '16px 40px' }}>
              <div className="btn-ring" />
              <div className="btn-ring btn-ring-2" />
              <span className="btn-inner">
                Accéder à la plateforme <FiArrowRight className="btn-arrow" />
              </span>
            </button>
            <div className="cta-features-row">
              {FEATURES.slice(0,4).map((f,i) => (
                <div key={i} className="cta-feature-chip">
                  <FiCheckCircle size={11} style={{color:'#10b981'}}/>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="p-footer">
        <div className="footer-logo">
          <div className="footer-mark">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2.5" fill="white"/>
              {Array.from({length:6},(_,i)=>{
                const a=(i/6)*Math.PI*2;
                return <rect key={i} x="5.5" y="0.5" width="1" height="2" rx="0.5" fill="white"
                  transform={`rotate(${a*(180/Math.PI)} 6 6)`}/>;
              })}
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>GMPP</span>
        </div>
        <p className="footer-copy">© 2026 GMPP — Système de Gestion de Maintenance Préventive Planifiée</p>
      </footer>

    </div>
  );
};
