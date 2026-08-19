import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const storagePrefix = 'lotus-scroll:';
const restoreTimeoutMs = 4000;

function readPosition(key) {
    try {
        const value = sessionStorage.getItem(storagePrefix + key);
        return value === null ? null : Number(value);
    } catch {
        return null;
    }
}

function savePosition(key, position) {
    try {
        sessionStorage.setItem(storagePrefix + key, String(position));
    } catch {
        // Scroll restoration is a convenience; private browsing may block storage.
    }
}

function jumpTo(position) {
    try {
        window.scrollTo({ top: position, left: 0, behavior: 'instant' });
    } catch {
        // Older browsers reject behavior: 'instant'; fall back to an auto scroll.
        window.scrollTo(0, position);
    }
}

function ScrollRestoration() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const scrollRef = useRef(0);
    const keyRef = useRef(location.key);

    // Track the live scroll offset as the user moves, before any navigation can
    // collapse the document and clamp window.scrollY.
    useEffect(() => {
        const onScroll = () => {
            scrollRef.current = window.scrollY;
        };
        window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll, { capture: true });
    }, []);

    // Flush the outgoing page's position in a layout effect, which runs before
    // the browser lays out the shorter incoming page and clamps the offset.
    useLayoutEffect(() => {
        savePosition(keyRef.current, scrollRef.current);
        keyRef.current = location.key;
    }, [location.key]);

    // Persist the current position when the tab is hidden or closed mid-page,
    // so a session restore (which replays as a POP) can return to it.
    useEffect(() => {
        const flush = () => savePosition(keyRef.current, scrollRef.current);
        window.addEventListener('pagehide', flush);
        return () => window.removeEventListener('pagehide', flush);
    }, []);

    useEffect(() => {
        window.history.scrollRestoration = 'manual';
        if (navigationType !== 'POP') return;

        const key = location.key;
        const savedPosition = readPosition(key);
        if (savedPosition === null) return;

        const startedAt = performance.now();
        let animationFrame;

        const restore = () => {
            const maxPosition = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

            // Wait for the restored list's async content before applying its saved position.
            if (savedPosition > maxPosition && performance.now() - startedAt < restoreTimeoutMs) {
                animationFrame = window.requestAnimationFrame(restore);
                return;
            }
            jumpTo(Math.min(savedPosition, maxPosition));
        };

        animationFrame = window.requestAnimationFrame(restore);
        return () => {
            window.cancelAnimationFrame(animationFrame);
        };
    }, [location.key, navigationType]);

    return null;
}

export default ScrollRestoration;
