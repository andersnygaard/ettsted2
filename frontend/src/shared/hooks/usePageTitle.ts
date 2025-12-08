import { useEffect } from 'react';

/**
 * Sets the browser document title for the current page
 * @param title The page title (e.g., "Oversikt", "Portefølje")
 *
 * Usage:
 *   usePageTitle('Oversikt');
 *   // Browser tab will show: "Oversikt | Finans"
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Finans`;
  }, [title]);
}
