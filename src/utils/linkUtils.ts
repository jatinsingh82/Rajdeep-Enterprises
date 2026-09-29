/**
 * Utility for safely opening external links (e.g. WhatsApp, dialer, email)
 * Avoids direct window.open calls that may be blocked in sandboxed iframes.
 */
export function openExternalLink(url: string): void {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    window.location.href = url;
  }
}
