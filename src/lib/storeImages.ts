const FALLBACKS: Array<{ keywords: string[]; url: string }> = [
  {
    keywords: ['burger', 'burguer', 'hamburguesa'],
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['pizza'],
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['cafe', 'cafetería', 'cafeteria', 'café'],
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['wrap', 'bowl', 'saludable'],
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['sushi', 'japo'],
    url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['taco', 'mex'],
    url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['pollo', 'chicken'],
    url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['jugo', 'fruta', 'smoothie'],
    url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=1200&q=80',
  },
];

const DEFAULT_STORE_IMAGE =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';

export function getStoreImageFallback(nombre: string): string {
  const n = nombre.toLowerCase();
  for (const { keywords, url } of FALLBACKS) {
    if (keywords.some((k) => n.includes(k))) return url;
  }
  return DEFAULT_STORE_IMAGE;
}
