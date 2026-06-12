(function () {
    'use strict';

    const BR_SCRIPT_VERSION = '2026-06-11-foreign-binding-format-v2';
    const BR_SCRIPT_BUILD_ID = 'br-build-2026-06-11-foreign-binding-format-v2-001';
    const BR_SCRIPT_UPDATE_KEY = 'br_script_seen_update_version';
    const BR_SCRIPT_DOWNLOAD_URL = 'https://raw.githubusercontent.com/s4loed-blip/brscript51-55/main/my-tech-loader.user.js';



    function installEarlyRecentHider() {
        try {
            if (!document.documentElement) return;

            if (!document.querySelector('#br-early-recent-hide-style')) {
                const style = document.createElement('style');
                style.id = 'br-early-recent-hide-style';
                style.textContent = `
                    .br-force-hide-recent,
                    .uix_recentActions,
                    .uix_recentActionsContainer,
                    .uix_quickReply--recent,
                    .uix_quickReply__recent,
                    .js-quickReplyRecent,
                    .quickReplyRecent,
                    [data-xf-init*="quick-reply"] .uix_recent,
                    [data-xf-init*="quick-reply"] .uix_recentActions {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        height: 0 !important;
                        max-height: 0 !important;
                        overflow: hidden !important;
                        pointer-events: none !important;
                    }
                `;
                (document.head || document.documentElement).appendChild(style);
            }

            const scan = () => {
                try {
                    const isBadText = (txt) => {
                        txt = String(txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
                        return txt.includes('недавно') && (
                            txt.includes('переношу') ||
                            txt.includes('быстрые ответы') ||
                            txt.includes('ответы') ||
                            txt.includes('вашу тему')
                        );
                    };

                    const nodes = Array.from(document.querySelectorAll('div, span'));
                    for (const el of nodes) {
                        if (!el || el.closest('#br-script-update-notice, .br-status-line, .br-status-buttons, .fr-box, .fr-toolbar, .fr-wrapper')) continue;

                        const own = Array.from(el.childNodes)
                            .filter(n => n.nodeType === Node.TEXT_NODE)
                            .map(n => n.textContent)
                            .join(' ');

                        if (!String(own).toLowerCase().includes('недавно')) continue;

                        let target = el;
                        for (let i = 0; i < 6 && target && target !== document.body; i += 1) {
                            const txt = target.innerText || target.textContent || '';
                            const r = target.getBoundingClientRect ? target.getBoundingClientRect() : { height: 0 };
                            if (isBadText(txt) && (!r.height || r.height <= 110)) break;
                            target = target.parentElement;
                        }

                        if (target && target !== document.body) {
                            target.classList.add('br-force-hide-recent');
                            target.style.setProperty('display', 'none', 'important');
                            target.style.setProperty('visibility', 'hidden', 'important');
                            target.style.setProperty('height', '0', 'important');
                            target.style.setProperty('max-height', '0', 'important');
                            target.style.setProperty('overflow', 'hidden', 'important');
                            target.style.setProperty('pointer-events', 'none', 'important');
                        }
                    }
                } catch (e) {}
            };

            scan();
            const earlyTimer = setInterval(scan, 50);
            setTimeout(() => clearInterval(earlyTimer), 5000);

            if (!window.__brRecentObserverInstalled) {
                window.__brRecentObserverInstalled = true;
                const observer = new MutationObserver(scan);
                observer.observe(document.documentElement, { childList: true, subtree: true });
            }
        } catch (e) {
            console.error('[BR Script] Early recent hider error:', e);
        }
    }

    installEarlyRecentHider();

    function showScriptUpdateNotice() {
        try {
            if (localStorage.getItem(BR_SCRIPT_UPDATE_KEY) === BR_SCRIPT_VERSION) return;

            const renderNotice = () => {
                if (!document.body) return;
                if (localStorage.getItem(BR_SCRIPT_UPDATE_KEY) === BR_SCRIPT_VERSION) return;

                const old = document.querySelector('#br-script-update-notice');
                if (old) old.remove();

                const oldStyle = document.querySelector('#br-update-style');
                if (oldStyle) oldStyle.remove();

                const style = document.createElement('style');
                style.id = 'br-update-style';
                style.textContent = `
                    #br-script-update-notice{position:fixed!important;inset:0!important;display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(0,0,0,.46)!important;backdrop-filter:blur(3px)!important;z-index:2147483647!important;font-family:Arial,sans-serif!important}
                    #br-script-update-notice .br-update-card{position:relative!important;width:440px!important;max-width:calc(100vw - 28px)!important;padding:18px!important;border-radius:18px!important;background:linear-gradient(145deg,#252a31 0%,#171a1f 100%)!important;border:1px solid rgba(255,255,255,.12)!important;box-shadow:0 24px 70px rgba(0,0,0,.75),0 0 0 1px rgba(255,69,0,.18) inset!important;color:#fff!important;overflow:hidden!important}
                    #br-script-update-notice .br-update-card:before{content:''!important;position:absolute!important;left:-80px!important;top:-80px!important;width:220px!important;height:220px!important;background:radial-gradient(circle,rgba(255,69,0,.42),transparent 65%)!important;pointer-events:none!important}
                    #br-script-update-notice .br-update-close{position:absolute!important;right:12px!important;top:10px!important;width:30px!important;height:30px!important;border-radius:10px!important;border:1px solid rgba(255,255,255,.16)!important;background:rgba(255,255,255,.06)!important;color:#fff!important;font-size:21px!important;line-height:25px!important;cursor:pointer!important}
                    #br-script-update-notice .br-update-head{position:relative!important;display:flex!important;gap:12px!important;align-items:center!important;margin-bottom:16px!important}
                    #br-script-update-notice .br-update-icon{width:46px!important;height:46px!important;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:15px!important;background:linear-gradient(135deg,#ff4500,#f59e0b)!important;box-shadow:0 0 24px rgba(255,69,0,.45)!important;font-size:24px!important}
                    #br-script-update-notice .br-update-title{font-size:20px!important;line-height:1.15!important;font-weight:900!important;letter-spacing:.2px!important}
                    #br-script-update-notice .br-update-subtitle{margin-top:3px!important;font-size:12px!important;color:#b8c0cc!important;font-weight:700!important}
                    #br-script-update-notice .br-update-body{position:relative!important;padding:13px!important;border-radius:14px!important;background:rgba(255,255,255,.055)!important;border:1px solid rgba(255,255,255,.08)!important}
                    #br-script-update-notice .br-update-badge{display:inline-flex!important;padding:4px 9px!important;margin-bottom:9px!important;border-radius:999px!important;background:rgba(34,197,94,.15)!important;color:#86efac!important;border:1px solid rgba(34,197,94,.28)!important;font-size:11px!important;font-weight:900!important;text-transform:uppercase!important}
                    #br-script-update-notice .br-update-list{display:grid!important;gap:7px!important;font-size:13px!important;line-height:1.35!important;color:#e5e7eb!important;font-weight:700!important}
                    #br-script-update-notice .br-update-list span{color:#22c55e!important;font-weight:900!important;margin-right:6px!important}
                    #br-script-update-notice .br-update-actions{display:flex!important;gap:9px!important;margin-top:15px!important}
                    #br-script-update-notice .br-update-download,#br-script-update-notice .br-update-later{height:38px!important;padding:0 14px!important;border-radius:12px!important;font-weight:900!important;cursor:pointer!important}
                    #br-script-update-notice .br-update-download{flex:1!important;border:0!important;color:#fff!important;background:linear-gradient(135deg,#ff4500,#f97316)!important;box-shadow:0 10px 25px rgba(255,69,0,.25)!important}
                    #br-script-update-notice .br-update-later{border:1px solid rgba(255,255,255,.16)!important;background:rgba(255,255,255,.06)!important;color:#d1d5db!important}
                    #br-script-update-notice .br-update-footer{margin-top:10px!important;color:#9ca3af!important;font-size:11px!important;font-weight:700!important;text-align:center!important}
                `;
                document.head.appendChild(style);

                const overlay = document.createElement('div');
                overlay.id = 'br-script-update-notice';
                overlay.innerHTML = `
                    <div class="br-update-card">
                        <button class="br-update-close" type="button" title="Закрыть">×</button>
                        <div class="br-update-head">
                            <div class="br-update-icon">⚡</div>
                            <div>
                                <div class="br-update-title">BR Script обновлён</div>
                                <div class="br-update-subtitle">Новая сборка готова к установке — обновлён loader</div>
                            </div>
                        </div>
                        <div class="br-update-body">
                            <div class="br-update-badge">Что изменилось</div>
                            <div class="br-update-list">
                                <div><span>✓</span> Кнопки статусов выровнены нормальной строкой</div>
                                <div><span>✓</span> Блок «Недавно» больше не мешает под формой ответа</div>
                                <div><span>✓</span> Панель управления теперь запускается быстрее через кэш loader</div>
                                <div><span>✓</span> Loader обновлён: Tampermonkey больше не должен писать «код такой же»</div>
                            </div>
                        </div>
                        <div class="br-update-actions">
                            <button id="br-script-update-download" class="br-update-download" type="button">Скачать обновление</button>
                            <button id="br-script-update-later" class="br-update-later" type="button">Позже</button>
                        </div>
                        <div class="br-update-footer">Сначала обнови loader, потом forum-buttons.js. Окно скроется до следующей версии.</div>
                    </div>
                `;
                document.body.appendChild(overlay);

                const closeOnly = () => overlay.remove();
                const markDownloaded = () => {
                    localStorage.setItem(BR_SCRIPT_UPDATE_KEY, BR_SCRIPT_VERSION);
                    window.open(BR_SCRIPT_DOWNLOAD_URL + '?v=' + encodeURIComponent(BR_SCRIPT_VERSION) + '&b=' + encodeURIComponent(BR_SCRIPT_BUILD_ID), '_blank');
                    overlay.remove();
                };

                const download = overlay.querySelector('#br-script-update-download');
                const later = overlay.querySelector('#br-script-update-later');
                const close = overlay.querySelector('.br-update-close');

                if (download) download.addEventListener('click', markDownloaded);
                if (later) later.addEventListener('click', closeOnly);
                if (close) close.addEventListener('click', closeOnly);
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => setTimeout(renderNotice, 800), { once: true });
            } else {
                setTimeout(renderNotice, 800);
            }
        } catch (e) {
            console.error('[BR Script] Update notice error:', e);
        }
    }
    try {
        (function () {
            const STORAGE_KEY = 'br_panel_servers_final_v5';

            const SERVERS = [
                // Отдел 41-45
                {
                    id: 41,
                    name: 'BELGOROD',
                    group: '41-45',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№41-belgorod.1841/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-belgorod.1842/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1870/'
                },
                {
                    id: 42,
                    name: 'MAKHACHKALA',
                    group: '41-45',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№42-makhachkala.1883/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-makhachkala.1884/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1912/'
                },
                {
                    id: 43,
                    name: 'VLADIKAVKAZ',
                    group: '41-45',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№43-vladikavkaz.1925/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-vladikavkaz.1926/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1954/'
                },
                {
                    id: 44,
                    name: 'VLADIVOSTOK',
                    group: '41-45',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№44-vladivostok.1967/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-vladivostok.1968/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1996/'
                },
                {
                    id: 45,
                    name: 'KALININGRAD',
                    group: '41-45',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№45-kaliningrad.2009/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-kaliningrad.2010/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2038/'
                },

                // Отдел 51-55
                {
                    id: 51,
                    name: 'TULA',
                    group: '51-55',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№51-tula.2261/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-tula.2262/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2290/'
                },
                {
                    id: 52,
                    name: 'RYAZAN',
                    group: '51-55',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№52-ryazan.2303/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-ryazan.2304/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2332/'
                },
                {
                    id: 53,
                    name: 'MURMANSK',
                    group: '51-55',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№53-murmansk.2345/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-murmansk.2346/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2374/'
                },
                {
                    id: 54,
                    name: 'PENZA',
                    group: '51-55',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№54-penza.2387/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-penza.2388/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2416/'
                },
                {
                    id: 55,
                    name: 'KURSK',
                    group: '51-55',
                    techComplaint: 'https://forum.blackrussia.online/forums/Сервер-№55-kursk.2429/',
                    tech: 'https://forum.blackrussia.online/forums/Технический-раздел-kursk.2430/',
                    playerComplaint: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2458/'
                }
            ];

            const OPS_LINK = 'https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/';

            const HIDE_NAV_TEXTS = [
                'Жалобы на адм.',
                'Жалобы на адм',
                'Обжалования',
                'Жалобы на игроков',
                'Жалобы на лидеров'
            ];

            function getSelectedServers() {
                try {
                    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                    if (Array.isArray(saved)) {
                        return saved.map(Number).filter(id => SERVERS.some(s => s.id === id));
                    }
                } catch (e) {}
                return [];
            }

            function saveSelectedServers(ids) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
            }

            function textOf(el) {
                return String(el && el.textContent || '').replace(/\s+/g, ' ').trim();
            }

            function visible(el) {
                if (!el) return false;
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
            }

            function getTopNavScope() {
                const moderLink = findModerLink();
                if (!moderLink) return null;

                const li = moderLink.closest('li');
                if (li && li.parentElement) return li.parentElement;

                return moderLink.closest('.p-sectionLinks-list, .p-nav-list, .hScroller-scroll, .p-sectionLinks, .p-nav, nav')
                    || moderLink.parentElement;
            }

            function hideInterferingNavButtons() {
                const scope = getTopNavScope();
                if (!scope) return;

                const links = Array.from(scope.querySelectorAll('a'));

                links.forEach(link => {
                    const text = textOf(link);
                    if (!HIDE_NAV_TEXTS.includes(text)) return;

                    const item = link.closest('li') || link;
                    item.classList.add('br-hidden-by-panel');
                    item.style.display = 'none';
                });
            }

            function findModerLink() {
                const links = Array.from(document.querySelectorAll('a'));
                return links.find(a => visible(a) && textOf(a).toLowerCase().includes('модер')) || null;
            }

            function findNativePanelControl() {
                const nodes = Array.from(document.querySelectorAll('a, button'));

                return nodes.find(el => {
                    if (!visible(el)) return false;
                    if (el.classList.contains('br-panel-main')) return false;
                    if (el.closest('.br-panel-item, .br-panel-wrap, .br-panel-menu')) return false;

                    const text = textOf(el).toLowerCase();
                    return text === 'панель управления' || text.includes('панель управления');
                }) || null;
            }

            function findInsertPlace(moderLink) {
                const li = moderLink && moderLink.closest('li');
                if (li && li.parentElement) {
                    return { type: 'list', menu: li.parentElement, after: li };
                }

                if (moderLink && moderLink.parentElement) {
                    return { type: 'plain', menu: moderLink.parentElement, after: moderLink };
                }

                return null;
            }

            function makeServerLink(text, href, color) {
                const a = document.createElement('a');
                a.className = 'br-selected-server-btn';
                a.textContent = text;
                a.href = href;
                a.target = '_blank';
                a.style.borderBottom = '2px solid ' + color;
                return a;
            }

            function buildSelectedButtons() {
                const selected = getSelectedServers();
                const buttons = [];
                let lastGroup = null;

                selected.forEach(id => {
                    const s = SERVERS.find(server => server.id === id);
                    if (!s) return;

                    if (lastGroup && lastGroup !== s.group) {
                        const separator = document.createElement('span');
                        separator.className = 'br-selected-server-separator';
                        separator.textContent = '|';
                        buttons.push(separator);
                    }

                    lastGroup = s.group;

                    buttons.push(makeServerLink('ТЖБ' + id, s.techComplaint, '#0000CD'));
                    buttons.push(makeServerLink('Т' + id, s.tech, '#8B008B'));
                    buttons.push(makeServerLink('ЖБ' + id, s.playerComplaint, '#DC143C'));
                });

                return buttons;
            }

            function removeOldPanel() {
                document.querySelectorAll(
                    '.br-panel-item, .br-panel-wrap, .br-panel-menu, .br-selected-server-item, .br-selected-server-wrap, .br-topnav-item, .br-topnav-wrap'
                ).forEach(el => el.remove());
            }

            function closeMenu() {
                const menu = document.querySelector('.br-panel-menu');
                if (menu) menu.classList.remove('open');
            }

            function openMenuNear(button) {
                let menu = document.querySelector('.br-panel-menu');

                if (!menu) {
                    menu = document.createElement('div');
                    menu.className = 'br-panel-menu';
                    document.body.appendChild(menu);
                }

                buildMenu(menu);

                const rect = button.getBoundingClientRect();
                menu.style.left = rect.left + 'px';
                menu.style.top = rect.bottom + 'px';
                menu.classList.toggle('open');
            }

            function addDeptTitle(menu, text) {
                const dept = document.createElement('div');
                dept.className = 'br-menu-dept-title';
                dept.textContent = text;
                menu.appendChild(dept);
            }

            function buildMenu(menu) {
                const selected = getSelectedServers();
                menu.innerHTML = '';

                const title = document.createElement('div');
                title.className = 'br-menu-title';
                title.textContent = 'Выбор серверов';
                menu.appendChild(title);

                let lastGroup = null;

                SERVERS.forEach(s => {
                    if (lastGroup !== s.group) {
                        if (lastGroup !== null) {
                            const divider = document.createElement('div');
                            divider.className = 'br-menu-divider small';
                            menu.appendChild(divider);
                        }

                        addDeptTitle(menu, 'Отдел ' + s.group);
                        lastGroup = s.group;
                    }

                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'br-menu-server' + (selected.includes(s.id) ? ' selected' : '');
                    btn.textContent = `${s.name} (${s.id})`;

                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        let current = getSelectedServers();

                        if (current.includes(s.id)) {
                            current = current.filter(id => id !== s.id);
                        } else {
                            current.push(s.id);
                        }

                        current.sort((a, b) => a - b);
                        saveSelectedServers(current);

                        renderPanel();
                        const newPanelButton = document.querySelector('.br-panel-main');
                        const newMenu = document.querySelector('.br-panel-menu');

                        if (newPanelButton && newMenu) {
                            buildMenu(newMenu);
                            const r = newPanelButton.getBoundingClientRect();
                            newMenu.style.left = r.left + 'px';
                            newMenu.style.top = r.bottom + 'px';
                            newMenu.classList.add('open');
                        }
                    });

                    menu.appendChild(btn);
                });

                const divider = document.createElement('div');
                divider.className = 'br-menu-divider';
                menu.appendChild(divider);

                const ops = document.createElement('a');
                ops.className = 'br-menu-ops';
                ops.textContent = 'Общие правила серверов';
                ops.href = OPS_LINK;
                ops.target = '_blank';
                menu.appendChild(ops);
            }

            function makePanelButton(buttonText) {
                const wrap = document.createElement('div');
                wrap.className = 'br-panel-wrap';

                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'br-panel-main';
                button.textContent = buttonText || 'Панель управления';

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openMenuNear(button);
                });

                wrap.appendChild(button);
                return wrap;
            }

            function renderPanel() {
                hideInterferingNavButtons();

                const nativePanel = findNativePanelControl();
                const moderLink = findModerLink();

                const anchorElement = nativePanel || moderLink;
                if (!anchorElement) return false;

                const place = findInsertPlace(anchorElement);
                if (!place) return false;

                const oldMenuOpen = document.querySelector('.br-panel-menu.open');

                removeOldPanel();

                const panelText = nativePanel ? 'Меню управления' : 'Панель управления';
                const panel = makePanelButton(panelText);
                const selectedButtons = buildSelectedButtons();

                if (place.type === 'list') {
                    const panelLi = document.createElement('li');
                    panelLi.className = 'p-navEl br-panel-item';
                    panelLi.appendChild(panel);

                    place.after.after(panelLi);

                    let last = panelLi;

                    selectedButtons.forEach(btn => {
                        const li = document.createElement('li');
                        li.className = 'p-navEl br-selected-server-item';
                        li.appendChild(btn);
                        last.after(li);
                        last = li;
                    });
                } else {
                    const selectedWrap = document.createElement('span');
                    selectedWrap.className = 'br-selected-server-wrap';
                    selectedButtons.forEach(btn => selectedWrap.appendChild(btn));

                    place.after.after(panel);
                    panel.after(selectedWrap);
                }

                if (oldMenuOpen) {
                    const btn = document.querySelector('.br-panel-main');
                    if (btn) openMenuNear(btn);
                }

                return true;
            }

            function addStyle() {
                if (document.querySelector('#br-panel-style-final')) return;

                const style = document.createElement('style');
                style.id = 'br-panel-style-final';
                style.textContent = `
                    .br-hidden-by-panel {
                        display: none !important;
                    }

                    .br-panel-item,
                    .br-selected-server-item {
                        display: inline-flex !important;
                        align-items: center !important;
                        list-style: none !important;
                    }

                    .br-panel-wrap {
                        display: inline-flex !important;
                        align-items: center !important;
                        position: relative !important;
                    }

                    .br-panel-main {
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        min-height: 36px !important;
                        padding: 0 13px !important;
                        background: transparent !important;
                        color: #d7d7d7 !important;
                        border: 0 !important;
                        border-bottom: 0 !important;
                        font-family: inherit !important;
                        font-size: 13px !important;
                        font-weight: 600 !important;
                        cursor: pointer !important;
                        white-space: nowrap !important;
                    }

                    .br-panel-main:hover {
                        background: transparent !important;
                        color: #d7d7d7 !important;
                    }

                    .br-panel-menu {
                        position: fixed !important;
                        display: none !important;
                        width: 250px !important;
                        padding: 9px !important;
                        background: #202327 !important;
                        border: 1px solid rgba(255,255,255,0.14) !important;
                        border-radius: 0 0 8px 8px !important;
                        box-shadow: 0 12px 35px rgba(0,0,0,0.7) !important;
                        z-index: 2147483647 !important;
                    }

                    .br-panel-menu.open {
                        display: block !important;
                    }

                    .br-menu-title {
                        color: #aaa !important;
                        font-size: 12px !important;
                        font-weight: 700 !important;
                        padding: 4px 6px 8px !important;
                        margin-bottom: 5px !important;
                        border-bottom: 1px solid rgba(255,255,255,0.12) !important;
                    }

                    .br-menu-dept-title {
                        color: #fbbf24 !important;
                        font-size: 11px !important;
                        font-weight: 800 !important;
                        letter-spacing: 0.3px !important;
                        text-transform: uppercase !important;
                        padding: 7px 6px 4px !important;
                        margin-top: 2px !important;
                        opacity: 0.95 !important;
                    }

                    .br-menu-server {
                        display: flex !important;
                        align-items: center !important;
                        width: 100% !important;
                        min-height: 30px !important;
                        margin: 3px 0 !important;
                        padding: 0 8px !important;
                        background: rgba(255,255,255,0.06) !important;
                        color: #ddd !important;
                        border: 0 !important;
                        border-radius: 4px !important;
                        font-family: inherit !important;
                        font-size: 12px !important;
                        font-weight: 700 !important;
                        text-align: left !important;
                        cursor: pointer !important;
                    }

                    .br-menu-server:hover {
                        background: rgba(255,255,255,0.16) !important;
                        color: #fff !important;
                    }

                    .br-menu-server.selected {
                        background: rgba(37, 99, 235, 0.28) !important;
                        color: #fff !important;
                    }

                    .br-menu-server.selected::before {
                        content: '✓' !important;
                        color: #60a5fa !important;
                        margin-right: 7px !important;
                    }

                    .br-menu-divider {
                        height: 1px !important;
                        background: rgba(255,255,255,0.12) !important;
                        margin: 8px 0 !important;
                    }

                    .br-menu-divider.small {
                        margin: 7px 0 4px !important;
                        background: rgba(245,158,11,0.18) !important;
                    }

                    .br-menu-ops {
                        display: flex !important;
                        align-items: center !important;
                        width: 100% !important;
                        min-height: 31px !important;
                        padding: 0 8px !important;
                        box-sizing: border-box !important;
                        background: rgba(245,158,11,0.16) !important;
                        color: #fbbf24 !important;
                        border-left: 3px solid #f59e0b !important;
                        border-radius: 4px !important;
                        font-size: 12px !important;
                        font-weight: 700 !important;
                        text-decoration: none !important;
                    }

                    .br-menu-ops:hover {
                        background: rgba(245,158,11,0.28) !important;
                        color: #fff !important;
                        text-decoration: none !important;
                    }

                    .br-selected-server-wrap {
                        display: inline-flex !important;
                        align-items: center !important;
                        gap: 4px !important;
                        margin-left: 4px !important;
                    }

                    .br-selected-server-separator {
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        min-height: 29px !important;
                        padding: 0 6px !important;
                        color: rgba(255,255,255,0.35) !important;
                        font-weight: 800 !important;
                        user-select: none !important;
                    }

                    .br-selected-server-btn {
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        min-height: 29px !important;
                        padding: 0 7px !important;
                        margin: 0 1px !important;
                        border-radius: 3px !important;
                        background: rgba(255,255,255,0.06) !important;
                        color: #ddd !important;
                        font-family: inherit !important;
                        font-size: 11px !important;
                        font-weight: 700 !important;
                        text-decoration: none !important;
                        white-space: nowrap !important;
                        cursor: pointer !important;
                        border-top: 0 !important;
                        border-left: 0 !important;
                        border-right: 0 !important;
                    }

                    .br-selected-server-btn:hover {
                        background: rgba(255,255,255,0.16) !important;
                        color: #fff !important;
                        text-decoration: none !important;
                    }
                `;
                document.head.appendChild(style);

                document.addEventListener('click', function (e) {
                    const menu = document.querySelector('.br-panel-menu');
                    const button = document.querySelector('.br-panel-main');

                    if (!menu || !button) return;

                    if (!menu.contains(e.target) && !button.contains(e.target)) {
                        closeMenu();
                    }
                });
            }

            function startPanel() {
                addStyle();
                hideInterferingNavButtons();

                const ensurePanelAlive = () => {
                    try {
                        hideInterferingNavButtons();

                        const hasPanel = !!document.querySelector('.br-panel-main');
                        const hasSelectedButtons = !!document.querySelector('.br-selected-server-btn');
                        const needSelectedButtons = getSelectedServers().length > 0;

                        if (!hasPanel || (needSelectedButtons && !hasSelectedButtons)) {
                            renderPanel();
                        }
                    } catch (e) {
                        console.error('[BR Script] Panel alive error:', e);
                    }
                };

                let tries = 0;
                const timer = setInterval(() => {
                    tries += 1;
                    ensurePanelAlive();

                    if (document.querySelector('.br-panel-main') || tries >= 120) {
                        clearInterval(timer);
                    }
                }, 150);

                setInterval(ensurePanelAlive, 1200);

                try {
                    const observer = new MutationObserver(() => ensurePanelAlive());
                    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
                } catch (e) {}
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startPanel);
            } else {
                startPanel();
            }
        })();
    } catch (e) {
        console.error('[BR Script] Panel Error:', e);
    }

	if (document.body.dataset.forumButtonsLoaded) return;
    document.body.dataset.forumButtonsLoaded = 'true';
	const UNACCEPT_PREFIX = 4; // префикс отказано
  const ODOBRENO_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // префикс команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // префикс техническому специалисту
	const WATCHED_PREFIX = 9; // префикс рассмотрено
	const WAIT_PREFIX = 14; // префикс ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0; // префикс отсутствует
	const buttons = [

{
	title: 'Приветствие',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER] текст [/CENTER][/FONT]',
},
{
	title: 'Дубликат',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	"[CENTER]Данная тема является дубликатом вашей предыдущей темы, ссылка на тему - <br>Пожалуйста, <b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b>.<br><br>" +
	'[B][I][FONT=verdana][COLOR=rgb(255, 165, 0)]Передано руководству[/COLOR][/FONT][/I][/B]',
},
{
	title: 'Актуальный Nick',
content:
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
    "[CENTER]Ваш актуальный Nick_Name - (никнейм)[/CENTER]<br><br>" +
    "[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]",
},
{
  title: 'Покупка ИВ у бота',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Внимательно изучив вашу систему логирования, было выявлено, что бот через (какую систему была передача) передал Вам игровую валюту в размере (размер), данная совокупность действий в полной мере противоречит правилам проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER][FONT=Verdana][B]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>[/FONT][/B]" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
},
{
	title: 'Покупка ИВ у игрока',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Внимательно изучив вашу систему логирования, было выявлено, что продавец игровой валюты с никнеймом (ник продавца) через (какую систему была передача) передал Вам игровую валюту в размере (размер), данная совокупность действий в полной мере противоречит правилам проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER][FONT=Verdana][B]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>[/FONT][/B]" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
},
{
	title: 'Трансфер на твинк',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]Внимательно изучив вашу систему логирования, было выявлено, что с вашего аккаунта с никнеймом (Никнейм) через (какую систему была передача) передавали (что передали) на второй аккаунт с никнеймом (Никнейм).[/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana]Данная совокупность действий в полной мере противоречит правилам проекта пункта [COLOR=rgb(255, 0, 0)]4.05[/COLOR], прошу вас настоятельно с ним ознакомиться и впредь не нарушать.<br><br>[/FONT][/B][/CENTER]' +
  '[CENTER][COLOR=rgb(255, 0, 0)][B][FONT=verdana]4.05[/FONT][/B][/COLOR][FONT=verdana][B]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | [/B][COLOR=rgb(255, 0, 0)][B]Ban 15 - 30 дней / PermBan[/B][/COLOR][/FONT][B][FONT=verdana]<br>Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.[/CENTER]<br><br>" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
},
{
	title: 'Продажа ИВ игроку',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Внимательно изучив вашу систему логирования, было выявлено, что вы продали игровую валюту через (какую систему была передача) игроку с никнеймом (Никнейм) в размере (размер).[/CENTER][/COLOR][/FONT][/B]<br><br>' +
  '[CENTER][B][FONT=verdana]Данная совокупность действий в полной мере противоречит правилам проекта пункта [COLOR=rgb(255, 0, 0)]2.28[/COLOR], прошу вас настоятельно с ним ознакомиться и впредь не нарушать.<br><br>[/FONT][/B][/CENTER]' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.[/CENTER]<br>" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
},
{
	title: 'Махинации со взломом',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Внимательно изучив систему логирования, было выявлено, что игрок с никнеймом (ник) был взломан. В ходе дальнейшей проверки обнаружено, что имущество игрока было передано на ваш аккаунт. Данные действия подразумевают собой совокупность, которая направлена на получение выгоды нечестным для этого путем.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.[/CENTER]<br>" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
},
{
	title: 'Переношу в нужный раздел',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]Данная тема никак не относится к этому разделу.[/FONT][/B]' +
  '[CENTER][B][FONT=verdana]Переношу ваше обращение в соответствующий для этого раздел.[/FONT][/B][/CENTER]' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
},

