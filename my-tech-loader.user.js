// ==UserScript==
// @name         My Tech Script Loader
// @namespace    https://github.com/s4loed-blip/brscript51-55
// @version      0.1.1
// @description  Для работы отдела 51-55
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
        sourceUrl: 'https://raw.githubusercontent.com/s4loed-blip/brscript51-55/main/forum-buttons51-55.js',
        timeoutMs: 10000,
        retries: 3,
        retryDelayMs: 2000,
        cacheKey: 'my_tech_script_cache',
        debug: false,
    };

    const log = (...args) => CONFIG.debug && console.log('[My Tech Loader]', ...args);
    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    function getCache() {
        try {
            return GM_getValue(CONFIG.cacheKey) || null;
        } catch {
            return null;
        }
    }

    function setCache(code) {
        try {
            GM_setValue(CONFIG.cacheKey, { savedAt: Date.now(), code });
        } catch {
            // Кэш необязателен.
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForDocument() {
        return new Promise(resolve => {
            if (document.documentElement) {
                resolve();
                return;
            }

            const timer = setInterval(() => {
                if (document.documentElement) {
                    clearInterval(timer);
                    resolve();
                }
            }, 50);
        });
    }

    function waitForPageJquery() {
        return new Promise(resolve => {
            const timer = setInterval(() => {
                if (pageWindow.jQuery) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);

            // Если jQuery вдруг не появился, всё равно запускаем через 8 секунд.
            setTimeout(() => {
                clearInterval(timer);
                resolve();
            }, 8000);
        });
    }

    async function fetchSource(attempt = 1) {
        try {
            log(`fetch ${attempt}/${CONFIG.retries}`);

            const separator = CONFIG.sourceUrl.includes('?') ? '&' : '?';
            const freshUrl = `${CONFIG.sourceUrl}${separator}v=${Date.now()}`;

            const response = await Promise.race([
                fetch(freshUrl, { cache: 'no-store' }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), CONFIG.timeoutMs)),
            ]);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const code = await response.text();

            if (!code.trim() || code.includes('<!DOCTYPE html')) {
                throw new Error('bad source');
            }

            return code;
        } catch (error) {
            if (attempt < CONFIG.retries) {
                await sleep(CONFIG.retryDelayMs);
                return fetchSource(attempt + 1);
            }

            throw error;
        }
    }

    function runInPage(code) {
        const script = document.createElement('script');
        script.textContent = code;
        document.documentElement.appendChild(script);
        script.remove();
    }

    (async () => {
        try {
            await waitForDocument();

            const code = await fetchSource();
            setCache(code);

            await waitForPageJquery();
            runInPage(code);
        } catch (error) {
            const cache = getCache();

            if (cache && cache.code) {
                await waitForDocument();
                await waitForPageJquery();
                runInPage(cache.code);
                return;
            }

            console.error('[My Tech Loader] no network and no cache', error);
        }
    })();

    pageWindow.rMyTechScript = () => pageWindow.location.reload();
})();
