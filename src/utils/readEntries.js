const storageKey = 'lotus-read-entry-ids';

function readStoredIds() {
    try {
        const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
        return Array.isArray(value) ? value.map(String) : [];
    } catch {
        return [];
    }
}

export function isEntryRead(id) {
    return readStoredIds().includes(String(id));
}

export function markEntryRead(id) {
    if (id === undefined || id === null) {
        return;
    }

    const normalizedId = String(id);
    const ids = readStoredIds();
    if (ids.includes(normalizedId)) {
        return;
    }

    try {
        localStorage.setItem(storageKey, JSON.stringify([...ids, normalizedId]));
        window.dispatchEvent(new Event('lotus-read-entry'));
    } catch {
        // Read markers are optional when storage is unavailable.
    }
}