{
  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ  ᅠᅠ ᅠ ЖАЛОБЫ НА ТЕХ. СПЕЦОВ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ  ᅠ ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },

{
	title: 'Форма подачи ЖБ ТС',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Ваше обращение составлено не по форме.[/FONT][/COLOR][/B][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
 },
{
	title: 'Нет окна блокировки',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, прикрепив окно блокировки с фотохостинга или видеохостинга.<br> Также обращаем ваше внимание на то, что доказательства из социальных сетей <u>не принимаются</u>.<br><br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Ошибка, будет разбан',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]После дополнительной перепроверки была выявлена ошибка, ваш аккаунт будет разблокирован в течение 24-х часов. Приносим свои извинения за предоставленные неудобства.<br>[/CENTER]<br>'+
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.[/CENTER]<br><br>" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Правила раздела',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел, составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно, чтобы оно содержало лишь никнейм технического специалиста и причину.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U][/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствуют оффтоп/оскорбления.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 14 дней.[/SIZE][/FONT]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Срок подачи ЖБ',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]С момента выдачи наказания от технического специалиста прошло более 14-ти дней.[/center]<br><br>'+
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[COLOR=rgb(255, 255, 0)]На рассмотрении[/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Не относится',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста, будьте добры, ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Запрос привязок',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: t.me/getmyid_bot<br>[/FONT][/COLOR][/B][COLOR=rgb(255, 255, 255)][FONT=verdana][B]2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ )<br>[/B][/FONT][/COLOR][B][COLOR=rgb(255, 255, 255)][FONT=verdana]3. Укажите почту, которая привязана к аккаунту[/FONT][/COLOR][/B][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER][I][COLOR=rgb(247, 218, 100)][FONT=verdana]Ожидаю ваш ответ.[/FONT][/COLOR][/I][/CENTER]",
  prefix: TECHADM_PREFIX,
	status: true,
},
{
    title: 'Чужая привязка',
    color: '',
    content:
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
    '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
    '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]После проверки системы логирования по вашему обращению было выявлено, что на момент взлома на аккаунт была установлена новая привязка, которая не относится к владельцу аккаунта.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
    '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Так как аккаунт теперь закреплён за чужими данными, восстановить или оставить его в использовании невозможно. Аккаунт будет заблокирован.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
    '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Никому не передавайте пароль и другие данные от аккаунта. Администрация не просит такую информацию у игроков.[/COLOR][/FONT][/B][/CENTER]<br>' +
    '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
    '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
    prefix: CLOSE_PREFIX,
    status: false,
},

{
  title: 'Смена пароля',
  color: '',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Сбросьте пароль через любую из привязок ВКонтакте или Telegram, после чего, убедительная просьба, сообщить об этом в данной теме.<br><br>Ожидаю вашего ответа.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/FONT][/SIZE][/COLOR]',
	prefix: TECHADM_PREFIX,
	status: true,
},
	{
  title: ' ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Технический раздел ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ  ᅠ ᅠ ᅠ ᅠ ᅠ  ᅠ ᅠ ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
{
	title: 'Форма подачи ТР',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Ваше обращение составлено не по форме.[/FONT][/COLOR][/B][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет скринов/видео',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, прикрепив доказательства с фотохостинга или видеохостинга<br> Также обращаем ваше внимание на то, что доказательства из социальных сетей <u>не принимаются</u>.<br><br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нерабочая ссылка',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению, ссылка на ваши прикрепленные доказательства недоступна или не работает.[/COLOR][/FONT][/B]<br>' +
  '[CENTER][B][FONT=verdana]Пожалуйста, отправьте новое обращение, убедившись, что ссылка на  доказательства работает и содержит качественные фотографии или видеозаписи.[/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Док-ва из соц.сети',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Доказательства из социальных сетей <u>не принимаются и не подлежат рассмотрению</u>.<br><br>Вы можете воспользоваться любым удобным фото/видеохостингом, но для вашего удобства мы перечислили популярные сайты:<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила раздела',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела, в котором Вы создали тему, поскольку Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Передача логисту',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и передана <u>Техническому Специалисту по Логированию</u> для дальнейшего вердикта, пожалуйста, ожидайте ответ в данной теме.<br><br>" +
	'[CENTER]Создавать новые темы с данной проблемой не нужно.<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/color][/CENTER][/FONT][/SIZE]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
  title: 'Забыл пароль',
	color: '',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]В решении данной проблемы вам могут помочь только установленные привязки на аккаунте.<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]Вы можете через специализированного бота в привязанных социальных сетях восстановить доступ к игровому аккаунту, сбросив пароль через окно "ввода пароля" при входе в игру или же поменяв пароль в самом боте. Если же на вашем игровом аккаунте отсутствуют привязки — мы ничем не сможем вам помочь, ибо каждый игрок несёт ответственность за свой игровой аккаунт и за игровые ценности на нём.<br><br>' +
  "Помощник Кирилл (Telegram) - [I][URL='https://t.me/br_helper_bot']клик[/URL][/I] (кликабельно)<br>" +
  "[CENTER][B][FONT=verdana]BLACK RUSSIA - Мобильная онлайн-игра (ВКонтакте) - [URL='https://vk.com/blackrussia.online'][I]клик [/I][/URL](кликабельно)[/FONT][/B][/CENTER]<br><br>" +
  '[COLOR=rgb(255, 255, 255)][B]После регистрации игрового аккаунта мы настоятельно рекомендуем каждому пользователю обезопасить свой игровой аккаунт всеми возможными соответствующими привязками, дабы в дальнейшем не попадать в подобные ситуации и не попадаться на несанкционированный вход со стороны злоумышленников.<br><br>' +
  '[COLOR=rgb(255, 255, 255)][B] Мы не сбрасываем пароли и не отвязываем возможно утерянные привязки от игровых аккаунтов.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Пропало имущество(доп.инфа)',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=5][FONT=Verdana]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>4. Дата покупки;<br>5. Способ приобретения (у игрока, в магазине или через донат;<br>6. Видеофиксация покупки (если присутствует);<br>7. Никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: "Проблемы с Кешом",
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Законопослушность',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нет PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<br>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Команде проекта',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта.<br>" +
	"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>" +
	"[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>" +
  '[CENTER][COLOR=rgb(255, 255, 0)]Передано команде проекта.[/color][/CENTER][/FONT][/SIZE]',
	prefix: COMMAND_PREFIX,
	status: true,
},
{
	title: 'Известно КП',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена.<br>Спасибо за Ваше обращение!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не является багом',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Проблема, с которой вы столкнулись, не является багом или ошибкой сервера.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В раздел Госс Организаций.',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В раздел Криминальных Организаций',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера.[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'в Жб на адм',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Обратитесь в раздел 'Жалобы на администрацию' вашего сервера.<br>Форма для подачи жалобы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']клик[/URL][/I] (кликабельно)<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'в Жб на лидеров',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Пожалуйста, обратитесь в раздел 'Жалобы на Лидеров' Вашего сервера.<br>Форма подачи жалобы - [I][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']клик[/URL][/I] (кликабельно)" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'в Жб на игроков',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Пожалуйста, обратитесь в раздел 'Жалобы на игроков' Вашего сервера.<br>Форма подачи жалобы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']клик[/URL][/I] (кликабельно)" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'в Обжалования',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']клик[/URL][/I] (кликабельно)" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сервер не отвечает',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
	"[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
	"[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
	"[LEFT]• Использование VPN; <br>"+
	"[LEFT]• Перезагрузка роутера.<br><br>" +
	"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +
	'[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
	'[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
	'[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
	'[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br>' +
	'[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>'+
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Перенаправление в поддержку',
	color: '',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]В том случае, если у вас произошла одна из указанных проблем:[/COLOR][/B][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana]1. Баланс доната (BC) стал отрицательным.<br> 2. Донат не был зачислен на аккаунт.<br> 3. Донат был зачислен не в полном объеме.<br> 4. Отсутствие подарка при подключении или продлении тарифа Tele-2.<br> 5. Частые переподключения к серверу.[/FONT][/COLOR][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Вам в срочном порядке необходимо  обратиться в техническую поддержку проекта BLACK RUSSIA через официальный сайт .[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana][URL=https://blackhubgames.helpshift.com/hc/ru/3-black-russia/contact-us/]"Перейти в техническую поддержку"[/URL]     [/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сим-карта',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=4][FONT=Veranda][FONT=verdana][COLOR=rgb(255, 255, 255)][B]Если вы приобрели тариф Black Russia, но награды не были зачислены или у Вас не получается активировать номер с тарифом Black Russia , тогда [/B][I][B]убедитесь в следующем:[/B][/I][/COLOR][/FONT][/FONT][/FONT][/SIZE][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]1. У вас тариф Black Russia, а не другой тариф, например, тариф Black[/FONT][/B][/CENTER]<br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]2. Номер активирован.[/COLOR][/FONT]<br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]3. После активации номера [U]прошло более 48-ми часов.[/U][/COLOR][/FONT]<br><br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]Если пункты выше не описывают вашу ситуацию в обязательном порядке обратитесь в службу поддержки[I] для дальнейшего решения:[/I][/COLOR][/FONT]<br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot[/COLOR][/FONT]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила восстановления',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Хочу стать адм/хелп',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Технические специалисты не принимают решения по назначению на должности.<br>Для этого есть раздел заявок на форуме - [I][URL='https://forum.blackrussia.online/forums/%D0%97%D0%90%D0%AF%D0%92%D0%9A%D0%98-%D0%9D%D0%90-%D0%94%D0%9E%D0%9B%D0%96%D0%9D%D0%9E%D0%A1%D0%A2%D0%98-%D0%9B%D0%98%D0%94%D0%95%D0%A0%D0%9E%D0%92-%D0%98-%D0%90%D0%93%D0%95%D0%9D%D0%A2%D0%9E%D0%92-%D0%9F%D0%9E%D0%94%D0%94%D0%95%D0%A0%D0%96%D0%9A%D0%98.3066/']клик[/URL][/I] (кликабельно), где вы можете ознакомиться с актуальными заявками и формами подачи.<br>Приятной игры и удачи в карьерном росте!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Предложение по улучш.',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к технической проблеме.<br>Если вы хотите предложить улучшение, пожалуйста, перейдите в соответствующий раздел.<br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нужны все прошивки',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Тестерам',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
	prefix: WAIT_PREFIX,
	status: false,
},
{
	title: 'Пропали вещи с аукц/маркет',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br><br>Если же вещи пропали с маркетплейса, значит их никто не купил, вам следует забрать их с ПВЗ (пункта выдачи заказов) в течение 7 дней, иначе предметы системно уничтожатся.<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Отвязка привязок',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Удалить установленные привязки на вашем аккаунте не представляется возможным ни нам, ни команде проекта. [/FONT][/COLOR][/B]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Бывают случаи, когда злоумышленник, получив несанкционированный доступ к аккаунту, устанавливает на него свою привязку. В такой ситуации аккаунт блокируется перманентно с причиной "Чужая привязка". Дальнейшая разблокировка игрового аккаунта невозможна во избежания повторных случаев взлома.[/COLOR][/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Заблокированный IP',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 255)][FONT=Verdana][size=15px]Вы оказались на заблокированном IP-адресе. Ваш аккаунт не заблокирован, так что поводов для беспокойства нет. Такая ситуация может возникнуть по разным причинам, например, из-за смены мобильного интернета или переезда. Чтобы избежать этой проблемы, перезагрузите телефон или используйте VPN.[/CENTER] <br>' +
	'[CENTER]Приносим свои извинения за доставленные неудобства. Желаем приятного времяпровождения на нашем проекте.[/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Ваш акк взломан',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваш игровой аккаунт был подвержен несанкционированному доступу со стороны злоумышленников. В том случае, если с аккаунта было украдено имущество - все причастные к этому будут наказаны. Ваш аккаунт будет временно заблокирован с причиной "Взломан" с целью же вашей дальнейшей безопасности и предотвращения повторных случаев заходов злоумышленников. [/COLOR][/FONT][/B][/CENTER]<br><br>' +
  "[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Для восстановления доступа и уточнения всех нюансов настоятельно рекомендуем вам обратиться в раздел 'Жалобы на технических специалистов' - [/FONT][/COLOR][/B][URL='https://forum.blackrussia.online/forums/Жалобы-на-технических-специалистов.490/'][B][COLOR=rgb(255, 255, 255)][FONT=verdana][I]клик [/I][/FONT][/COLOR][/B][/URL][B][COLOR=rgb(255, 255, 255)][FONT=verdana](кликабельно)[/FONT][/COLOR][/B][/CENTER]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет ответа игрока',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению, обратной связи от вас в данной теме так и не поступило.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Если Ваша проблема по-прежнему не решена, пожалуйста, создайте новое обращение.[/FONT][/COLOR][/B][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'После рестарта',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][FONT=verdana][COLOR=rgb(255, 255, 255)]Проверьте, пожалуйста, будет ли актуальна Ваша проблема после рестарта сервера (после 05:00 по-московскому времени)<br>[/COLOR][/FONT][/CENTER]' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ожидаем от Вас обратной связи в данной теме.[/COLOR][/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[COLOR=rgb(255, 255, 0)]На рассмотрении[/color][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},

