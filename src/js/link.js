// The certificate link (PRD R20, D2): `<origin>/c/#<identifier>.<name as typed, UTF-8, base64url>.<IANA zone>`.
// Everything after the # stays in the browser: it is never sent to a server or written to a log.
// (Jules, 2026-10-04)

/** base64url of the UTF-8 bytes of a string, without padding. */
export function base64url(text) {
  let bin = '';
  for (const b of new TextEncoder().encode(text)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** The fragment after `/c/#`. */
export function certificateFragment(identifier, name, zone) {
  return `${identifier}.${base64url(name)}.${zone}`;
}

/** The whole link, on the given origin. */
export function certificateLink(origin, identifier, name, zone) {
  return `${origin}/c/#${certificateFragment(identifier, name, zone)}`;
}

/** The name back from its base64url form; null when the bytes are not valid UTF-8 or not base64url. */
export function fromBase64url(text) {
  if (!/^[A-Za-z0-9_-]*$/.test(text) || text.length % 4 === 1) return null;
  try {
    const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/**
 * A link's fragment (what follows `/c/#`) read back into its three parts, as written; null when it
 * is not three parts, the name does not decode, or the zone is not one the browser knows. Whether
 * the identifier belongs to the name is the certificate page's judgment, not this one's.
 */
export function readFragment(fragment) {
  let f = String(fragment).replace(/^#/, '');
  try {
    f = decodeURIComponent(f);
  } catch {
    return null;
  }
  const parts = f.split('.');
  if (parts.length !== 3 || parts.some((p) => p === '')) return null;
  const [identifier, encoded, zone] = parts;
  const name = fromBase64url(encoded);
  if (name === null) return null;
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: zone });
  } catch {
    return null;
  }
  return { identifier, name, zone };
}
