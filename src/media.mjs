// Stock media manifest. Each key maps to processed files in assets/.
// Missing keys render a designed placeholder, so the page is complete either way.
import { asset, esc } from './layout.mjs';

export const stock = {
  // key: { img: 'img/x.jpg', video: 'video/x.mp4', alt: '...', pos: 'center' }
};

export function media(key, { video = true, cls = '', eager = false, sizes = '' } = {}) {
  const m = stock[key];
  if (key === 'nodaysoff' && !m) {
    return `<div class="media media-type ${cls}" aria-hidden="true"><span class="mt-word">NoDaysOff</span><span class="mt-line">Built for the consistent.</span><i></i></div>`;
  }
  if (!m) {
    return `<div class="media media-ph media-ph-${key} ${cls}" aria-hidden="true"><i></i><i></i><i></i></div>`;
  }
  const pos = m.pos ? ` style="object-position:${m.pos}"` : '';
  const img = `<img src="${asset(m.img)}" alt="${esc(m.alt || '')}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${pos} width="${m.w || 1600}" height="${m.h || 900}">`;
  const vid = video && m.video
    ? `<video muted loop playsinline preload="none" data-src="${asset(m.video)}" aria-hidden="true" tabindex="-1"${pos}></video>`
    : '';
  return `<div class="media ${vid ? 'has-video' : ''} ${cls}">${img}${vid}</div>`;
}
