import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const storagePrefix = 'lotus-scroll:';

function readPosition(key) {
    try {
        const value = sessionStorage.getItem(storagePrefix + key);
        return value === null ? null : Number(value);
    } catch {
        return null;
    }
}

function savePosition(key) {
    try {
        sessionStorage.setItem(storagePrefix + key, String(window.scrollY));
    } catch {
        // Scroll restoration is a convenience; private browsing may block storage.
    }
}

function ScrollRestoration() {
    const location = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        window.history.scrollRestoration = 'manual';
        const key = location.key;
        const savedPosition = navigationType === 'POP' ? readPosition(key) : null;
        let animationFrame;
        let attempts = 0;

        const restore = () => {
            const position = savedPosition ?? 0;
            const maxPosition = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

            // Wait for a restored list's async content before applying its saved position.
            if (position > maxPosition && attempts < 60) {
                attempts += 1;
                animationFrame = window.requestAnimationFrame(restore);
                return;
            }
            window.scrollTo(0, Math.min(position, maxPosition));
        };

        animationFrame = window.requestAnimationFrame(restore);
        return () => {
            window.cancelAnimationFrame(animationFrame);
            savePosition(key);
        };
    }, [location.key, navigationType]);

    return null;
}

export default ScrollRestoration;