{
  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ЖАЛОБЫ НА ИГРОКОВ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ     ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
{
	title: 'Игрок будет заблокирован',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>[FONT=verdana]Игрок будет заблокирован[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][I][FONT=verdana][COLOR=rgb(0, 255, 0)][B]Одобрено[/B][/COLOR][/FONT][/I][/CENTER]",
  prefix: ODOBRENO_PREFIX,
  status: false
},
{
	title: 'Игрок не будет заблокирован',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>Игрок не будет заблокирован.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/FONT][/I][/B][/CENTER]",
  prefix: UNACCEPT_PREFIX,
  status: false
},
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    installEarlyRecentHider();
    showScriptUpdateNotice();
    hideRecentAnswerRow();
    setTimeout(hideRecentAnswerRow, 800);
    setTimeout(hideRecentAnswerRow, 2000);
    setTimeout(hideRecentAnswerRow, 4000);
    setInterval(hideRecentAnswerRow, 3000);

    // Фикс расположения кнопок: одна строка + не вставлять в блок "Недавно"
    if (!document.querySelector('#br-status-buttons-fix')) {
        $('head').append(`
<style id="br-status-buttons-fix">
.br-status-line {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    white-space: normal !important;
    clear: both !important;
    float: none !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    margin: 10px 0 8px 0 !important;
    padding: 0 !important;
    position: relative !important;
    z-index: 2 !important;
}

.br-status-buttons {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    white-space: normal !important;
    vertical-align: middle !important;
}

.br-status-buttons button,
.br-status-line > button {
    flex: 0 0 auto !important;
    margin: 0 !important;
    white-space: nowrap !important;
}

.br-force-hide-recent,
.uix_recentActions,
.uix_recentActionsContainer,
.uix_quickReply--recent,
.uix_quickReply__recent,
.js-quickReplyRecent,
.quickReplyRecent,
.uix_recentActions .br-status-buttons,
.uix_recent .br-status-buttons,
.block-outer .br-status-buttons {
    display: none !important;
}
</style>
        `);
    }


	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin', 'border-radius: 20px; margin-right: 11px; border: 2px solid; border-color: rgb(255, 165, 0);');
	addButton('КП', 'teamProject', 'border-radius: 20px; margin-right: 100px; border: 2px solid; border-color: rgb(255, 255, 0);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
	addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
	addButton('Тех. спецу', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255);');
  addButton('Одобрено', 'odobreno', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(128, 255, 128);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#odobreno').click(() => editThreadData(ODOBRENO_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

	$(`button#selectAnswers`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 6) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });

        $(`button#selectMoveTasks`).click(() => {
            XF.alert(tasksMarkup1(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });


    function getMainReplyButton() {
        const candidates = $('.button--icon--reply').filter(function () {
            const $el = $(this);
            const text = String($el.text() || '').replace(/\s+/g, ' ').trim().toLowerCase();

            if ($el.closest('.br-status-line, .br-status-buttons, .br-force-hide-recent').length) return false;
            if ($el.closest('.uix_recentActions, .uix_recent, .block-outer, .menu, .menu-content').length) return false;
            if (text && !text.includes('ответ')) return false;

            return $el.is(':visible');
        });

        return candidates.last();
    }

    function hideRecentAnswerRow() {
        try {
            const isVisible = (el) => {
                if (!el) return false;
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
            };

            const getText = (el) => String(el && (el.innerText || el.textContent) || '').replace(/\s+/g, ' ').trim().toLowerCase();

            const labels = Array.from(document.querySelectorAll('div, span, button, a')).filter(el => {
                if (!isVisible(el)) return false;
                if (el.closest('.br-status-line, .br-status-buttons, .fr-box, .fr-toolbar, .fr-element, .fr-wrapper, #br-script-update-notice')) return false;

                const own = Array.from(el.childNodes)
                    .filter(n => n.nodeType === Node.TEXT_NODE)
                    .map(n => n.textContent)
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .toLowerCase();

                return own.includes('недавно');
            });

            labels.forEach(label => {
                let row = label.parentElement;
                let best = null;

                while (row && row !== document.body) {
                    const txt = getText(row);
                    const r = row.getBoundingClientRect();
                    const looksLikeRecentRow =
                        txt.includes('недавно') &&
                        (txt.includes('переношу') || txt.includes('быстрые ответы') || txt.includes('ответы') || txt.includes('вашу тему')) &&
                        r.height <= 90;

                    if (looksLikeRecentRow) {
                        best = row;
                        break;
                    }
                    row = row.parentElement;
                }

                const target = best || label.parentElement;
                if (target && !target.classList.contains('br-status-line')) {
                    target.classList.add('br-force-hide-recent');
                    target.style.setProperty('display', 'none', 'important');
                }
            });
        } catch (e) {
            console.error('[BR Script] Hide recent row error:', e);
        }
    }
    function getQuickReplyScope() {
        const replyBtn = getMainReplyButton();
        const editor = $('.fr-box:visible, .fr-wrapper:visible, .fr-element:visible').last();

        let scope = $();

        if (editor.length) {
            scope = editor.closest('form, .js-quickReply, .quickReply, .block-container, .message-responseRow, .message-cell').first();
        }

        if (!scope.length && replyBtn.length) {
            scope = replyBtn.closest('form, .js-quickReply, .quickReply, .block-container, .message-responseRow, .message-cell').first();
        }

        if (!scope.length) {
            scope = $('body');
        }

        return scope;
    }

    function getStatusInsertAnchor(scope) {
        const privacy = scope.find('div, p, span').filter(function () {
            const txt = String($(this).text() || '').replace(/\s+/g, ' ').trim().toLowerCase();
            return txt.includes('мы не собираем') && txt.includes('персональные данные');
        }).last();

        if (privacy.length) return privacy;

        const editorBox = scope.find('.fr-box:visible').last();
        if (editorBox.length) return editorBox;

        const editorWrapper = scope.find('.fr-wrapper:visible, .fr-element:visible').last();
        if (editorWrapper.length) return editorWrapper;

        const replyBtn = getMainReplyButton();
        if (replyBtn.length) return replyBtn.parent();

        return $();
    }

    function ensureStatusLine() {
        const scope = getQuickReplyScope();
        const anchor = getStatusInsertAnchor(scope);
        if (!anchor.length) return $();

        let line = $('.br-status-line').first();
        if (!line.length) {
            line = $('<div class="br-status-line"></div>');
        }

        // Если линия случайно попала в ряд штатных кнопок — переносим её под редактор.
        if (!line.parent().length || !line.prev().is(anchor)) {
            anchor.after(line);
        }

        let wrap = line.find('.br-status-buttons').first();
        if (!wrap.length) {
            wrap = $('<span class="br-status-buttons"></span>');
            line.prepend(wrap);
        }

        if (!line.find('#selectAnswers').length && $('#selectAnswers').length) {
            line.append($('#selectAnswers'));
        }

        return line;
    }

    function ensureStatusWrap() {
        const line = ensureStatusLine();
        if (!line.length) return $();
        return line.find('.br-status-buttons').first();
    }

    function addButton(name, id, style = "") {
        if ($(`#${id}`).length) return;

        const wrap = ensureStatusWrap();
        if (!wrap.length) return;

        wrap.append(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="background: transparent; ${style}">${name}</button>`
        );
    }

    function addAnswers() {
        if ($('#selectAnswers').length) {
            ensureStatusLine();
            return;
        }

        const line = ensureStatusLine();
        if (!line.length) return;

        line.append(
            `<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Ответы</button>`
        );
    }

    function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
        .map(
        (btn, i) =>
        `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:4px; border-radius: 13px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
    )
        .join('')}</div>`;
}

    function tasksMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

        function pasteContent(id, data = {}, send = false) {
		  if (!buttons[id] || !buttons[id].content) return;
		  const template = Handlebars.compile(buttons[id].content);
		  if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

		  $('span.fr-placeholder').empty();
		  $('div.fr-element.fr-view p').append(template(data));
		  $('a.overlay-titleCloser').trigger('click');

		  if(send == true){
			  editThreadData(buttons[id].prefix, buttons[id].status);
			  $('.button--icon.button--icon--reply.rippleButton').trigger('click');
		  }
	}
	function getThreadData() {
	const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
	const authorName = $('a.username').html();
	const hours = new Date().getHours();
	return {
	user: {
	id: authorID,
	name: authorName,
	mention: `[USER=${authorID}]${authorName}[/USER]`,
	},
	greeting: () =>
	4 < hours && hours <= 11 ?
	'Доброе утро' :
	11 < hours && hours <= 15 ?
	'Добрый день' :
	15 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	}

	function editThreadData(prefix, pin = false, may_lens = true) {
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	if(pin == false){
	fetch(`${document.URL}edit`, {
	method: 'POST',
	body: getFormData({
	prefix_id: prefix,
	title: threadTitle,
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
	}),
	}).then(() => location.reload());
	}
	if(pin == true){
	fetch(`${document.URL}edit`, {
	method: 'POST',
	body: getFormData({
	prefix_id: prefix,
	title: threadTitle,
	discussion_open: 1,
	sticky: 1,
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
	}),
	}).then(() => location.reload());
	}
	if(may_lens === true) {
	if(prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
	moveThread(prefix, 230); }

	if(prefix == WAIT_PREFIX) {
	moveThread(prefix, 917);
	}
	}
	}

	function moveThread(prefix, type) {
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	fetch(`${document.URL}move`, {
		method: 'POST',
		body: getFormData({
		prefix_id: prefix,
		title: threadTitle,
		target_node_id: type,
		redirect_type: 'none',
		notify_watchers: 1,
		starter_alert: 1,
		starter_alert_reason: "",
		_xfToken: XF.config.csrf,
		_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
		_xfWithData: 1,
		_xfResponseType: 'json',
	}),
	}).then(() => location.reload());
	}

	function getFormData(data) {
		const formData = new FormData();
		Object.entries(data).forEach(i => formData.append(i[0], i[1]));
		return formData;
	}
})();
