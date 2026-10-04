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
