// Thin wrappers around date-fns to keep UI clean
import { format, isValid, parseISO } from 'date-fns';

export function formatDue(iso, fallback = 'No date') {
  try {
    if (!iso) return fallback;
    const d = typeof iso === 'string' ? parseISO(iso) : new Date(iso);
    if (!isValid(d)) return fallback;
    return format(d, 'PPP'); // e.g., Jan 1, 2025
  } catch {
    return fallback;
  }
}