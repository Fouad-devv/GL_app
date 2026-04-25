<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('password','password-confirm'); section>

    <#if section = "header">
        ${msg("updatePasswordTitle")}

    <#elseif section = "form">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

            *, *::before, *::after { box-sizing: border-box; }

            html { background: #080401 !important; }
            body.gmpp { background: #080401 !important; font-family: 'Outfit',sans-serif !important; margin:0; padding:0; min-height:100vh; overflow-x:hidden; }
            body.gmpp #kc-header, body.gmpp .login-pf-page .login-pf-header,
            body.gmpp #kc-header-wrapper { display:none !important; }
            body.gmpp .login-pf-page { background:#060810 !important; }
            body.gmpp .card-pf { display:none !important; }

            @keyframes orb1  { 0%,100%{transform:translate(0,0)}  50%{transform:translate(55px,-38px)} }
            @keyframes orb2  { 0%,100%{transform:translate(0,0)}  50%{transform:translate(-48px,30px)} }
            @keyframes beam  { 0%{transform:translateX(-120%) skewX(-12deg);opacity:0} 8%{opacity:.8} 92%{opacity:.3} 100%{transform:translateX(250vw) skewX(-12deg);opacity:0} }
            @keyframes rise  { 0%{transform:translateY(0);opacity:0} 10%{opacity:.6} 90%{opacity:.15} 100%{transform:translateY(-120px) scale(.3);opacity:0} }
            @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.55)} }
            @keyframes scanBtn { 0%{top:-2px;opacity:0} 6%{opacity:.7} 94%{opacity:.3} 100%{top:100%;opacity:0} }
            @keyframes slideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
            @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
            @keyframes gearSlow { to{transform:rotate(360deg)} }
            @keyframes gearFast { to{transform:rotate(-360deg)} }
            @keyframes spin { to{transform:rotate(360deg)} }

            .g-bg   { position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden; }
            .g-dots { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:radial-gradient(rgba(249,115,22,.09) 1px,transparent 1px);background-size:28px 28px; }
            .g-dots::after { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 90% 60% at 50% 0%,transparent 20%,#060810 80%); }
            .g-orb  { position:absolute;border-radius:50%;pointer-events:none;filter:blur(90px); }
            .g-o1   { width:700px;height:700px;top:-200px;left:-150px;background:radial-gradient(circle,rgba(194,65,12,.28) 0%,transparent 65%);animation:orb1 20s ease-in-out infinite; }
            .g-o2   { width:500px;height:500px;bottom:-100px;right:-150px;background:radial-gradient(circle,rgba(245,158,11,.18) 0%,transparent 65%);animation:orb2 16s ease-in-out infinite; }
            .g-beam { position:fixed;height:1px;pointer-events:none;z-index:0;background:linear-gradient(90deg,transparent,rgba(249,115,22,.4),rgba(251,146,60,.6),transparent); }
            .g-b1{width:40%;top:18%;animation:beam 8s ease-in-out infinite;}
            .g-b2{width:28%;top:52%;animation:beam 8s ease-in-out infinite;animation-delay:-4s;}
            .g-b3{width:22%;top:80%;animation:beam 8s ease-in-out infinite;animation-delay:-6.5s;}
            .g-part { position:fixed;border-radius:50%;background:#fb923c;pointer-events:none;z-index:0;animation:rise linear infinite; }

            .g-page { position:relative;z-index:1;min-height:100vh;display:grid;grid-template-columns:1fr 1fr; }

            @media(max-width:900px){
                .g-page { grid-template-columns:1fr; }
                .g-left { display:none!important; }
            }
            @media(max-width:600px){
                .g-right { padding:32px 20px; align-items:flex-start; padding-top:48px; }
                .g-card  { max-width:100%; }
                .g-ctitle { font-size:24px; }
                .g-csub   { font-size:13px; }
                .g-inp    { font-size:16px; padding:14px 14px 14px 42px; }
                .g-btn    { padding:15px 20px; font-size:15px; }
                .g-chdr   { margin-bottom:22px; }
            }
            @media(max-width:400px){
                .g-right  { padding:28px 16px; padding-top:40px; }
                .g-ctitle { font-size:21px; }
            }

            .g-left { display:flex;flex-direction:column;justify-content:space-between;padding:48px 52px;border-right:1px solid rgba(249,115,22,.1);animation:fadeIn .8s ease both; }
            .g-brand { display:flex;align-items:center;gap:13px; }
            .g-bmark { width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#f97316,#ea580c);display:flex;align-items:center;justify-content:center;box-shadow:0 0 28px rgba(249,115,22,.5); }
            .g-bname { font-weight:800;font-size:21px;letter-spacing:-.025em;background:linear-gradient(135deg,#fff 40%,#fdba74);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
            .g-bbadge { font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#fb923c;background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.25);padding:3px 10px;border-radius:100px; }
            .g-lcont { animation:slideUp .9s .2s cubic-bezier(.22,1,.36,1) both; }
            .g-eyebrow { display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#fb923c;background:rgba(249,115,22,.08);border:1px solid rgba(249,115,22,.2);padding:5px 13px;border-radius:100px;margin-bottom:28px; }
            .g-edot { width:6px;height:6px;border-radius:50%;background:#f97316;box-shadow:0 0 8px #f97316;animation:pulse 2s ease-in-out infinite; }
            .g-ltitle { font-size:clamp(30px,3.2vw,48px);font-weight:900;line-height:1.07;letter-spacing:-.035em;margin-bottom:18px;color:#e2e8f0; }
            .g-ltitle span { background:linear-gradient(95deg,#fb923c,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
            .g-ldesc { font-size:15px;line-height:1.75;color:#94a3b8;max-width:360px;margin-bottom:40px; }
            .g-feats { display:flex;flex-direction:column;gap:10px; }
            .g-feat { display:flex;align-items:center;gap:13px;padding:13px 16px;background:rgba(255,255,255,.022);border:1px solid rgba(249,115,22,.1);border-radius:10px;transition:all .25s;cursor:default; }
            .g-feat:hover { background:rgba(249,115,22,.07);border-color:rgba(249,115,22,.28);transform:translateX(6px); }
            .g-fi { font-size:18px;flex-shrink:0; }
            .g-ft { font-size:13px;color:#cbd5e1;font-weight:500; }
            .g-svg  { margin-top:32px;animation:slideUp 1s .4s cubic-bezier(.22,1,.36,1) both; }
            .g-lftr { display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#374151; }
            .g-ldot { width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;animation:pulse 2s ease-in-out infinite; }

            .g-right { display:flex;align-items:center;justify-content:center;padding:48px 52px;animation:slideUp .8s .1s cubic-bezier(.22,1,.36,1) both; }
            .g-card  { width:100%;max-width:420px; }

            .g-chdr { margin-bottom:30px; }
            .g-ctag { display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#fb923c;background:rgba(249,115,22,.08);border:1px solid rgba(249,115,22,.2);padding:5px 12px;border-radius:100px;margin-bottom:16px; }
            .g-ctdot { width:5px;height:5px;border-radius:50%;background:#f97316;box-shadow:0 0 6px #f97316;animation:pulse 2s ease-in-out infinite; }
            .g-ctitle { font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.03em;margin-bottom:7px;color:#e2e8f0; }
            .g-csub   { font-size:14px;color:#94a3b8;line-height:1.6; }

            .g-alert { display:flex;align-items:flex-start;gap:11px;padding:13px 15px;border-radius:10px;margin-bottom:20px;font-size:13px;line-height:1.5;font-weight:500;animation:slideUp .4s ease both; }
            .g-alert.error   { background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);color:#fca5a5; }
            .g-alert.warning { background:rgba(251,191,36,.08); border:1px solid rgba(251,191,36,.3);color:#fde68a; }
            .g-alert.info    { background:rgba(249,115,22,.08);  border:1px solid rgba(249,115,22,.3);color:#fdba74; }
            .g-alert.success { background:rgba(52,211,153,.08);  border:1px solid rgba(52,211,153,.3);color:#6ee7b7; }

            .g-form  { display:flex;flex-direction:column;gap:17px; }
            .g-group { display:flex;flex-direction:column;gap:6px; }
            .g-lbl   { font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;font-weight:500; }
            .g-wrap  { position:relative;width:100%; }
            .g-icon  { position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#4b5563;pointer-events:none;display:flex;align-items:center;transition:color .2s; }
            .g-inp   { width:100%;padding:13px 13px 13px 43px;background:rgba(13,18,37,.85);border:1px solid rgba(249,115,22,.18);border-radius:10px;font-family:'Outfit',sans-serif;font-size:15px;color:#e2e8f0;outline:none;transition:border-color .25s,box-shadow .25s;-webkit-appearance:none; }
            .g-inp::placeholder { color:#374151; }
            .g-inp:focus { border-color:rgba(249,115,22,.55);background:rgba(13,18,37,.98);box-shadow:0 0 0 3px rgba(249,115,22,.1); }
            .g-inp:focus ~ .g-icon, .g-wrap:focus-within .g-icon { color:#fb923c; }
            .g-pwtgl { position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;background:none;border:none;color:#4b5563;padding:4px;display:flex;align-items:center;transition:color .2s; }
            .g-pwtgl:hover { color:#fb923c; }
            .g-ierr  { font-size:12px;color:#f87171;margin-top:4px;font-weight:500; }

            /* Sign out from other devices toggle */
            .g-signout { display:flex;align-items:center;gap:10px;padding:13px 15px;background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.12);border-radius:10px;cursor:pointer;transition:all .2s; }
            .g-signout:hover { background:rgba(249,115,22,.08);border-color:rgba(249,115,22,.25); }
            .g-signout input[type="checkbox"] { width:16px;height:16px;border-radius:4px;cursor:pointer;border:1px solid rgba(249,115,22,.3);background:rgba(13,18,37,.8);accent-color:#f97316;flex-shrink:0; }
            .g-signout-label { display:flex;flex-direction:column;gap:2px;cursor:pointer; }
            .g-signout-title { font-size:13px;color:#cbd5e1;font-weight:500; }
            .g-signout-sub   { font-size:11px;color:#4b5563;font-family:'JetBrains Mono',monospace; }

            .g-btn { position:relative;overflow:hidden;width:100%;padding:15px 24px;background:linear-gradient(135deg,#f97316,#ea580c);border:none;border-radius:10px;cursor:pointer;font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;transition:transform .2s,box-shadow .2s;margin-top:4px; }
            .g-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,#fb923c,#f97316);opacity:0;transition:opacity .25s; }
            .g-btn::after  { content:'';position:absolute;left:0;width:100%;height:1.5px;background:rgba(255,255,255,.6);animation:scanBtn 3.5s ease-in-out infinite; }
            .g-btn:hover   { transform:translateY(-2px);box-shadow:0 14px 40px rgba(249,115,22,.5); }
            .g-btn:hover::before { opacity:1; }
            .g-btn:active  { transform:translateY(0); }
            .g-binn { position:relative;z-index:1;display:flex;align-items:center;gap:10px; }
            .g-barr { transition:transform .25s; }
            .g-btn:hover .g-barr { transform:translateX(4px); }

            .g-sec  { display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#374151; }
            .g-chips { display:flex;justify-content:center;gap:8px;margin-top:28px;flex-wrap:wrap; }
            .g-chip  { display:flex;align-items:center;gap:6px;padding:5px 13px;border-radius:100px;background:rgba(13,18,37,.8);border:1px solid rgba(249,115,22,.1);font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#4b5563; }
            .g-cdot  { width:5px;height:5px;border-radius:50%;animation:pulse 2s ease-in-out infinite; }
            .g-cdot.gg { background:#34d399;box-shadow:0 0 6px #34d399; }
            .g-cdot.gb { background:#f97316;box-shadow:0 0 6px #f97316;animation-delay:.5s; }
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
                    <div class="g-eyebrow"><div class="g-edot"></div>Sécurité du compte</div>
                    <h2 class="g-ltitle">Définissez<br/>votre nouveau<br/><span>mot de passe</span></h2>
                    <p class="g-ldesc">Choisissez un mot de passe fort pour sécuriser votre accès à la plateforme GMPP.</p>
                    <div class="g-feats">
                        <div class="g-feat"><span class="g-fi">🔐</span><span class="g-ft">Minimum 8 caractères recommandés</span></div>
                        <div class="g-feat"><span class="g-fi">✨</span><span class="g-ft">Mélangez lettres, chiffres et symboles</span></div>
                        <div class="g-feat"><span class="g-fi">🛡️</span><span class="g-ft">Stockage sécurisé via Keycloak</span></div>
                        <div class="g-feat"><span class="g-fi">🔄</span><span class="g-ft">Déconnexion des autres sessions</span></div>
                    </div>
                    <div class="g-svg">
                        <svg viewBox="0 0 320 110" fill="none" style="width:100%;max-width:320px;">
                            <line x1="0" y1="28" x2="320" y2="28" stroke="rgba(249,115,22,.06)" stroke-width="1"/>
                            <line x1="0" y1="56" x2="320" y2="56" stroke="rgba(249,115,22,.06)" stroke-width="1"/>
                            <rect x="76"  y="22" width="168" height="76" rx="6" fill="rgba(13,18,37,.9)" stroke="rgba(249,115,22,.3)" stroke-width="1.2"/>
                            <rect x="90"  y="32" width="104" height="52" rx="3" fill="rgba(3,7,18,.9)"   stroke="rgba(249,115,22,.3)" stroke-width="1"/>
                            <!-- lock icon -->
                            <rect x="122" y="58" width="36" height="26" rx="4" fill="none" stroke="rgba(249,115,22,.7)" stroke-width="1.5"/>
                            <path d="M128 58v-8a12 12 0 0 1 24 0v8" fill="none" stroke="rgba(249,115,22,.5)" stroke-width="1.5"/>
                            <circle cx="140" cy="68" r="3" fill="rgba(249,115,22,.8)"/>
                            <line x1="140" y1="71" x2="140" y2="76" stroke="rgba(249,115,22,.6)" stroke-width="1.5"/>
                            <g style="transform-origin:42px 60px;animation:gearSlow 12s linear infinite">
                                <circle cx="42" cy="60" r="26" stroke="rgba(249,115,22,.4)" stroke-width="1.5" fill="rgba(13,18,37,.6)"/>
                                <circle cx="42" cy="60" r="16" stroke="rgba(249,115,22,.25)" stroke-width="1" fill="rgba(13,18,37,.8)"/>
                                <circle cx="42" cy="60" r="6" fill="rgba(251,146,60,.5)"/>
                            </g>
                            <g style="transform-origin:278px 40px;animation:gearFast 8s linear infinite">
                                <circle cx="278" cy="40" r="18" stroke="rgba(245,158,11,.4)" stroke-width="1.2" fill="rgba(13,18,37,.6)"/>
                                <circle cx="278" cy="40" r="11" stroke="rgba(245,158,11,.2)" fill="rgba(13,18,37,.8)"/>
                                <circle cx="278" cy="40" r="4" fill="rgba(245,158,11,.5)"/>
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
                        <div class="g-ctag"><div class="g-ctdot"></div>Mise à jour du mot de passe</div>
                        <h1 class="g-ctitle">Nouveau mot de passe</h1>
                        <p class="g-csub">Définissez un nouveau mot de passe sécurisé pour votre compte.</p>
                    </div>

                    <#if message?has_content && !messagesPerField.existsError('password','password-confirm')>
                    <div class="g-alert ${message.type}">
                        <span style="font-size:16px;flex-shrink:0"><#if message.type=='error'>⚠<#elseif message.type=='warning'>⚡<#elseif message.type=='success'>✓<#else>ℹ</#if></span>
                        <span>${kcSanitize(message.summary)?no_esc}</span>
                    </div>
                    </#if>

                    <form class="g-form" id="kc-passwd-update-form" action="${url.loginAction}" method="post">
                        <input type="text" id="username" name="username" value="${username}" autocomplete="username" readonly style="display:none;"/>
                        <input type="password" id="password-old" name="password-old" autocomplete="current-password" style="display:none;"/>

                        <div class="g-group">
                            <label class="g-lbl" for="password-new">Nouveau mot de passe</label>
                            <div class="g-wrap">
                                <span class="g-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </span>
                                <input tabindex="1" class="g-inp" id="password-new" name="password-new" type="password"
                                    autocomplete="new-password" placeholder="••••••••••" style="padding-right:42px;"
                                    aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>" autofocus/>
                                <button type="button" class="g-pwtgl" id="gtgl1" aria-label="Afficher/Masquer">
                                    <svg id="geye1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                            </div>
                            <#if messagesPerField.existsError('password')>
                            <span class="g-ierr">${kcSanitize(messagesPerField.getFirstError('password'))?no_esc}</span>
                            </#if>
                        </div>

                        <div class="g-group">
                            <label class="g-lbl" for="password-confirm">Confirmer le mot de passe</label>
                            <div class="g-wrap">
                                <span class="g-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                </span>
                                <input tabindex="2" class="g-inp" id="password-confirm" name="password-confirm" type="password"
                                    autocomplete="new-password" placeholder="••••••••••" style="padding-right:42px;"
                                    aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"/>
                                <button type="button" class="g-pwtgl" id="gtgl2" aria-label="Afficher/Masquer">
                                    <svg id="geye2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                            </div>
                            <#if messagesPerField.existsError('password-confirm')>
                            <span class="g-ierr">${kcSanitize(messagesPerField.getFirstError('password-confirm'))?no_esc}</span>
                            </#if>
                        </div>

                        <#if logoutSessions?? >
                        <label class="g-signout">
                            <input tabindex="3" type="checkbox" id="logout-sessions" name="logout-sessions" value="on" <#if logoutSessions>checked</#if>/>
                            <span class="g-signout-label">
                                <span class="g-signout-title">Se déconnecter des autres appareils</span>
                                <span class="g-signout-sub">Révoque toutes les sessions actives</span>
                            </span>
                        </label>
                        </#if>

                        <button tabindex="4" class="g-btn" type="submit" id="kc-form-buttons">
                            <span class="g-binn">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                Enregistrer le mot de passe
                                <svg class="g-barr" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                        </button>

                    </form>

                    <div class="g-sec">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Connexion sécurisée via Keycloak SSO · OAuth 2.0 / JWT
                    </div>

                    <div class="g-chips">
                        <div class="g-chip"><div class="g-cdot gg"></div>Système actif</div>
                        <div class="g-chip"><div class="g-cdot gb"></div>Chiffrement AES</div>
                        <div class="g-chip"><div class="g-cdot gp"></div>Sécurisé JWT</div>
                    </div>
                </div>
            </div>

        </div>

        <script>
        (function(){
            function togglePw(btnId, inputId, iconId) {
                var t=document.getElementById(btnId), p=document.getElementById(inputId), e=document.getElementById(iconId);
                if(t&&p){ t.addEventListener('click',function(){ var s=p.type==='password'; p.type=s?'text':'password'; e.innerHTML=s?'<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>':'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'; }); }
            }
            togglePw('gtgl1','password-new','geye1');
            togglePw('gtgl2','password-confirm','geye2');
        })();
        </script>

    </#if>

</@layout.registrationLayout>
