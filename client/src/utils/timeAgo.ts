export function timeAgo(iso: string): string {

  const diff = Date.now() - new Date(iso).getTime();

  const m = Math.floor(diff / 60000);

  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;

  const h = Math.floor(m / 60);

  if (h < 24) return `há ${h}h`;

  const d = Math.floor(h / 24);
  
  return `há ${d}d`;
}