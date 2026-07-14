import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDate(date) {
  if (!date) return '-';
  return format(new Date(date), 'd MMMM yyyy', { locale: id });
}

export function splitLines(value) {
  return String(value || '')
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}
