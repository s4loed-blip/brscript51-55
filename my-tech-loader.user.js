// ==UserScript==
// @name         My Tech Script Loader
// @namespace    https://github.com/s4loed-blip/brscript51-55
// @version      0.3.0
// @description  Для работы отдела 41-45 / 51-55
// @author       tech51
// @match        https://forum.blackrussia.online/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/s4loed-blip/brscript51-55/main/my-tech-loader.user.js
// @downloadURL  https://raw.githubusercontent.com/s4loed-blip/brscript51-55/main/my-tech-loader.user.js
// ==/UserScript==

(() => {
    'use strict';

    const CONFIG = {
        sourceUrl: 'https://raw.githubusercontent.com/s4loed-blip/brscript51-55/main/forum-buttons.js',
        timeoutMs: 10000,
        retries: 3,
        retryDelayMs: 900,
        cacheKey: 'my_tech_script_cache_v3',
        oldCacheKeys: ['my_tech_script_cache_v2', 'my_tech_script_cache'],
        reloadKey: 'my_tech_loader_last_forced_reload_build',
        debug: false,
        build: 'loader-0.3.0-build-aware-20260611-001'
    };

    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const log = (...args) => CONFIG.debug && console.log('[My Tech Loader]', ...args);

    let alreadyRan = false;
    let runningBuild = null;
    let runningCode = null;
    let cacheFallbackTimer = null;

    function normalizeCache(raw) {
        if (!raw) return null;
        if (typeof raw === 'string') return { code: raw, buildId: extractBuildId(raw), savedAt: 0 };
        if (raw.code) return { code: raw.code, buildId: raw.buildId || extractBuildId(raw.code), savedAt: raw.savedAt || 0 };
        return null;
    }

    function getCache() {
        try {
            const main = normalizeCache(GM_getValue(CONFIG.cacheKey));
            if (main && !looksBad(main.code)) return main;
            for (const key of CONFIG.oldCacheKeys) {
                const old = normalizeCache(GM_getValue(key));
                if (old && !looksBad(old.code)) return old;
            }
        } catch (e) {}
        return null;
    }

    function setCache(code) {
        try {
            GM_setValue(CONFIG.cacheKey, {
                savedAt: Date.now(),
                loaderBuild: CONFIG.build,
                buildId: extractBuildId(code),
                version: extractVersion(code),
                code
            });
        } catch (e) {}
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForDocumentElement() {
        return new Promise(resolve => {
            if (document.documentElement) return resolve();
            const timer = setInterval(() => {
                if (document.documentElement) {
                    clearInterval(timer);
                    resolve();
                }
            }, 10);
        });
    }

    function waitForPageJquery(maxMs = 8000) {
        return new Promise(resolve => {
            const started = Date.now();
            const timer = setInterval(() => {
                if (pageWindow.jQuery || Date.now() - started >= maxMs) {
                    clearInterval(timer);
                    resolve();
                }
            }, 50);
        });
    }

    function looksBad(code) {
        const s = String(code || '');
        return !s.trim() || s.includes('My Tech Script Loader') || !s.includes('BR_SCRIPT_BUILD_ID');
    }

    function extractBuildId(code) {
        const m = String(code || '').match(/BR_SCRIPT_BUILD_ID\s*=\s*['"]([^'"]+)['"]/);
        return m ? m[1] : null;
    }

    function extractVersion(code) {
        const m = String(code || '').match(/BR_SCRIPT_VERSION\s*=\s*['"]([^'"]+)['"]/);
        return m ? m[1] : null;
    }

    function runInPage(code, reason) {
        if (alreadyRan || looksBad(code)) return false;
        alreadyRan = true;
        runningCode = code;
        runningBuild = extractBuildId(code);

        const script = document.createElement('script');
        script.textContent = `${code}\n//# sourceURL=brscript-forum-buttons-${reason}.js`;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
        log('ran', reason, runningBuild);
        return true;
    }

    async function fetchSource(attempt = 1) {
        try {
            const separator = CONFIG.sourceUrl.includes('?') ? '&' : '?';
            const freshUrl = `${CONFIG.sourceUrl}${separator}t=${Date.now()}&loader=${encodeURIComponent(CONFIG.build)}`;

            const response = await Promise.race([
                fetch(freshUrl, { cache: 'no-store' }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), CONFIG.timeoutMs))
            ]);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const code = await response.text();
            if (looksBad(code)) throw new Error('bad source');
            return code;
        } catch (error) {
            if (attempt < CONFIG.retries) {
                await wait(CONFIG.retryDelayMs);
                return fetchSource(attempt + 1);
            }
            throw error;
        }
    }

    function forceReloadForFreshBuild(freshBuild) {
        if (!freshBuild || freshBuild === runningBuild) return;
        try {
            const lastReloaded = GM_getValue(CONFIG.reloadKey);
            if (lastReloaded === freshBuild) return;
            GM_setValue(CONFIG.reloadKey, freshBuild);
        } catch (e) {}
        setTimeout(() => pageWindow.location.reload(), 250);
    }

    async function main() {
        await waitForDocumentElement();

        const cached = getCache();

        if (cached && cached.code && !looksBad(cached.code)) {
            cacheFallbackTimer = setTimeout(() => {
                waitForPageJquery(8000).then(() => runInPage(cached.code, 'cache'));
            }, 350);
        }

        try {
            const freshCode = await fetchSource();
            const freshBuild = extractBuildId(freshCode);
            setCache(freshCode);

            if (cacheFallbackTimer) {
                clearTimeout(cacheFallbackTimer);
                cacheFallbackTimer = null;
            }

            if (!alreadyRan) {
                await waitForPageJquery(8000);
                runInPage(freshCode, 'fresh');
                return;
            }

            if (freshCode !== runningCode && freshBuild !== runningBuild) {
                forceReloadForFreshBuild(freshBuild);
            }
        } catch (error) {
            console.error('[My Tech Loader] Не удалось загрузить свежий forum-buttons.js', error);
            if (!alreadyRan && cached && cached.code && !looksBad(cached.code)) {
                if (cacheFallbackTimer) clearTimeout(cacheFallbackTimer);
                await waitForPageJquery(8000);
                runInPage(cached.code, 'cache-after-fetch-error');
            }
        }
    }

    main();
    pageWindow.rMyTechScript = () => pageWindow.location.reload();
})();
