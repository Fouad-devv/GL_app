<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>

    <#if section = "header">
        ${msg("loginAccountTitle")}

    <#elseif section = "form">
        <#-- Inject all GMPP CSS + HTML for the custom login UI -->
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

            /* ── Box sizing reset ── */
            *, *::before, *::after { box-sizing: border-box; }

            /* ── Override KC defaults ── */
            html { background: #060810 !important; }
            body.gmpp { background: #060810 !important; font-family: 'Outfit',sans-serif !important; margin:0; padding:0; min-height:100vh; overflow-x:hidden; }
            body.gmpp #kc-header, body.gmpp .login-pf-page .login-pf-header,
            body.gmpp #kc-header-wrapper { display:none !important; }
            body.gmpp .login-pf-page { background:#060810 !important; }
            body.gmpp .card-pf { display:none !important; }

            /* ── Animations ── */
            @keyframes orb1  { 0%,100%{transform:translate(0,0)}  50%{transform:translate(55px,-38px)} }
            @keyframes orb2  { 0%,100%{transform:translate(0,0)}  50%{transform:translate(-48px,30px)} }
            @keyframes beam  { 0%{transform:translateX(-120%) skewX(-12deg);opacity:0} 8%{opacity:.8} 92%{opacity:.3} 100%{transform:translateX(250vw) skewX(-12deg);opacity:0} }
            @keyframes rise  { 0%{transform:translateY(0);opacity:0} 10%{opacity:.6} 90%{opacity:.15} 100%{transform:translateY(-120px) scale(.3);opacity:0} }
            @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.55)} }
            @keyframes scanBtn { 0%{top:-2px;opacity:0} 6%{opacity:.7} 94%{opacity:.3} 100%{top:100%;opacity:0} }
            @keyframes slideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
            @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
            @keyframes gearSlow { to{transform:rotate(360deg)}  }
            @keyframes gearFast { to{transform:rotate(-360deg)} }
            @keyframes spin { to{transform:rotate(360deg)} }

            /* ── Background ── */
            .g-bg { position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden; }
            .g-dots { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:radial-gradient(rgba(59,130,246,.09) 1px,transparent 1px);background-size:28px 28px; }
            .g-dots::after { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 90% 60% at 50% 0%,transparent 20%,#060810 80%); }
            .g-orb { position:absolute;border-radius:50%;pointer-events:none;filter:blur(90px); }
            .g-o1 { width:700px;height:700px;top:-200px;left:-150px;background:radial-gradient(circle,rgba(29,78,216,.28) 0%,transparent 65%);animation:orb1 20s ease-in-out infinite; }
            .g-o2 { width:500px;height:500px;bottom:-100px;right:-150px;background:radial-gradient(circle,rgba(6,182,212,.18) 0%,transparent 65%);animation:orb2 16s ease-in-out infinite; }
            .g-beam { position:fixed;height:1px;pointer-events:none;z-index:0;background:linear-gradient(90deg,transparent,rgba(59,130,246,.4),rgba(96,165,250,.6),transparent); }
            .g-b1{width:40%;top:18%;animation:beam 8s ease-in-out infinite;}
            .g-b2{width:28%;top:52%;animation:beam 8s ease-in-out infinite;animation-delay:-4s;}
            .g-b3{width:22%;top:80%;animation:beam 8s ease-in-out infinite;animation-delay:-6.5s;}
            .g-part { position:fixed;border-radius:50%;background:#60a5fa;pointer-events:none;z-index:0;animation:rise linear infinite; }

            /* ── Layout ── */
            .g-page { position:relative;z-index:1;min-height:100vh;display:grid;grid-template-columns:1fr 1fr; }

            /* ── Responsive ── */
            @media(max-width:900px){
                .g-page { grid-template-columns:1fr; }
                .g-left { display:none!important; }
            }
            @media(max-width:600px){
                .g-right { padding:32px 20px; align-items:flex-start; padding-top:48px; }
                .g-card  { max-width:100%; }
                .g-ctitle { font-size:24px; }
                .g-csub   { font-size:13px; }
                .g-inp    { font-size:16px; padding:14px 14px 14px 42px; } /* 16px prevents iOS zoom */
                .g-btn    { padding:15px 20px; font-size:15px; }
                .g-chdr   { margin-bottom:22px; }
                .g-chips  { gap:6px; }
                .g-chip   { font-size:9px; padding:4px 10px; }
                .g-sec    { font-size:9px; }
                .g-div    { margin-top:18px; }
                .g-reg    { font-size:13px; }
                .g-form   { gap:14px; }
            }
            @media(max-width:400px){
                .g-right  { padding:28px 16px; padding-top:40px; }
                .g-ctitle { font-size:21px; }
                .g-opts   { flex-direction:column; align-items:flex-start; gap:10px; }
                .g-chips  { flex-direction:column; align-items:center; }
            }

            /* ── Left panel ── */
            .g-left { display:flex;flex-direction:column;justify-content:space-between;padding:48px 52px;border-right:1px solid rgba(59,130,246,.1);animation:fadeIn .8s ease both; }
            .g-brand { display:flex;align-items:center;gap:13px; }
            .g-bmark { width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;box-shadow:0 0 28px rgba(59,130,246,.5); }
            .g-bname { font-weight:800;font-size:21px;letter-spacing:-.025em;background:linear-gradient(135deg,#fff 40%,#93c5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
            .g-bbadge { font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#60a5fa;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.25);padding:3px 10px;border-radius:100px; }
            .g-lcont { animation:slideUp .9s .2s cubic-bezier(.22,1,.36,1) both; }
            .g-eyebrow { display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#60a5fa;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);padding:5px 13px;border-radius:100px;margin-bottom:28px; }
            .g-edot { width:6px;height:6px;border-radius:50%;background:#3b82f6;box-shadow:0 0 8px #3b82f6;animation:pulse 2s ease-in-out infinite; }
            .g-ltitle { font-size:clamp(30px,3.2vw,48px);font-weight:900;line-height:1.07;letter-spacing:-.035em;margin-bottom:18px;color:#e2e8f0; }
            .g-ltitle span { background:linear-gradient(95deg,#60a5fa,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
            .g-ldesc { font-size:15px;line-height:1.75;color:#94a3b8;max-width:360px;margin-bottom:40px; }
            .g-feats { display:flex;flex-direction:column;gap:10px; }
            .g-feat { display:flex;align-items:center;gap:13px;padding:13px 16px;background:rgba(255,255,255,.022);border:1px solid rgba(59,130,246,.1);border-radius:10px;transition:all .25s;cursor:default; }
            .g-feat:hover { background:rgba(59,130,246,.07);border-color:rgba(59,130,246,.28);transform:translateX(6px); }
            .g-fi { font-size:18px;flex-shrink:0; }
            .g-ft { font-size:13px;color:#cbd5e1;font-weight:500; }
            .g-svg  { margin-top:32px;animation:slideUp 1s .4s cubic-bezier(.22,1,.36,1) both; }
            .g-lftr { display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#374151; }
            .g-ldot { width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;animation:pulse 2s ease-in-out infinite; }

            /* ── Right panel ── */
            .g-right { display:flex;align-items:center;justify-content:center;padding:48px 52px;animation:slideUp .8s .1s cubic-bezier(.22,1,.36,1) both; }
            .g-card  { width:100%;max-width:420px; }

            /* Card header */
            .g-chdr { margin-bottom:30px; }
            .g-ctag { display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);padding:5px 12px;border-radius:100px;margin-bottom:16px; }
            .g-ctdot { width:5px;height:5px;border-radius:50%;background:#3b82f6;box-shadow:0 0 6px #3b82f6;animation:pulse 2s ease-in-out infinite; }
            .g-ctitle { font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.03em;margin-bottom:7px;color:#e2e8f0; }
            .g-csub   { font-size:14px;color:#94a3b8;line-height:1.6; }

            /* Alert */
            .g-alert { display:flex;align-items:flex-start;gap:11px;padding:13px 15px;border-radius:10px;margin-bottom:20px;font-size:13px;line-height:1.5;font-weight:500;animation:slideUp .4s ease both; }
            .g-alert.error   { background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);color:#fca5a5; }
            .g-alert.warning { background:rgba(251,191,36,.08); border:1px solid rgba(251,191,36,.3);color:#fde68a; }
            .g-alert.info    { background:rgba(59,130,246,.08);  border:1px solid rgba(59,130,246,.3);color:#93c5fd; }
            .g-alert.success { background:rgba(52,211,153,.08);  border:1px solid rgba(52,211,153,.3);color:#6ee7b7; }

            /* Form */
            .g-form  { display:flex;flex-direction:column;gap:17px; }
            .g-group { display:flex;flex-direction:column;gap:6px; }
            .g-lbl   { font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;font-weight:500; }
            .g-wrap  { position:relative; width:100%; }
            .g-icon  { position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#4b5563;pointer-events:none;display:flex;align-items:center;transition:color .2s; }
            .g-inp   { width:100%;padding:13px 13px 13px 43px;background:rgba(13,18,37,.85);border:1px solid rgba(59,130,246,.18);border-radius:10px;font-family:'Outfit',sans-serif;font-size:15px;color:#e2e8f0;outline:none;transition:border-color .25s,box-shadow .25s;-webkit-appearance:none; }
            .g-inp::placeholder { color:#374151; }
            .g-inp:focus { border-color:rgba(59,130,246,.55);background:rgba(13,18,37,.98);box-shadow:0 0 0 3px rgba(59,130,246,.1); }
            .g-inp:focus ~ .g-icon, .g-wrap:focus-within .g-icon { color:#60a5fa; }
            .g-pwtgl { position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;background:none;border:none;color:#4b5563;padding:4px;display:flex;align-items:center;transition:color .2s; }
            .g-pwtgl:hover { color:#60a5fa; }
            .g-ierr  { font-size:12px;color:#f87171;margin-top:4px;font-weight:500; }

            /* Options */
            .g-opts { display:flex;align-items:center;justify-content:space-between; }
            .g-rem  { display:flex;align-items:center;gap:9px;cursor:pointer; }
            .g-chk  { width:16px;height:16px;border-radius:4px;cursor:pointer;border:1px solid rgba(59,130,246,.3);background:rgba(13,18,37,.8);accent-color:#3b82f6; }
            .g-reml { font-size:13px;color:#94a3b8;cursor:pointer;user-select:none; }
            .g-forg { font-family:'JetBrains Mono',monospace;font-size:11px;color:#60a5fa;text-decoration:none;letter-spacing:.06em;transition:color .2s; }
            .g-forg:hover { color:#06b6d4;text-decoration:underline; }

            /* Submit btn */
            .g-btn { position:relative;overflow:hidden;width:100%;padding:15px 24px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border:none;border-radius:10px;cursor:pointer;font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;transition:transform .2s,box-shadow .2s;margin-top:4px; }
            .g-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,#60a5fa,#3b82f6);opacity:0;transition:opacity .25s; }
            .g-btn::after  { content:'';position:absolute;left:0;width:100%;height:1.5px;background:rgba(255,255,255,.6);animation:scanBtn 3.5s ease-in-out infinite; }
            .g-btn:hover   { transform:translateY(-2px);box-shadow:0 14px 40px rgba(59,130,246,.5); }
            .g-btn:hover::before { opacity:1; }
            .g-btn:active  { transform:translateY(0); }
            .g-binn { position:relative;z-index:1;display:flex;align-items:center;gap:10px; }
            .g-barr { transition:transform .25s; }
            .g-btn:hover .g-barr { transform:translateX(4px); }

            /* Misc */
            .g-sec  { display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#374151; }
            .g-div  { display:flex;align-items:center;gap:14px;margin-top:22px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#374151;letter-spacing:.1em;text-transform:uppercase; }
            .g-div::before,.g-div::after { content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(59,130,246,.15),transparent); }
            .g-reg  { text-align:center;font-size:13px;color:#94a3b8;margin-top:14px; }
            .g-reg a { color:#60a5fa;text-decoration:none;font-weight:600;transition:color .2s; }
            .g-reg a:hover { color:#06b6d4; }
            .g-chips { display:flex;justify-content:center;gap:8px;margin-top:28px;flex-wrap:wrap; }
            .g-chip  { display:flex;align-items:center;gap:6px;padding:5px 13px;border-radius:100px;background:rgba(13,18,37,.8);border:1px solid rgba(59,130,246,.1);font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#4b5563; }
            .g-cdot  { width:5px;height:5px;border-radius:50%;animation:pulse 2s ease-in-out infinite; }
            .g-cdot.gg { background:#34d399;box-shadow:0 0 6px #34d399; }
            .g-cdot.gb { background:#3b82f6;box-shadow:0 0 6px #3b82f6;animation-delay:.5s; }
            .g-cdot.gp { background:#8b5cf6;box-shadow:0 0 6px #8b5cf6;animation-delay:1s; }
        </style>

        <script>document.documentElement.style.background='#060810';document.body.classList.add('gmpp');</script>

        <!-- Background -->
        <div class="g-dots"></div>
        <div class="g-bg">
            <div class="g-orb g-o1"></div>
            <div class="g-orb g-o2"></div>
            <div class="g-beam g-b1"></div>
            <div class="g-beam g-b2"></div>
            <div class="g-beam g-b3"></div>
            <div class="g-part" style="left:14%;bottom:9%;width:2px;height:2px;opacity:.3;animation-delay:0s;animation-duration:9s;"></div>
            <div class="g-part" style="left:35%;bottom:6%;width:3px;height:3px;opacity:.25;animation-delay:2.5s;animation-duration:11s;"></div>
            <div class="g-part" style="left:62%;bottom:18%;width:2px;height:2px;opacity:.2;animation-delay:4s;animation-duration:8s;"></div>
            <div class="g-part" style="left:80%;bottom:11%;width:2px;height:2px;opacity:.3;animation-delay:1s;animation-duration:10s;"></div>
        </div>

        <div class="g-page">

            <!-- ── LEFT branding ── -->
            <div class="g-left">
                <div class="g-brand">
                    <div class="g-bmark">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <circle cx="11" cy="11" r="4" fill="white"/>
                            <rect x="9.8" y=".5" width="2.4" height="4.5" rx="1.2" fill="white" transform="rotate(0   11 11)" transform-origin="11 11"/>
                            <rect x="9.8" y=".5" width="2.4" height="4.5" rx="1.2" fill="white" transform="rotate(60  11 11)" transform-origin="11 11"/>
                            <rect x="9.8" y=".5" width="2.4" height="4.5" rx="1.2" fill="white" transform="rotate(120 11 11)" transform-origin="11 11"/>
                            <rect x="9.8" y=".5" width="2.4" height="4.5" rx="1.2" fill="white" transform="rotate(180 11 11)" transform-origin="11 11"/>
                            <rect x="9.8" y=".5" width="2.4" height="4.5" rx="1.2" fill="white" transform="rotate(240 11 11)" transform-origin="11 11"/>
                            <rect x="9.8" y=".5" width="2.4" height="4.5" rx="1.2" fill="white" transform="rotate(300 11 11)" transform-origin="11 11"/>
                        </svg>
                    </div>
                    <span class="g-bname">GMPP</span>
                    <span class="g-bbadge">v2.0</span>
                </div>
                <div class="g-lcont">
                    <div class="g-eyebrow"><div class="g-edot"></div>Accès sécurisé — SSO Keycloak</div>
                    <h2 class="g-ltitle">Bienvenue sur<br/>la plateforme<br/><span>industrielle</span></h2>
                    <p class="g-ldesc">Gérez votre parc machines, planifiez vos interventions et pilotez vos KPIs.</p>
                    <div class="g-feats">
                        <div class="g-feat"><span class="g-fi">⚙️</span><span class="g-ft">Gestion complète du parc machines</span></div>
                        <div class="g-feat"><span class="g-fi">📅</span><span class="g-ft">Planification préventive intelligente</span></div>
                        <div class="g-feat"><span class="g-fi">📊</span><span class="g-ft">Tableaux de bord & KPIs temps réel</span></div>
                        <div class="g-feat"><span class="g-fi">🔒</span><span class="g-ft">Accès role-based sécurisé JWT</span></div>
                    </div>
                    <div class="g-svg">
                        <svg viewBox="0 0 320 110" fill="none" style="width:100%;max-width:320px;">
                            <line x1="0" y1="28" x2="320" y2="28" stroke="rgba(59,130,246,.06)" stroke-width="1"/>
                            <line x1="0" y1="56" x2="320" y2="56" stroke="rgba(59,130,246,.06)" stroke-width="1"/>
                            <rect x="76"  y="22" width="168" height="76" rx="6" fill="rgba(13,18,37,.9)" stroke="rgba(59,130,246,.3)" stroke-width="1.2"/>
                            <rect x="90"  y="32" width="104" height="52" rx="3" fill="rgba(3,7,18,.9)"   stroke="rgba(59,130,246,.3)" stroke-width="1"/>
                            <rect x="97"  y="68" width="7"   height="12" rx="1" fill="rgba(59,130,246,.7)"/>
                            <rect x="107" y="62" width="7"   height="18" rx="1" fill="rgba(96,165,250,.7)"/>
                            <rect x="117" y="55" width="7"   height="25" rx="1" fill="rgba(6,182,212,.7)"/>
                            <rect x="127" y="64" width="7"   height="16" rx="1" fill="rgba(59,130,246,.7)"/>
                            <rect x="137" y="52" width="7"   height="28" rx="1" fill="rgba(96,165,250,.7)"/>
                            <rect x="147" y="59" width="7"   height="21" rx="1" fill="rgba(6,182,212,.7)"/>
                            <rect x="157" y="48" width="7"   height="32" rx="1" fill="rgba(139,92,246,.7)"/>
                            <polyline points="97,63 107,56 117,51 127,57 137,44 147,48 157,40 167,46 177,42" stroke="rgba(52,211,153,.8)" stroke-width="1.5" fill="none"/>
                            <circle cx="214" cy="37" r="4" fill="#34d399" opacity=".9"/>
                            <circle cx="225" cy="37" r="4" fill="#3b82f6" opacity=".9"/>
                            <circle cx="236" cy="37" r="4" fill="#f59e0b" opacity=".9"/>
                            <g style="transform-origin:42px 60px;animation:gearSlow 12s linear infinite">
                                <circle cx="42" cy="60" r="26" stroke="rgba(59,130,246,.4)" stroke-width="1.5" fill="rgba(13,18,37,.6)"/>
                                <circle cx="42" cy="60" r="16" stroke="rgba(59,130,246,.25)" stroke-width="1" fill="rgba(13,18,37,.8)"/>
                                <circle cx="42" cy="60" r="6" fill="rgba(96,165,250,.5)"/>
                            </g>
                            <g style="transform-origin:278px 40px;animation:gearFast 8s linear infinite">
                                <circle cx="278" cy="40" r="18" stroke="rgba(6,182,212,.4)" stroke-width="1.2" fill="rgba(13,18,37,.6)"/>
                                <circle cx="278" cy="40" r="11" stroke="rgba(6,182,212,.2)" fill="rgba(13,18,37,.8)"/>
                                <circle cx="278" cy="40" r="4" fill="rgba(6,182,212,.5)"/>
                            </g>
                        </svg>
                    </div>
                </div>
                <div class="g-lftr"><div class="g-ldot"></div>Système opérationnel · © 2026 GMPP</div>
            </div>

            <!-- ── RIGHT form ── -->
            <div class="g-right">
                <div class="g-card">
                    <div class="g-chdr">
                        <div class="g-ctag"><div class="g-ctdot"></div>Authentification sécurisée</div>
                        <h1 class="g-ctitle">Connexion</h1>
                        <p class="g-csub">Entrez vos identifiants pour accéder à la plateforme GMPP.</p>
                    </div>

                    <#if message?has_content && !messagesPerField.existsError('username','password')>
                    <div class="g-alert ${message.type}">
                        <span style="font-size:16px;flex-shrink:0"><#if message.type=='error'>⚠<#elseif message.type=='warning'>⚡<#elseif message.type=='success'>✓<#else>ℹ</#if></span>
                        <span>${kcSanitize(message.summary)?no_esc}</span>
                    </div>
                    </#if>

                    <#if realm.password>
                    <form class="g-form" id="kc-form-login" onsubmit="login.disabled=true;return true;" action="${url.loginAction}" method="post">

                        <#if !usernameHidden??>
                        <div class="g-group">
                            <label class="g-lbl" for="username"><#if !realm.loginWithEmailAllowed>Nom d'utilisateur<#elseif !realm.registrationEmailAsUsername>Identifiant ou e-mail<#else>Adresse e-mail</#if></label>
                            <div class="g-wrap">
                                <span class="g-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
                                <input tabindex="1" class="g-inp" id="username" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="username" autocapitalize="off" spellcheck="false" placeholder="<#if !realm.loginWithEmailAllowed>Nom d'utilisateur<#elseif !realm.registrationEmailAsUsername>Identifiant ou e-mail<#else>adresse@example.com</#if>" aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"/>
                            </div>
                            <#if messagesPerField.existsError('username','password')>
                            <span class="g-ierr">${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}</span>
                            </#if>
                        </div>
                        </#if>

                        <div class="g-group">
                            <label class="g-lbl" for="password">Mot de passe</label>
                            <div class="g-wrap">
                                <span class="g-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                                <input tabindex="2" class="g-inp" id="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••••" style="padding-right:42px;" aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"/>
                                <button type="button" class="g-pwtgl" id="gtgl" aria-label="Afficher/Masquer">
                                    <svg id="geye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                            </div>
                            <#if usernameHidden?? && messagesPerField.existsError('username','password')>
                            <span class="g-ierr">${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}</span>
                            </#if>
                        </div>

                        <div class="g-opts">
                            <#if realm.rememberMe && !usernameHidden??>
                            <label class="g-rem"><input tabindex="3" type="checkbox" class="g-chk" id="rememberMe" name="rememberMe" <#if login.rememberMe??>checked</#if>><span class="g-reml">Se souvenir de moi</span></label>
                            <#else><div></div></#if>
                            <#if realm.resetPasswordAllowed><a href="${url.loginResetCredentialsUrl}" class="g-forg">Mot de passe oublié ?</a></#if>
                        </div>

                        <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>

                        <button tabindex="4" class="g-btn" type="submit" id="kc-login" name="login">
                            <span class="g-binn">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                                Se connecter
                                <svg class="g-barr" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                        </button>
                    </form>
                    </#if>

                    <div class="g-sec">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Connexion sécurisée via Keycloak SSO · OAuth 2.0 / JWT
                    </div>

                    <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
                    <div class="g-div">ou</div>
                    <p class="g-reg">Pas encore de compte ? <a tabindex="6" href="${url.registrationUrl}">S'inscrire</a></p>
                    </#if>

                    <div class="g-chips">
                        <div class="g-chip"><div class="g-cdot gg"></div>Système actif</div>
                        <div class="g-chip"><div class="g-cdot gb"></div>98% disponibilité</div>
                        <div class="g-chip"><div class="g-cdot gp"></div>Sécurisé JWT</div>
                    </div>
                </div>
            </div>

        </div>

        <script>
        (function(){
            var t=document.getElementById('gtgl'),p=document.getElementById('password'),e=document.getElementById('geye');
            if(t&&p){t.addEventListener('click',function(){var s=p.type==='password';p.type=s?'text':'password';e.innerHTML=s?'<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>':'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';});}
            var f=document.getElementById('kc-form-login'),b=document.getElementById('kc-login');
            if(f&&b){f.addEventListener('submit',function(){b.disabled=true;var i=b.querySelector('.g-binn');if(i)i.innerHTML='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin .8s linear infinite"><circle cx="12" cy="12" r="10" stroke-opacity=".25"/><path d="M22 12a10 10 0 0 0-10-10" stroke-linecap="round"/></svg> Connexion…';});}
        })();
        </script>

    <#elseif section = "info">
        <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            <div id="kc-registration-container"><div id="kc-registration">
                <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
            </div></div>
        </#if>

    <#elseif section = "socialProviders">
        <#if realm.password && social.providers??>
            <div id="kc-social-providers" class="${properties.kcFormSocialAccountSectionClass!}">
                <hr/><h4>${msg("identity-provider-login-label")}</h4>
                <ul class="${properties.kcFormSocialAccountListClass!} <#if social.providers?size gt 3>${properties.kcFormSocialAccountListGridClass!}</#if>">
                    <#list social.providers as p>
                        <li><a id="social-${p.alias}" class="${properties.kcFormSocialAccountListButtonClass!}" type="button" href="${p.loginUrl}">
                            <#if p.iconClasses?has_content><i class="${properties.kcCommonLogoIdP!} ${p.iconClasses!}" aria-hidden="true"></i><span class="${properties.kcFormSocialAccountNameClass!} kc-social-icon-text">${p.displayName!}</span>
                            <#else><span class="${properties.kcFormSocialAccountNameClass!}">${p.displayName!}</span></#if>
                        </a></li>
                    </#list>
                </ul>
            </div>
        </#if>
    </#if>

</@layout.registrationLayout>
