import { useEffect } from 'react';

const BASE = 'GMPP';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE;
    return () => { document.title = BASE; };
  }, [title]);
}
