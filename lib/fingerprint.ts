/**
 * Lightweight, zero-dependency device fingerprinter.
 * Collects non-PII browser characteristics to create a unique hash.
 * This is used for velocity checks to prevent automated scripts from spamming endpoints,
 * even if they rotate IP addresses.
 */

async function sha256(message: string): Promise<string> {
  // Use Web Crypto API if available (in browser)
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for SSR or older browsers
  return btoa(message).replace(/=/g, '');
}

export async function generateDeviceFingerprint(): Promise<string> {
  if (typeof window === 'undefined') {
    return 'ssr-fallback';
  }

  const { navigator, screen } = window;
  
  // Collect stable properties
  const properties = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency || 'unknown',
    navigator.maxTouchPoints || 0,
    // Note: avoid highly volatile properties that change per session
  ];

  const rawString = properties.join('|');
  return sha256(rawString);
}
